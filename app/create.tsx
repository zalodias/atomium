import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { difficulty as options, type Difficulty } from '@/constants/difficulty';
import { colors, typography } from '@/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Create() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [teamName, setTeamName] = useState('Atomic Warriors');

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
        <Button icon variant="outline" onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.foreground.neutral.inverse} />
        </Button>
        <Button variant="inverse" style={styles.button}>
          Criar jogo
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
    width: '100%',
  },
  container: {
    flex: 1,
    paddingInline: 20,
    paddingBlock: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 36,
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

