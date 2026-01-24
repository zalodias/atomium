import { colors, typography } from '@/theme';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

interface RankingItemProps {
  position: number;
  teamName: string;
  collectedAtoms: number;
  totalAtoms: number;
}

export function RankingItem({ position, teamName, collectedAtoms, totalAtoms }: RankingItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.positionBadge}>
          <Text style={styles.positionText}>{position}</Text>
        </View>
        <View style={styles.avatar}>
          <Image 
            source={require('@/assets/icons/atom.svg')} 
            style={{ width: 20, height: 20 }} 
            tintColor={colors.foreground.brand.default} 
          />
        </View>
        <Text style={styles.name}>{teamName}</Text>
      </View>
      <View style={styles.progressBadge}>
        <Text style={styles.progressText}>
          <Text style={styles.collectedText}>{collectedAtoms}</Text>
          {' / '}
          <Text style={styles.totalText}>{totalAtoms}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.background.glass.subtle,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.border.glass.default,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  positionBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  positionText: {
    ...typography.body.large,
    fontFamily: typography.family,
    color: colors.foreground.neutral.subtle,
  },
  avatar: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: colors.background.neutral.default,
    borderWidth: 1,
    borderColor: colors.foreground.brand.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...typography.body.large,
    fontFamily: typography.family,
    color: colors.foreground.neutral.strong,
  },
  progressBadge: {
    paddingHorizontal: 12,
  },
  progressText: {
    ...typography.body.medium,
    fontFamily: typography.family,
  },
  collectedText: {
    ...typography.title.small,
    fontFamily: typography.family,
    color: colors.foreground.brand.default,
  },
  totalText: {
    color: colors.foreground.neutral.strong,
  },
});
