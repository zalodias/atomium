import { Button } from '@/components/button';
import { RankingItem } from '@/components/ranking-item';
import { useGame } from '@/contexts/game';
import { colors, typography } from '@/theme';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Development mode flag - set to true to test with mock data
const USE_MOCK_DATA = __DEV__ && true;

export default function GameOver() {
  const router = useRouter();
  const { game, getAllTeamsProgress, leaveGame, createGame, isHost } = useGame();
  
  // Redirect if game is not finished or doesn't exist (skip check when using mock data)
  useEffect(() => {
    if (!USE_MOCK_DATA && (!game || !game.isFinished)) {
      router.replace('/');
    }
  }, [game, router]);
  
  // Mock data for testing multiple teams UI
  const mockRankings = [
    { 
      team: { id: '1', name: 'Químicos Vitoriosos', status: 'ready' as const, isHost: true },
      collected: 8, 
      total: 8, 
      percentage: 100 
    },
    { 
      team: { id: '2', name: 'Cientistas Unidos', status: 'ready' as const, isHost: false },
      collected: 7, 
      total: 8, 
      percentage: 87.5 
    },
    { 
      team: { id: '3', name: 'Átomos Loucos', status: 'ready' as const, isHost: false },
      collected: 5, 
      total: 8, 
      percentage: 62.5 
    },
    { 
      team: { id: '4', name: 'Moléculas Rápidas', status: 'ready' as const, isHost: false },
      collected: 3, 
      total: 8, 
      percentage: 37.5 
    },
  ];
  
  const mockWinnerId = '1';
  
  // Use mock data or real data based on flag
  const rankings = USE_MOCK_DATA ? mockRankings : (game ? getAllTeamsProgress() : []);
  const winnerId = USE_MOCK_DATA ? mockWinnerId : game?.winnerId;
  const winner = rankings.find(r => r.team.id === winnerId);
  const otherTeams = rankings.filter(r => r.team.id !== winnerId);
  
  if (!USE_MOCK_DATA && (!game || !game.isFinished)) {
    return null;
  }
  
  const handlePlayAgain = async () => {
    if (USE_MOCK_DATA) {
      // In mock mode, just navigate back to home
      router.replace('/');
      return;
    }
    
    // Store current settings
    const difficulty = game!.difficulty;
    
    // Leave current game
    await leaveGame();
    
    // Create new game with same settings
    const code = await createGame('Nova Equipa', difficulty);
    if (code) {
      router.replace('/lobby');
    }
  };
  
  const handleReturnHome = async () => {
    if (USE_MOCK_DATA) {
      // In mock mode, just navigate back to home
      router.replace('/');
      return;
    }
    
    await leaveGame();
    router.replace('/');
  };
  
  return (
    <LinearGradient
      style={styles.container}
      colors={[colors.background.brand.subtle, colors.background.brand.faded]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Jogo concluído!</Text>
        {winner && (
          <View style={styles.winner}>
              <View style={styles.winnerAvatar}>
                <Image 
                  source={require('@/assets/icons/atom.svg')} 
                  style={{ width: 48, height: 48 }} 
                  tintColor={colors.foreground.brand.default} 
                />
                <View style={styles.positionBadge}>
                  <Text style={styles.positionBadgeText}>1</Text>
                </View>
              </View>
            <View style={styles.details}>
              <Text style={styles.winnerName}>{winner.team.name}</Text>
              <Text style={styles.winnerLabel}>Vencedores</Text>
            </View>
          </View>
        )}
        {otherTeams.length > 0 && (
          <View style={styles.rankingsContainer}>
            {otherTeams.map((ranking, index) => (
              <RankingItem
                key={ranking.team.id}
                position={index + 2}
                teamName={ranking.team.name}
                collectedAtoms={ranking.collected}
                totalAtoms={ranking.total}
              />
            ))}
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <Button variant="default" onPress={handlePlayAgain}>
          Jogar novamente
        </Button>
        <Button variant="inverse" onPress={handleReturnHome}>
          Voltar ao início
        </Button>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingInline: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    gap: 40,
  },
  title: {
    ...typography.display.small,
    fontFamily: typography.family,
    color: colors.foreground.neutral.strong,
    textAlign: 'center',
    fontWeight: '600',
  },
  winner: {
    alignItems: 'center',
    gap: 24,
  },
  details: {
    alignItems: 'center',
  },
  winnerAvatar: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 48,
    backgroundColor: colors.background.neutral.default,
    borderWidth: 2,
    borderColor: colors.foreground.brand.default,
    shadowColor: colors.foreground.brand.default,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    position: 'relative',
  },
  positionBadge: {
    position: 'absolute',
    width: 32,
    height: 32,
    bottom: -16,
    left: '50%',
    marginLeft: -16,
    borderRadius: 16,
    backgroundColor: colors.background.warning.default,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background.neutral.default,
  },
  positionBadgeText: {
    ...typography.title.small,
    fontFamily: typography.family,
    color: colors.foreground.neutral.inverse,
    fontWeight: '600',
  },
  winnerName: {
    ...typography.title.large,
    fontFamily: typography.family,
    color: colors.foreground.neutral.strong,
    fontWeight: '600',
  },
  winnerLabel: {
    ...typography.title.small,
    fontFamily: typography.family,
    color: colors.foreground.brand.default,
    fontWeight: '600',
  },
  rankingsContainer: {
    width: '100%',
    gap: 12,
  },
  footer: {
    gap: 12,
  },
});
