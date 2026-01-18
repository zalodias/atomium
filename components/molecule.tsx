import { colors, typography } from '@/theme';
import type { MoleculeStructure } from '@/types/game';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MoleculeProps {
  structure: MoleculeStructure;
}

export function Molecule({ structure }: MoleculeProps) {
  const size = 300;
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {structure.bonds.map((bond, index) => {
        const atom1 = structure.atoms[bond.from];
        const atom2 = structure.atoms[bond.to];

        const dx = atom2.x - atom1.x;
        const dy = atom2.y - atom1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        const centerX = (atom1.x + atom2.x) / 2;
        const centerY = (atom1.y + atom2.y) / 2;
        
        return (
          <View
            key={`bond-${index}`}
            style={[
              styles.bond,
              {
                width: length,
                left: centerX,
                top: centerY,
                transform: [
                  { translateX: -length / 2 },
                  { translateY: -2 },
                  { rotate: `${angle}deg` },
                ],
              },
            ]}
          />
        );
      })}
      
      {structure.atoms.map((atom, index) => (
        <View
          key={`atom-${index}`}
          style={[
            styles.atom,
            {
              left: atom.x,
              top: atom.y,
            },
          ]}
        >
          <Text style={styles.atomText}>{atom.element}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bond: {
    position: 'absolute',
    height: 2,
    backgroundColor: colors.foreground.neutral.inverse,
    borderRadius: 1,
  },
  atom: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background.neutral.default,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -40 }, { translateY: -40 }],
    borderWidth: 1,
    borderColor: 'hsla(0, 0%, 100%, 1)',
    shadowColor: colors.shadow.neutral.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  atomText: {
    ...typography.display.small,
    fontFamily: typography.family,
    color: colors.foreground.brand.default
  },
});
