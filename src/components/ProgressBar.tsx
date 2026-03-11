import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../theme/colors';

interface ProgressBarProps {
  progress?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  showShadow?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress = 0,
  height = 14,
  color = COLORS.primary,
  backgroundColor = COLORS.swan,
  style,
  showShadow = true,
}) => {
  const clamped = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={[styles.container, { height, backgroundColor, borderRadius: height / 2 }, style]}>
      <View style={[styles.trackInset, { borderRadius: height / 2 }]} />
      {clamped > 0 && (
        <View
          style={[
            styles.fill,
            {
              width: `${clamped * 100}%`,
              backgroundColor: color,
              borderRadius: height / 2,
              height,
            },
          ]}
        >
          {showShadow && (
            <View
              style={[
                styles.shine,
                { height: height * 0.35, borderRadius: height / 4, top: height * 0.15 },
              ]}
            />
          )}
          <View style={[styles.cap, { width: height, height, borderRadius: height / 2 }]} />
        </View>
      )}
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: { overflow: 'hidden', width: '100%', position: 'relative' },
  trackInset: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(33,48,39,0.06)',
  },
  fill: { position: 'absolute', left: 0, top: 0 },
  shine: {
    position: 'absolute',
    left: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  cap: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
});
