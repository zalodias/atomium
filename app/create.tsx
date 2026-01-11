import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { difficulty as options, type Difficulty } from '@/constants/difficulty';
import { useGame } from '@/contexts/game';
import { colors, typography } from '@/theme';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

export default function Create() {
  const router = useRouter();
  const { createGame, isLoading } = useGame();
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [teamName, setTeamName] = useState('Atomic Warriors');

  const handleCreateGame = async () => {
    if (!teamName.trim()) return;
    
    const code = await createGame(teamName.trim(), difficulty);
    if (code) {
      router.push('/lobby');
    } else {
      Alert.alert('Erro', 'Não foi possível criar o jogo. Tenta novamente.');
    }
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={[colors.background.brand.subtle, colors.background.brand.strong]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Criar jogo</Text>
        </View>
        <View style={styles.body}>
          <Input
            placeholder="Nome da equipa"
            value={teamName}
            onChangeText={setTeamName}
            autoCapitalize="words"
            autoCorrect={false}
          />
          <View style={styles.options}>
            {options.map((option) => (
              <Select
                key={option.value}
                label={option.label}
                selected={difficulty === option.value}
                onPress={() => setDifficulty(option.value)}
                style={{ flex: 1 }}
              />
            ))}
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Button icon variant='outline' onPress={() => router.back()} disabled={isLoading}>
          <Image source={require('@/assets/icons/arrow-left.svg')} style={{ width: 24, height: 24 }} tintColor={colors.foreground.neutral.inverse} />
        </Button>
        <Button 
          variant="inverse" 
          style={styles.button} 
          onPress={handleCreateGame}
          disabled={isLoading}
        >
          {isLoading ? 'A criar…' : 'Criar jogo'}
        </Button>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: 24,
  },
  button: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingInline: 20,
    paddingBlock: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 32,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  header: {
    alignItems: 'center',
    gap: 16,
  },
  options: {
    flexDirection: 'row',
    gap: 12,
  },
  title: {
    ...typography.display.small,
    fontFamily: typography.family,
    color: colors.foreground.neutral.inverse,
    textShadowColor: colors.shadow.neutral.default,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});
