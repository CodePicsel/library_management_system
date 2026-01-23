// components/FloatingAddButton.js
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableWithoutFeedback,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ACCENT = '#4ade80';
const SUB_TEXT_COLOR = '#334155';
const MAIN_SIZE = 56;    // decreased from 64
const ACTION_SIZE = 44;  // slightly decreased
const GAP = 14;
export default function FloatingAddButton({ navigation: navProp }) {
  const hookNav = useNavigation?.();
  const nav = navProp ?? hookNav;

  const [visible, setVisible] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function checkRole() {
      try {
        const role = await AsyncStorage.getItem('userRole');
        if (!mounted) return;
        setVisible(role === 'admin');
      } catch (e) {
        console.error('FloatingAddButton checkRole error', e);
        if (!mounted) return;
        setVisible(false);
      }
    }
    const sub = nav?.addListener?.('focus', checkRole);
    checkRole();
    return () => {
      mounted = false;
      sub?.remove?.();
    };
  }, [nav]);

  const openMenu = () => {
    setOpen(true);
    Animated.timing(anim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();
  };
  const closeMenu = () => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 260,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setOpen(false);
    });
  };

  const toggle = () => (open ? closeMenu() : openMenu());

  // hamburger -> X transforms
  const topBarTransform = {
    transform: [
      { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }) },
      { rotate: anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] }) },
    ],
  };
  const midBarOpacity = {
    opacity: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] }),
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.5] }) }],
  };
  const botBarTransform = {
    transform: [
      { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) },
      { rotate: anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-45deg'] }) },
    ],
  };

  const addTranslate = {
    transform: [
      { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -(ACTION_SIZE + GAP) * 1] }) },
      { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
    ],
    opacity: anim,
  };
  const viewTranslate = {
    transform: [
      { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -(ACTION_SIZE + GAP) * 2 - 6] }) },
      { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
    ],
    opacity: anim,
  };

  const handleNavigate = (routeName) => {
    if (!nav) {
      Alert.alert('Error', 'Navigation context missing.');
      return;
    }
    if (!open) return; // safety: only navigate if menu is open
    toggle();
    try {
      nav.navigate(routeName);
    } catch (err) {
      console.error('FloatingAddButton navigation error', err);
    }
  };

  if (!visible) return null;

  return (
    <>
      {open ? (
        <TouchableWithoutFeedback onPress={toggle}>
          <Animated.View
            style={[
              styles.overlay,
              { opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) },
            ]}
            pointerEvents="auto"
          />
        </TouchableWithoutFeedback>
      ) : null}

      <View style={styles.container} pointerEvents="box-none">
        <Animated.View style={[styles.actionWrapper, viewTranslate]} pointerEvents={open ? 'auto' : 'none'}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleNavigate('ViewStudents')}
            style={[styles.actionBtn, styles.actionShadow]}
          >
            <View style={[styles.dot, { backgroundColor: '#3b82f6' }]} />
            {/* <Text style={styles.actionText}>Manage/n Students</Text> */}
            <Text style={styles.actionText}>
              Manage{'\n'}Students
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.actionWrapper, addTranslate]} pointerEvents={open ? 'auto' : 'none'}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleNavigate('AddBook')}
            style={[styles.actionBtn, styles.actionShadow]}
          >
            <View style={[styles.dot, { backgroundColor: ACCENT }]} />
            <Text style={styles.actionText}>Add Book</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.mainWrapper]}>
          <TouchableOpacity activeOpacity={0.92} onPress={toggle} style={[styles.mainBtn, styles.mainShadow]}>
            <View style={styles.icon}>
              <Animated.View style={[styles.bar, topBarTransform]} />
              <Animated.View style={[styles.bar, midBarOpacity]} />
              <Animated.View style={[styles.bar, botBarTransform]} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 28,
    bottom: 32, // moved up slightly
    width: MAIN_SIZE,
    height: MAIN_SIZE * 3.6,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 9999,
  },
  overlay: {
    position: 'absolute',
    left: 0, top: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.30)',
    zIndex: 500,
  },
  mainWrapper: {
    width: MAIN_SIZE,
    height: MAIN_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainBtn: {
    width: MAIN_SIZE, height: MAIN_SIZE, borderRadius: MAIN_SIZE / 2,
    backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
  },
  icon: { width: 26, height: 26, justifyContent: 'center', alignItems: 'center' },
  bar: { width: 22, height: 2.4, backgroundColor: '#fff', borderRadius: 1.5, position: 'absolute' },
  actionWrapper: {
    position: 'absolute', bottom: 15, alignItems: 'center', justifyContent: 'center', width: MAIN_SIZE, zIndex: 1000,
  },
  actionBtn: {
    width: ACTION_SIZE * 3.0, height: ACTION_SIZE, borderRadius: ACTION_SIZE / 2,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'flex-start',
    paddingLeft: 8, borderWidth: 1, borderColor: '#f1f5f9', flexDirection: 'row',
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 10 },
  actionText: { color: SUB_TEXT_COLOR, fontWeight: '700', fontSize: 13, letterSpacing: 0.2 },
  actionShadow: {
    shadowColor: '#1e293b', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 7, elevation: 6,
  },
  mainShadow: {
    shadowColor: ACCENT, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.36, shadowRadius: 9, elevation: 10,
  },
});
