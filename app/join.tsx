import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { colors, typography } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Join() {
  const router = useRouter();
  const [teamName, setTeamName] = useState('');
  const [code, setCode] = useState('');
  
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
        <Button icon variant="outline" onPress={() => router.push('/')}>
          <ArrowLeft size={24} color={colors.foreground.neutral.inverse} />
        </Button>
        <Button variant="inverse" style={styles.button}>
          Entrar em jogo
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
    width: '100%',
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
