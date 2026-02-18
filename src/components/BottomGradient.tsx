import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../theme/ThemeContext';

const BottomGradient: React.FC = () => {
  const theme = useTheme();

  const colors =
    theme.mode === 'dark'
      ? ['rgba(0,0,0,0.02)', 'rgba(0,0,0,0.65)', 'rgba(0,0,0,1)']
      : [
          'rgba(255,255,255,0.02)',
          'rgba(255,255,255,0.85)',
          'rgba(255,255,255,1)',
        ];

  return (
    <View pointerEvents="none" style={styles.container}>
      <LinearGradient
        colors={colors}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    zIndex: 5,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -12,
    bottom: 0,
  },
  // bottomSafe removed — gradient covers the full area
});

export default BottomGradient;
