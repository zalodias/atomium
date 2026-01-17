import type { Difficulty } from '@/constants/difficulty';
import { supabase } from '@/lib/supabase';
import type { GameContextValue, GameState, Team } from '@/types/game';
import { generateGameCode } from '@/utils/game';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

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
        (payload) => {
          const updatedGame = payload.new as { is_started: boolean };
          setGame(prev => {
            if (!prev) return null;
            return {
              ...prev,
              isStarted: updatedGame.is_started,
            };
          });
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
    
    const { error } = await supabase
      .from('games')
      .update({ is_started: true })
      .eq('id', game.id);

    if (error) {
      console.error('Error starting game:', error);
      return;
    }

    setGame(prev => {
      if (!prev) return null;
      return {
        ...prev,
        isStarted: true,
      };
    });
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
    isHost,
    currentTeam,
    allReady,
    isLoading,
  }), [game, createGame, joinGame, toggleReady, startGame, leaveGame, isHost, currentTeam, allReady, isLoading]);

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
