import { Button } from "@/components/button";
import { TeamItem } from "@/components/team-item";
import { useGame } from "@/contexts/game";
import { colors, typography } from "@/theme";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Lobby() {
  const router = useRouter();
  const { game, isHost, currentTeam, allReady, toggleReady, startGame, leaveGame, isLoading } = useGame();

  // Navigate to preview when game starts
  useEffect(() => {
    if (game?.isStarted) {
      router.push('/preview');
    }
  }, [game?.isStarted, router]);

  const handleBack = async () => {
    await leaveGame();
    router.push('/');
  };

  const handleMainAction = async () => {
    if (isHost) {
      if (allReady && game && game.teams.length > 0) {
        await startGame();
      }
    } else {
      await toggleReady();
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      return 'A processar…';
    }
    if (isHost) {
      if (!game || game.teams.length < 1) {
        return 'A aguardar jogadores';
      }
      return allReady ? 'Iniciar jogo' : 'A aguardar jogadores';
    }
    return currentTeam?.status === 'ready' ? 'Cancelar' : 'Estou pronto';
  };

  const isButtonDisabled = () => {
    if (isLoading) return true;
    if (isHost) {
      return !allReady || !game || game.teams.length < 1;
    }
    return false;
  };

  if (!game) {
    return (
      <LinearGradient
        style={styles.container}
        colors={[colors.background.brand.subtle, colors.background.brand.strong]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Sem jogo ativo</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      style={styles.container}
      colors={[colors.background.brand.subtle, colors.background.brand.strong]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Lobby</Text>
          <View style={styles.codeBadge}>
            <Text style={styles.codeText}>{game.code}</Text>
          </View>
        </View>
        <ScrollView style={styles.teamList} contentContainerStyle={styles.teamListContent}>
          {game.teams.map((team) => (
            <TeamItem
              key={team.id}
              name={team.name}
              status={team.status}
            />
          ))}
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <Button icon variant="outline" onPress={handleBack} disabled={isLoading}>
          <Image source={require('@/assets/icons/arrow-left.svg')} style={{ width: 24, height: 24 }} tintColor={colors.foreground.neutral.inverse} />
        </Button>
        <Button 
          variant="inverse" 
          style={styles.button} 
          onPress={handleMainAction}
          disabled={isButtonDisabled()}
        >
          {getButtonText()}
        </Button>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingInline: 20,
    paddingBlock: 40,
  },
  content: {
    flex: 1,
    gap: 32,
  },
  header: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 40,
  },
  title: {
    ...typography.display.small,
    fontFamily: typography.family,
    color: colors.foreground.neutral.inverse,
    textShadowColor: colors.shadow.neutral.default,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  codeBadge: {
    backgroundColor: 'hsla(0, 0%, 100%, 0.25)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'hsla(0, 0%, 100%, 0.4)',
  },
  codeText: {
    ...typography.title.medium,
    fontFamily: typography.family,
    color: colors.foreground.neutral.inverse,
    letterSpacing: 2,
  },
  teamList: {
    flex: 1,
  },
  teamListContent: {
    paddingTop: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
