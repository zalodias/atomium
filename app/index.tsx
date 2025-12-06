import { Button } from '@/components/button';
import { colors, typography } from '@/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
  function handleCreateGame() {
    console.log("Create game");
  }

  function handleEnterGame() {
    console.log("Enter game");
  }

  return (
    <LinearGradient
      style={styles.container}
      colors={[colors.background.brand.subtle, colors.background.brand.strong]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
      <Text style={styles.title}>
        atomium
      </Text>
      </View>
      <View style={styles.actions}>
        <Button variant="inverse" style={styles.button} onPress={handleCreateGame}>
          Criar novo jogo
        </Button>
        <Button variant="outline" style={styles.button} onPress={handleEnterGame}>
          Entrar em jogo
        </Button>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 64,
    paddingInline: 20,
  },
  header: {
    alignItems: 'center',
    gap: 16,
  },
  title: {
    ...typography.display.large,
    fontFamily: typography.family,
    color: colors.foreground.neutral.inverse,
    opacity: 0.8,
    textShadowColor: colors.shadow.neutral.default,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  actions: {
    gap: 16,
  },
  button: {
    width: '100%',
  },
});
