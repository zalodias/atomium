import { AnswerButton } from '@/components/answer-button';
import { InventoryBar } from '@/components/inventory-bar';
import { ResultModal } from '@/components/result-modal';
import { Timer } from '@/components/timer';
import { useGame } from '@/contexts/game';
import { colors, typography } from '@/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const QUESTION_TIME_SECONDS = 20;

export default function Game() {
  const router = useRouter();
  const { 
    game, 
    isHost, 
    currentTeam,
    loadNextQuestion, 
    submitAnswer, 
    getCurrentInventory 
  } = useGame();
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [earnedAtom, setEarnedAtom] = useState<string | undefined>();
  const [currentQuestionAtom, setCurrentQuestionAtom] = useState<string | undefined>();

  // Redirect if game is not started or no game exists
  useEffect(() => {
    if (!game || !game.isStarted) {
      router.replace('/');
    }
  }, [game, router]);

  // Reset state when new question loads
  useEffect(() => {
    if (game?.currentQuestion && currentTeam) {
      setSelectedAnswer(null);
      setHasSubmitted(false);
      setIsCorrect(false);
      setShowResult(false);
      setEarnedAtom(undefined);
      
      // Determine the atom for this question - only atoms that are still needed
      if (game.molecule) {
        const composition = game.molecule.composition;
        const currentInventory = game.teamInventories[currentTeam.id] || [];
        
        // Find atoms that are still needed (collected < required)
        const neededAtoms = composition.filter(atom => {
          const collected = currentInventory.find(inv => inv.element === atom.element)?.count || 0;
          return collected < atom.count;
        });
        
        if (neededAtoms.length > 0) {
          const randomAtom = neededAtoms[Math.floor(Math.random() * neededAtoms.length)];
          setCurrentQuestionAtom(randomAtom.element);
        } else {
          // All atoms collected - no more atoms to award
          setCurrentQuestionAtom(undefined);
        }
      }
    }
  }, [game?.currentQuestion?.id, game?.molecule, game?.teamInventories, currentTeam]);

  // Load first question when game starts (host only)
  useEffect(() => {
    if (game?.isStarted && !game.currentQuestion && isHost && game.questionNumber === 0) {
      loadNextQuestion();
    }
  }, [game?.isStarted, game?.currentQuestion, game?.questionNumber, isHost, loadNextQuestion]);

  const handleSelectAnswer = useCallback(async (answer: string) => {
    if (hasSubmitted || !game?.currentQuestion) return;
    
    setSelectedAnswer(answer);
    setHasSubmitted(true);
    
    const correct = await submitAnswer(answer, currentQuestionAtom);
    setIsCorrect(correct);
    
    // If correct, the earned atom is the current question atom
    if (correct && currentQuestionAtom) {
      setEarnedAtom(currentQuestionAtom);
    }
    
    setShowResult(true);
  }, [hasSubmitted, game?.currentQuestion, currentQuestionAtom, submitAnswer]);

  const handleTimeUp = useCallback(async () => {
    if (hasSubmitted) return;
    
    setHasSubmitted(true);
    setIsCorrect(false);
    setShowResult(true);
    
    // Submit empty answer to record timeout
    if (game?.currentQuestion) {
      await submitAnswer('', currentQuestionAtom);
    }
  }, [hasSubmitted, game?.currentQuestion, currentQuestionAtom, submitAnswer]);

  const handleNextQuestion = useCallback(async () => {
    setShowResult(false);
    await loadNextQuestion();
  }, [loadNextQuestion]);

  const inventory = getCurrentInventory();

  // Loading state
  if (!game?.currentQuestion) {
    return (
      <LinearGradient
        style={styles.container}
        colors={[colors.background.brand.subtle, colors.background.brand.faded]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>A carregar pergunta...</Text>
        </View>
      </LinearGradient>
    );
  }

  const question = game.currentQuestion;
  const questionStartTime = game.questionStartedAt || Date.now();
  
  // Generate options for true/false questions
  const options = question.type === 'true_false' 
    ? ['Verdadeiro', 'Falso']
    : question.options || [];

  const getAnswerState = (option: string) => {
    if (!hasSubmitted) {
      return selectedAnswer === option ? 'selected' : 'default';
    }
    
    // After submission, show correct/incorrect
    const isThisCorrect = option === question.answer;
    const isThisSelected = selectedAnswer === option;
    
    if (isThisCorrect) return 'correct';
    if (isThisSelected && !isThisCorrect) return 'incorrect';
    return 'disabled';
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={[colors.background.brand.subtle, colors.background.brand.faded]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.header}>
        {currentQuestionAtom && (
          <View style={styles.currentAtomBadge}>
            <Text style={styles.currentAtomLabel}>Átomo</Text>
            <View style={styles.currentAtomCircle}>
              <Text style={styles.currentAtomElement}>{currentQuestionAtom}</Text>
            </View>
          </View>
        )}
        <InventoryBar 
          inventory={inventory}
          moleculeComposition={game.molecule?.composition || []}
        />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.timerContainer}>
          <Timer
            duration={QUESTION_TIME_SECONDS}
            startTime={questionStartTime}
            onTimeUp={handleTimeUp}
            isPaused={hasSubmitted}
          />
        </View>

        <Text style={styles.questionText}>{question.text}</Text>

        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <AnswerButton
              key={index}
              label={option}
              state={getAnswerState(option)}
              onPress={() => handleSelectAnswer(option)}
              disabled={hasSubmitted}
            />
          ))}
        </View>
      </ScrollView>

      <ResultModal
        visible={showResult}
        isCorrect={isCorrect}
        correctAnswer={question.answer}
        earnedAtom={earnedAtom}
        onContinue={handleNextQuestion}
        isHost={isHost}
        showContinue={game.questionNumber < game.totalQuestions}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.background.glass.subtle,
    borderBottomWidth: 1,
    borderColor: colors.border.glass.default,
  },
  currentAtomBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.brand.strong,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9999,
    gap: 8,
  },
  currentAtomLabel: {
    ...typography.title.small,
    fontFamily: typography.family,
    color: colors.foreground.neutral.inverse,
  },
  currentAtomCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.neutral.default,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow.neutral.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  currentAtomElement: {
    ...typography.title.small,
    fontFamily: typography.family,
    color: colors.foreground.neutral.default,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 32,
  },
  timerContainer: {
    marginTop: 16,
  },
  questionText: {
    ...typography.title.large,
    fontFamily: typography.family,
    color: colors.foreground.neutral.strong,
    textAlign: 'center',
    lineHeight: 34,
  },
  optionsContainer: {
    width: '100%',
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.title.medium,
    fontFamily: typography.family,
    color: colors.foreground.neutral.default,
  },
});
