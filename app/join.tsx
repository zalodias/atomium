import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useGame } from "@/contexts/game";
import { colors, typography } from "@/theme";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function Join() {
  const router = useRouter();
  const { joinGame, isLoading } = useGame();
  const [teamName, setTeamName] = useState('');
  const [code, setCode] = useState('');

  const handleJoinGame = async () => {
    if (!teamName.trim() || !code.trim()) return;
    
    const success = await joinGame(code.trim().toUpperCase(), teamName.trim());
    if (success) {
      router.push('/lobby');
    } else {
      Alert.alert('Erro', 'Código de jogo inválido ou jogo já iniciado');
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
          <Text style={styles.title}>Entrar em jogo</Text>
        </View>
        <View style={styles.body}>
          <Input
            placeholder="Nome da equipa"
            value={teamName}
            onChangeText={setTeamName}
            autoCapitalize="words"
            autoCorrect={false}
          />
          <Input
            placeholder="Código do jogo"
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            autoCorrect={false}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <Button icon variant="outline" onPress={() => router.back()} disabled={isLoading}>
          <Image source={require('@/assets/icons/arrow-left.svg')} style={{ width: 24, height: 24 }} tintColor={colors.foreground.neutral.inverse} />
        </Button>
        <Button 
          variant="inverse" 
          style={styles.button} 
          onPress={handleJoinGame}
          disabled={isLoading}
        >
          {isLoading ? 'A entrar…' : 'Entrar em jogo'}
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
    justifyContent: 'center',
    gap: 32,
  },
  header: {
    alignItems: 'center',
    gap: 16,
  },
  title: {
    ...typography.display.small,
    fontFamily: typography.family,
    color: colors.foreground.neutral.inverse,
    textShadowColor: colors.shadow.neutral.default,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  button: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  body: {
    gap: 24,
  },
});
