import { colors, typography } from '@/theme';
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

type InputProps = TextInputProps & {
  label?: string;
};

export function Input({ label, style, ...props }: InputProps) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.field}>
        <TextInput
          {...props}
          style={[styles.input, style]}
          placeholderTextColor="rgba(255,255,255,0.64)"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    ...typography.body.medium,
    fontFamily: typography.family,
    color: colors.foreground.neutral.inverse,
  },
  field: {
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...typography.title.small,
    fontFamily: typography.family,
    color: colors.foreground.neutral.inverse,
  },
});

