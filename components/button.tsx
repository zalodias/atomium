import { colors, typography } from '@/theme';
import React, { useRef } from 'react';
import { Animated, GestureResponderEvent, Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

type ButtonVariant = 'default' | 'inverse' | 'outline';
type ButtonSize = 'default' | 'large';

interface ButtonProps {
  children: React.ReactNode;
  icon?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

export function Button({
  children,
  icon,
  variant = 'default',
  size = 'default',
  style,
  textStyle,
  onPress,
  disabled,
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
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

  const variants = {
    default: {
      button: {
        backgroundColor: colors.background.brand.subtle,
      },
      text: {
        color: colors.foreground.neutral.inverse,
      }
    },
    inverse: {
      button: {
        backgroundColor: colors.background.neutral.default,
        borderWidth: 1,
        borderColor: colors.background.neutral.default,
        shadowColor: colors.background.neutral.inverse,
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      text: {
        color: colors.foreground.brand.default,
      }
    },
    outline: {
      button: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.background.neutral.default,
      },
      text: {
        color: colors.foreground.neutral.inverse,
      }
    }
  }[variant];

  const sizes = {
    default: {
      paddingHorizontal: icon ? 12 : 24,
      paddingVertical: 12
    },
    large: {
      paddingHorizontal: icon ? 16 : 32,
      paddingVertical: 16
    }
  }[size];

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={style}
    >
      <Animated.View
        style={[{
          transform: [{ scale }],
        },
        styles.button,
        variants.button,
        sizes,
        disabled && styles.disabled]}
      >
        {icon ? (
          children
        ) : (
          <Text
            style={[
              variants.text,
              typography.title.small,
              { fontFamily: typography.family },
              textStyle,
            ]}
          >
            {children}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  disabled: {
    opacity: 0.5,
  },
});
