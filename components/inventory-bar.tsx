import { colors, typography } from '@/theme';
import type { Atom, Inventory } from '@/types/game';
import { StyleSheet, Text, View } from 'react-native';

interface InventoryBarProps {
  inventory: Inventory[];
  moleculeComposition: Atom[];
}

export function InventoryBar({ 
  inventory, 
  moleculeComposition
}: InventoryBarProps) {
  // Create a map of collected atoms for quick lookup
  const collectedMap = inventory.reduce((acc, item) => {
    acc[item.element] = item.count;
    return acc;
  }, {} as Record<string, number>);

  return (
    <View style={styles.container}>
      <View style={styles.atomsList}>
        {moleculeComposition.map((atom) => {
          const collected = collectedMap[atom.element] || 0;
          const required = atom.count;
          const fillPercentage = Math.min(collected / required, 1);
          
          return (
            <View key={atom.element} style={styles.atomItem}>
              <Text style={styles.atomCount}>{collected}×</Text>
              <View style={styles.atomCircleContainer}>
                <View 
                  style={[
                    styles.atomCircleFill,
                    { opacity: fillPercentage }
                  ]}
                />
                <Text style={styles.atomElement}>{atom.element}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  atomsList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  atomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  atomCount: {
    ...typography.body.medium,
    fontFamily: typography.family,
    color: colors.foreground.brand.default,
  },
  atomCircleContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.background.neutral.default,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  atomCircleFill: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background.neutral.default,
  },
  atomElement: {
    ...typography.body.medium,
    fontFamily: typography.family,
    color: colors.foreground.neutral.default,
    zIndex: 1,
  },
});
