import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const TimelineColumn = () => {
  const theme = useTheme();
  return (
    <View style={styles.timelineColumn}>
      <View style={[styles.avatar, { backgroundColor: theme.colors.muted }]} />
      <View
        style={[styles.verticalLine, { backgroundColor: theme.colors.border }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  timelineColumn: {
    width: 40,
    alignItems: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#444',
  },
  verticalLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#222',
    marginTop: 4,
  },
});

export default TimelineColumn;
