import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface EpicBackgroundProps {
  compact?: boolean;
}

const EpicBackground: React.FC<EpicBackgroundProps> = ({ compact = false }) => {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(drift, {
        toValue: 1,
        duration: compact ? 9000 : 13000,
        useNativeDriver: true,
      })
    );
    loop.start();

    return () => loop.stop();
  }, [compact, drift]);

  const orb1X = drift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-16, 24, -16],
  });
  const orb1Y = drift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 20, 0],
  });
  const orb2X = drift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [18, -20, 18],
  });
  const orb2Y = drift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -16, 0],
  });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={styles.base} />
      <View style={styles.grid} />

      <Animated.View
        style={[
          styles.orb,
          styles.orbPrimary,
          {
            transform: [{ translateX: orb1X }, { translateY: orb1Y }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.orb,
          styles.orbBlue,
          {
            transform: [{ translateX: orb2X }, { translateY: orb2Y }],
          },
        ]}
      />

      <View style={styles.zigLayer}>
        {Array.from({ length: compact ? 6 : 10 }).map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.zig,
              {
                top: 30 + idx * (compact ? 56 : 64),
                left: idx % 2 === 0 ? 22 : 40,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default EpicBackground;

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F3F8FF',
  },
  grid: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    borderColor: 'rgba(27, 67, 128, 0.04)',
    borderWidth: 1,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.25,
  },
  orbPrimary: {
    width: 220,
    height: 220,
    top: -80,
    right: -60,
    backgroundColor: '#87D9FF',
  },
  orbBlue: {
    width: 240,
    height: 240,
    bottom: -90,
    left: -70,
    backgroundColor: '#77A8FF',
  },
  zigLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  zig: {
    position: 'absolute',
    width: 48,
    height: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(34, 102, 255, 0.09)',
    transform: [{ rotate: '-22deg' }],
  },
});
