import { colors, typography } from '@/theme';
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

type AnswerState = 'default' | 'selected' | 'correct' | 'incorrect' | 'disabled';

interface AnswerButtonProps {
  label: string;
  state?: AnswerState;
  onPress?: () => void;
  disabled?: boolean;
}

export function AnswerButton({ label, state = 'default', onPress, disabled }: AnswerButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 8,
    }).start();
  };

  const getStyles = () => {
    switch (state) {
      case 'selected':
        return {
          container: styles.containerSelected,
          text: styles.textSelected,
        };
      case 'correct':
        return {
          container: styles.containerCorrect,
          text: styles.textCorrect,
        };
      case 'incorrect':
        return {
          container: styles.containerIncorrect,
          text: styles.textIncorrect,
        };
      case 'disabled':
        return {
          container: styles.containerDisabled,
          text: styles.textDisabled,
        };
      default:
        return {
          container: styles.containerDefault,
          text: styles.textDefault,
        };
    }
  };

  const stateStyles = getStyles();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || state === 'disabled'}
    >
      <Animated.View
        style={[
          styles.container,
          stateStyles.container,
          { transform: [{ scale }] },
          (disabled || state === 'disabled') && styles.disabled,
        ]}
      >
        <Text style={[styles.text, stateStyles.text]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: colors.shadow.neutral.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  containerDefault: {
    backgroundColor: colors.background.glass.default,
    borderColor: colors.border.glass.default,
  },
  containerSelected: {
    backgroundColor: colors.background.glass.default,
    borderColor: colors.foreground.brand.default,
  },
  containerCorrect: {
    backgroundColor: colors.background.positive.default,
    borderColor: colors.border.positive.default,
  },
  containerIncorrect: {
    backgroundColor: colors.background.negative.default,
    borderColor: colors.border.negative.default,
  },
  containerDisabled: {
    backgroundColor: colors.background.glass.default,
    borderColor: colors.border.glass.default,
  },
  text: {
    ...typography.title.medium,
    fontFamily: typography.family,
    textAlign: 'center',
  },
  textDefault: {
    color: colors.foreground.neutral.default,
  },
  textSelected: {
    color: colors.foreground.brand.default,
  },
  textCorrect: {
    color: colors.foreground.positive.default,
  },
  textIncorrect: {
    color: colors.foreground.negative.default,
  },
  textDisabled: {
    color: colors.foreground.neutral.faded,
  },
  disabled: {
    opacity: 0.5,
  },
});
