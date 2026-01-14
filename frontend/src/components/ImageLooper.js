// components/ImageLooper.js
import React, { useRef, useEffect } from 'react';
import { Animated, Image, StyleSheet, Dimensions, Easing, View } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ImageLooper({ source, loopDuration = 22000 }) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateY, {
        toValue: -SCREEN_HEIGHT * 1.05, // travel slightly more for a smoother seam
        duration: loopDuration,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }, [translateY, loopDuration]);

  return (
    <View style={styles.column}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        <Image source={source} style={styles.image} resizeMode="cover" />
        <Image source={source} style={styles.image} resizeMode="cover" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    width: '36%',           // slightly narrower than before to match ref
    height: '100%',
    overflow: 'hidden',
    backgroundColor: 'transparent',

    // shadow so the column reads above the white area
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 2, height: 0 },
    elevation: 6
  },
  image: {
    width: '100%',
    height: SCREEN_HEIGHT * 1.05 // slightly taller to ensure seam is off-screen
  }
});
