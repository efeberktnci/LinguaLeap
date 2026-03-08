import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { COLORS, FONTS } from '../theme/colors';

interface FluidTopBarProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  style?: ViewStyle;
}

const FluidTopBar: React.FC<FluidTopBarProps> = ({ title, subtitle, right, style }) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const shimmerX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 220],
  });

  return (
    <View style={[styles.outer, style]}>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        <View style={styles.rightWrap}>{right}</View>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.shimmer,
            {
              transform: [{ translateX: shimmerX }],
            },
          ]}
        />
      </View>
    </View>
  );
};

export default FluidTopBar;

const styles = StyleSheet.create({
  outer: {
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  container: {
    overflow: 'hidden',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(255,255,255,0.78)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#0E2D4F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    color: '#17304A',
    ...FONTS.bold,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#4D667F',
    ...FONTS.medium,
  },
  rightWrap: {
    minWidth: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 120,
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: [{ skewX: '-20deg' }],
  },
});
