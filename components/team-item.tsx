import { colors, typography } from '@/theme';
import type { PlayerStatus } from '@/types/game';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

interface TeamItemProps {
  name: string;
  status: PlayerStatus;
}

export function TeamItem({ name, status }: TeamItemProps) {
  const statusLabel = status === 'ready' ? 'Pronto' : 'Inativo';
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Image source={require('@/assets/icons/atom.svg')} style={{ width: 24, height: 24 }} tintColor={colors.foreground.brand.default} />
        </View>
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={[styles.statusBadge, status === 'ready' ? styles.statusReady : styles.statusIdle]}>
        <Text style={[styles.statusText, status === 'ready' ? styles.statusTextReady : styles.statusTextIdle]}>
          {statusLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.background.neutral.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  name: {
    ...typography.title.small,
    fontFamily: typography.family,
    color: colors.foreground.neutral.inverse,
    textShadowColor: colors.shadow.neutral.default,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  statusIdle: {
    backgroundColor: 'hsla(195, 80%, 35%, 0.5)',
  },
  statusReady: {
    backgroundColor: 'hsla(195, 80%, 35%, 0.9)',
  },
  statusText: {
    ...typography.body.medium,
    fontFamily: typography.family,
  },
  statusTextIdle: {
    color: colors.foreground.neutral.inverse,
  },
  statusTextReady: {
    color: colors.foreground.neutral.inverse,
  },
});
