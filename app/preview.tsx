import { Button } from "@/components/button";
import { Molecule } from "@/components/molecule";
import { useGame } from "@/contexts/game";
import { colors, typography } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Preview() {
  const { game } = useGame();
  const router = useRouter();
  
  useEffect(() => {
    if (!game || !game.isStarted) {
      router.replace('/');
    }
  }, [game, router]);
  
  if (!game?.molecule) {
    return (
      <LinearGradient
        style={styles.container}
        colors={['hsl(195, 64%, 80%)', 'hsl(195, 24%, 96%)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>A carregar molécula...</Text>
        </View>
      </LinearGradient>
    );
  }
  
  const handleStartGame = () => {
    console.log('Starting game with molecule:', game.molecule?.name);
  };
  
  return (
    <LinearGradient
      style={styles.container}
      colors={['hsl(195, 64%, 80%)', 'hsl(195, 24%, 96%)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.label}>Molécula Objetivo</Text>
          <Text style={styles.moleculeName}>{game.molecule.name}</Text>
        </View>
        <View style={styles.visualizationContainer}>
          <Molecule structure={game.molecule.structure} />
        </View>
        <Text style={styles.description}>{game.molecule.description}</Text>
        <View style={styles.atomCounts}>
          {game.molecule.composition.map((atom, index) => (
            <View key={index} style={styles.atomBadge}>
              <Text style={styles.atomBadgeCount}>{atom.count}×</Text>
              <View style={styles.atomBadgeCircle}>
                <Text style={styles.atomBadgeElement}>{atom.element}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View>
        <Button variant="default" onPress={handleStartGame}>
          Iniciar jogo
        </Button>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingInline: 20,
    paddingBlockStart: 80,
    paddingBlockEnd: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    gap: 32,
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
  header: {
    alignItems: 'center',
    gap: 16,
  },
  label: {
    ...typography.body.large,
    fontFamily: typography.family,
    color: colors.foreground.neutral.subtle,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  moleculeName: {
    ...typography.display.medium,
    fontFamily: typography.family,
    color: colors.foreground.neutral.strong,
    textShadowColor: 'hsla(0, 0%, 0%, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  visualizationContainer: {
    marginVertical: 20,
  },
  description: {
    ...typography.body.large,
    fontFamily: typography.family,
    color: colors.foreground.neutral.default,
    textAlign: 'center',
    lineHeight: 28,
  },
  atomCounts: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  atomBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  atomBadgeCount: {
    ...typography.title.small,
    fontFamily: typography.family,
    color: colors.foreground.brand.default,
  },
  atomBadgeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.neutral.default,
    borderWidth: 1,
    borderColor: 'hsla(0, 0%, 100%, 1)',
    shadowColor: colors.shadow.neutral.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  atomBadgeElement: {
    ...typography.body.medium,
    fontFamily: typography.family,
    color: colors.foreground.neutral.default,
  },
});
