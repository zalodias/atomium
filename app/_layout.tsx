import { GameProvider } from "@/contexts/game";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <GameProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </GameProvider>
  );
}
