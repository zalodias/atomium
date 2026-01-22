import { Button } from '@/components/button';
import { colors, typography } from '@/theme';
import { Modal, StyleSheet, Text, View } from 'react-native';

interface ResultModalProps {
  visible: boolean;
  isCorrect: boolean;
  correctAnswer: string;
  earnedAtom?: string;
  onContinue: () => void;
  isHost: boolean;
  showContinue?: boolean;
}

export function ResultModal({ 
  visible, 
  isCorrect, 
  correctAnswer, 
  earnedAtom,
  onContinue,
  isHost,
  showContinue = true,
}: ResultModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={[
            styles.iconContainer,
            isCorrect ? styles.iconCorrect : styles.iconIncorrect
          ]}>
            <Text style={styles.icon}>{isCorrect ? '✓' : '✗'}</Text>
          </View>
          
          <Text style={[
            styles.title,
            isCorrect ? styles.titleCorrect : styles.titleIncorrect
          ]}>
            {isCorrect ? 'Correto!' : 'Incorreto'}
          </Text>
          
          {!isCorrect && (
            <View style={styles.correctAnswerContainer}>
              <Text style={styles.correctAnswerLabel}>Resposta correta:</Text>
              <Text style={styles.correctAnswerText}>{correctAnswer}</Text>
            </View>
          )}
          
          {isCorrect && earnedAtom && (
            <View style={styles.rewardContainer}>
              <Text style={styles.rewardLabel}>Átomo conquistado:</Text>
              <View style={styles.atomBadge}>
                <View style={styles.atomCircle}>
                  <Text style={styles.atomElement}>{earnedAtom}</Text>
                </View>
              </View>
            </View>
          )}
          
          {showContinue && (
            <View style={styles.buttonContainer}>
              {isHost ? (
                <Button variant="default" onPress={onContinue}>
                  Próxima pergunta
                </Button>
              ) : (
                <Text style={styles.waitingText}>A aguardar próxima pergunta...</Text>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: colors.background.neutral.default,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    shadowColor: colors.shadow.neutral.default,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconCorrect: {
    backgroundColor: 'hsl(145, 60%, 90%)',
  },
  iconIncorrect: {
    backgroundColor: 'hsl(0, 60%, 92%)',
  },
  icon: {
    fontSize: 36,
    fontWeight: '700',
  },
  title: {
    ...typography.title.large,
    fontFamily: typography.family,
    marginBottom: 16,
  },
  titleCorrect: {
    color: 'hsl(145, 60%, 35%)',
  },
  titleIncorrect: {
    color: 'hsl(0, 60%, 45%)',
  },
  correctAnswerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  correctAnswerLabel: {
    ...typography.body.medium,
    fontFamily: typography.family,
    color: colors.foreground.neutral.faded,
    marginBottom: 4,
  },
  correctAnswerText: {
    ...typography.title.medium,
    fontFamily: typography.family,
    color: colors.foreground.neutral.strong,
  },
  rewardContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  rewardLabel: {
    ...typography.body.medium,
    fontFamily: typography.family,
    color: colors.foreground.neutral.faded,
    marginBottom: 12,
  },
  atomBadge: {
    alignItems: 'center',
  },
  atomCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background.brand.subtle,
    borderWidth: 3,
    borderColor: colors.foreground.brand.default,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.foreground.brand.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  atomElement: {
    ...typography.title.large,
    fontFamily: typography.family,
    color: colors.foreground.brand.default,
  },
  buttonContainer: {
    marginTop: 8,
    width: '100%',
  },
  waitingText: {
    ...typography.body.medium,
    fontFamily: typography.family,
    color: colors.foreground.neutral.faded,
    textAlign: 'center',
  },
});
