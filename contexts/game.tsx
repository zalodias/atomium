import type { Difficulty } from '@/constants/difficulty';
import { supabase } from '@/lib/supabase';
import type { Atom, GameContextValue, GameState, Inventory, Molecule, MoleculeStructure, Question, Team } from '@/types/game';
import { generateGameCode } from '@/utils/game';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const QUESTION_TIME_SECONDS = 20;

const GameContext = createContext<GameContextValue | null>(null);

interface GameProviderProps {
  children: React.ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [game, setGame] = useState<GameState | null>(null);
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  
  const subscribeToGame = useCallback((gameId: string) => {
    if (channel) {
      supabase.removeChannel(channel);
    }

    const newChannel = supabase
      .channel(`game:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teams',
          filter: `game_id=eq.${gameId}`,
        },
        async () => {
          const { data: teams } = await supabase
            .from('teams')
            .select('*')
            .eq('game_id', gameId);

          if (teams) {
            setGame(prev => {
              if (!prev) return null;
              return {
                ...prev,
                teams: teams.map(t => ({
                  id: t.id,
                  name: t.name,
                  status: t.status,
                  isHost: t.is_host,
                })),
              };
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`,
        },
        async (payload) => {
          const updatedGame = payload.new as { 
            is_started: boolean; 
            molecule_id: string | null;
            current_question_id: string | null;
            current_question_started_at: string | null;
            question_number: number;
            total_questions: number;
          };
          
          // Fetch molecule data if molecule_id is set
          let moleculeData: Molecule | null = null;
          if (updatedGame.molecule_id) {
            const { data: molecule } = await supabase
              .from('molecules')
              .select('*')
              .eq('id', updatedGame.molecule_id)
              .single();
            if (molecule) {
              moleculeData = {
                id: molecule.id,
                name: molecule.name,
                formula: molecule.formula,
                description: molecule.description,
                composition: molecule.composition as unknown as Atom[],
                structure: molecule.structure as unknown as MoleculeStructure,
                difficulty: molecule.difficulty,
              };
            }
          }
          
          // Fetch question data if current_question_id is set
          let questionData: Question | undefined = undefined;
          if (updatedGame.current_question_id) {
            const { data: question } = await supabase
              .from('questions')
              .select('*')
              .eq('id', updatedGame.current_question_id)
              .single();
            if (question) {
              questionData = {
                id: question.id,
                text: question.text,
                type: question.type,
                answer: question.answer,
                options: question.options as string[] | undefined,
                difficulty: question.difficulty,
              };
            }
          }
          
          setGame(prev => {
            if (!prev) return null;
            return {
              ...prev,
              isStarted: updatedGame.is_started,
              molecule: moleculeData || prev.molecule,
              currentQuestion: questionData,
              questionStartedAt: updatedGame.current_question_started_at 
                ? new Date(updatedGame.current_question_started_at).getTime() 
                : undefined,
              questionNumber: updatedGame.question_number,
              totalQuestions: updatedGame.total_questions,
              hasAnswered: false,
            };
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory',
          filter: `game_id=eq.${gameId}`,
        },
        async () => {
          const { data: inventories } = await supabase
            .from('inventory')
            .select('*')
            .eq('game_id', gameId);
          
          if (inventories) {
            const teamInventories: Record<string, Inventory[]> = {};
            for (const inv of inventories) {
              if (!teamInventories[inv.team_id]) {
                teamInventories[inv.team_id] = [];
              }
              teamInventories[inv.team_id].push({
                element: inv.element,
                count: inv.count,
              });
            }
            
            setGame(prev => {
              if (!prev) return null;
              return {
                ...prev,
                teamInventories,
              };
            });
          }
        }
      )
      .subscribe();

    setChannel(newChannel);
  }, [channel]);

  useEffect(() => {
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [channel]);

  const createGame = useCallback(async (teamName: string, difficulty: Difficulty): Promise<string | null> => {
    setIsLoading(true);
    
    try {
      const code = generateGameCode();
      
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .insert({
          code,
          difficulty,
          host_id: '00000000-0000-0000-0000-000000000000',
          is_started: false,
        })
        .select()
        .single();

      if (gameError || !gameData) {
        console.error('Error creating game:', gameError);
        return null;
      }

      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          game_id: gameData.id,
          name: teamName,
          status: 'ready',
          is_host: true,
        })
        .select()
        .single();

      if (teamError || !team) {
        console.error('Error creating team:', teamError);
        await supabase.from('games').delete().eq('id', gameData.id);
        return null;
      }

      const { error: updateError } = await supabase
        .from('games')
        .update({ host_id: team.id })
        .eq('id', gameData.id);

      if (updateError) {
        console.error('Error updating game host_id:', updateError);
        await supabase.from('teams').delete().eq('id', team.id);
        await supabase.from('games').delete().eq('id', gameData.id);
        return null;
      }

      const hostTeam: Team = {
        id: team.id,
        name: teamName,
        status: 'ready',
        isHost: true,
      };

      const newGame: GameState = {
        id: gameData.id,
        code,
        difficulty,
        teams: [hostTeam],
        hostId: team.id,
        currentTeamId: team.id,
        isStarted: false,
        questionNumber: 0,
        totalQuestions: 10,
        teamInventories: {},
        hasAnswered: false,
      };

      setGame(newGame);
      setCurrentTeamId(team.id);
      subscribeToGame(gameData.id);
      
      return code;
    } catch (error) {
      console.error('Error in createGame:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [subscribeToGame]);

  const joinGame = useCallback(async (code: string, teamName: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('code', code)
        .single();

      if (gameError || !gameData) {
        console.error('Game not found:', gameError);
        return false;
      }

      if (gameData.is_started) {
        console.error('Game has already started');
        return false;
      }

      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          game_id: gameData.id,
          name: teamName,
          status: 'idle',
          is_host: false,
        })
        .select()
        .single();

      if (teamError || !team) {
        console.error('Error creating team:', teamError);
        return false;
      }

      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .eq('game_id', gameData.id);

      if (teamsError || !teams) {
        console.error('Error fetching teams:', teamsError);
        return false;
      }

      const newGame: GameState = {
        id: gameData.id,
        code: gameData.code,
        difficulty: gameData.difficulty,
        teams: teams.map(t => ({
          id: t.id,
          name: t.name,
          status: t.status,
          isHost: t.is_host,
        })),
        hostId: gameData.host_id,
        currentTeamId: team.id,
        isStarted: gameData.is_started,
        questionNumber: gameData.question_number,
        totalQuestions: gameData.total_questions,
        teamInventories: {},
        hasAnswered: false,
      };

      setGame(newGame);
      setCurrentTeamId(team.id);
      subscribeToGame(gameData.id);
      
      return true;
    } catch (error) {
      console.error('Error in joinGame:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [subscribeToGame]);

  const toggleReady = useCallback(async () => {
    if (!game || !currentTeamId) return;

    const currentTeam = game.teams.find(t => t.id === currentTeamId);
    if (!currentTeam) return;

    const newStatus = currentTeam.status === 'ready' ? 'idle' : 'ready';

    const { error } = await supabase
      .from('teams')
      .update({ status: newStatus })
      .eq('id', currentTeamId);

    if (error) {
      console.error('Error updating team status:', error);
      return;
    }

    setGame(prev => {
      if (!prev) return null;
      return {
        ...prev,
        teams: prev.teams.map(team => 
          team.id === currentTeamId
            ? { ...team, status: newStatus }
            : team
        ),
      };
    });
  }, [game, currentTeamId]);

  const startGame = useCallback(async () => {
    if (!game) return;
    
    try {
      // 1. Select random molecule based on difficulty
      const { data: molecules, error: moleculeError } = await supabase
        .from('molecules')
        .select('*')
        .eq('difficulty', game.difficulty);
        
      if (moleculeError || !molecules || molecules.length === 0) {
        console.error('No molecules found for difficulty:', game.difficulty, moleculeError);
        return;
      }
      
      // Pick a random molecule from the available ones
      const randomMolecule = molecules[Math.floor(Math.random() * molecules.length)];
      
      // 2. Update game with molecule_id and is_started
      const { error } = await supabase
        .from('games')
        .update({ 
          molecule_id: randomMolecule.id,
          is_started: true 
        })
        .eq('id', game.id);

      if (error) {
        console.error('Error starting game:', error);
        return;
      }

      // State will be updated via realtime subscription
    } catch (error) {
      console.error('Error in startGame:', error);
    }
  }, [game]);

  const leaveGame = useCallback(async () => {
    if (game && currentTeamId) {
      await supabase
        .from('teams')
        .delete()
        .eq('id', currentTeamId);
    }

    if (channel) {
      supabase.removeChannel(channel);
      setChannel(null);
    }

    setGame(null);
    setCurrentTeamId(null);
  }, [game, currentTeamId, channel]);

  const loadNextQuestion = useCallback(async () => {
    if (!game) return;
    
    try {
      // Get questions that haven't been asked yet in this game
      const { data: askedQuestions } = await supabase
        .from('answers')
        .select('question_id')
        .eq('game_id', game.id);
      
      const askedQuestionIds = askedQuestions?.map(a => a.question_id) || [];
      
      // Get a random question that matches game difficulty and hasn't been asked
      let query = supabase
        .from('questions')
        .select('*')
        .eq('difficulty', game.difficulty);
      
      if (askedQuestionIds.length > 0) {
        query = query.not('id', 'in', `(${askedQuestionIds.join(',')})`);
      }
      
      const { data: questions, error: questionsError } = await query;
      
      if (questionsError || !questions || questions.length === 0) {
        console.error('No more questions available:', questionsError);
        return;
      }
      
      // Pick a random question
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      const now = new Date().toISOString();
      
      // Update game with new question
      const { error: updateError } = await supabase
        .from('games')
        .update({
          current_question_id: randomQuestion.id,
          current_question_started_at: now,
          question_number: game.questionNumber + 1,
        })
        .eq('id', game.id);
      
      if (updateError) {
        console.error('Error loading next question:', updateError);
        return;
      }
      
      // State will be updated via realtime subscription
    } catch (error) {
      console.error('Error in loadNextQuestion:', error);
    }
  }, [game]);

  const submitAnswer = useCallback(async (answer: string, atomToAward?: string): Promise<boolean> => {
    if (!game || !currentTeamId || !game.currentQuestion) return false;
    
    try {
      const isCorrect = answer === game.currentQuestion.answer;
      
      // Insert team answer
      const { error: answerError } = await supabase
        .from('answers')
        .insert({
          team_id: currentTeamId,
          game_id: game.id,
          question_id: game.currentQuestion.id,
          selected_answer: answer,
          is_correct: isCorrect,
          answered_at: new Date().toISOString(),
        });
      
      if (answerError) {
        console.error('Error submitting answer:', answerError);
        return false;
      }
      
      // If correct, award the specified atom only if it's still needed
      if (isCorrect && game.molecule && atomToAward) {
        const composition = game.molecule.composition;
        const requiredAtom = composition.find(atom => atom.element === atomToAward);
        
        if (requiredAtom) {
          // Check current inventory for this element
          const currentInventory = game.teamInventories[currentTeamId] || [];
          const currentCount = currentInventory.find(inv => inv.element === atomToAward)?.count || 0;
          
          // Only award if we haven't reached the required amount
          if (currentCount < requiredAtom.count) {
            // Check if inventory row exists
            const { data: existing } = await supabase
              .from('inventory')
              .select('*')
              .eq('game_id', game.id)
              .eq('team_id', currentTeamId)
              .eq('element', atomToAward)
              .single();
            
            if (existing) {
              await supabase
                .from('inventory')
                .update({ count: existing.count + 1 })
                .eq('id', existing.id);
            } else {
              await supabase
                .from('inventory')
                .insert({
                  team_id: currentTeamId,
                  game_id: game.id,
                  element: atomToAward,
                  count: 1,
                });
            }
          }
        }
      }
      
      // Update local state to mark as answered
      setGame(prev => {
        if (!prev) return null;
        return {
          ...prev,
          hasAnswered: true,
        };
      });
      
      return isCorrect;
    } catch (error) {
      console.error('Error in submitAnswer:', error);
      return false;
    }
  }, [game, currentTeamId]);

  const getCurrentInventory = useCallback((): Inventory[] => {
    if (!game || !currentTeamId) return [];
    return game.teamInventories[currentTeamId] || [];
  }, [game, currentTeamId]);

  const currentTeam = useMemo(() => {
    if (!game || !currentTeamId) return null;
    return game.teams.find(t => t.id === currentTeamId) || null;
  }, [game, currentTeamId]);

  const isHost = useMemo(() => {
    return currentTeam?.isHost ?? false;
  }, [currentTeam]);

  const allReady = useMemo(() => {
    if (!game || game.teams.length === 0) return false;
    return game.teams.every(team => team.status === 'ready');
  }, [game]);

  const value: GameContextValue = useMemo(() => ({
    game,
    createGame,
    joinGame,
    toggleReady,
    startGame,
    leaveGame,
    loadNextQuestion,
    submitAnswer,
    getCurrentInventory,
    isHost,
    currentTeam,
    allReady,
    isLoading,
  }), [game, createGame, joinGame, toggleReady, startGame, leaveGame, loadNextQuestion, submitAnswer, getCurrentInventory, isHost, currentTeam, allReady, isLoading]);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
