// components/FloatingAddButton.js
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Easing,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { clearAuth } from '../api/api'; // clears axios auth header

const ACCENT = '#4ade80';
const LOGOUT_ACCENT = '#ff6b6b';
const LOGOUT_DOT = '#ff3b30';
const SUB_TEXT_COLOR = '#334155';
const MAIN_SIZE = 56;
const ACTION_SIZE = 44;
const GAP = 14;

export default function FloatingAddButton({ navigation: navProp }) {
  const hookNav = useNavigation?.();
  const nav = navProp ?? hookNav;

  const [role, setRole] = useState(null); // 'admin' | 'student' | null
  const [visible, setVisible] = useState(false);
  const anim = useRef(new Animated.Value(0)).current; // 0 closed, 1 open
  const [open, setOpen] = useState(false);
  const [actionsInteractive, setActionsInteractive] = useState(false);

  // logout confirm modal state + animation
  const [confirmVisible, setConfirmVisible] = useState(false);
  const confirmScale = useRef(new Animated.Value(0.85)).current;
  const confirmOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let mounted = true;
    async function checkRole() {
      try {
        const r = await AsyncStorage.getItem('userRole'); // expected 'admin' or 'student'
        if (!mounted) return;
        setRole(r);
        setVisible(!!r); // visible for both admin and student
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

  // open/close menu animations
  const openMenu = () => {
    setOpen(true);
    setActionsInteractive(false);
    Animated.timing(anim, {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start(() => {
      // enable action presses after animation completes
      setActionsInteractive(true);
    });
  };
  const closeMenu = (cb) => {
    setActionsInteractive(false);
    Animated.timing(anim, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setOpen(false);
      if (typeof cb === 'function') cb();
    });
  };
  const toggle = () => (open ? closeMenu() : openMenu());

  // transforms for bars (hamburger -> X)
  const topBarTransform = {
    transform: [
      { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }) },
      { rotate: anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] }) },
    ],
  };
  const midBarOpacity = {
    opacity: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0.2, 0] }),
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.6] }) }],
  };
  const botBarTransform = {
    transform: [
      { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) },
      { rotate: anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-45deg'] }) },
    ],
  };

  // action translations (index: 1 => first action above FAB)
  const actionTranslateStyle = (index) => ({
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -(ACTION_SIZE + GAP) * index - (index > 1 ? 4 : 0)],
        }),
      },
      { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
    ],
    opacity: anim,
  });

  // safe navigation: close menu then navigate
  const navigateAfterClose = (routeName) => {
    if (!nav) return;
    closeMenu(() => {
      try {
        nav.navigate(routeName);
      } catch (e) {
        console.error('FAB navigation error', e);
      }
    });
  };

  // Logout modal open
  const openLogoutConfirm = () => {
    // close menu then open modal
    closeMenu(() => {
      setConfirmVisible(true);
      confirmOpacity.setValue(0);
      confirmScale.setValue(0.85);
      Animated.parallel([
        Animated.timing(confirmOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(confirmScale, { toValue: 1, friction: 7, useNativeDriver: true }),
      ]).start();
    });
  };

  // perform logout: clear auth, clear storage, navigate to Auth
  const performLogout = async () => {
    try {
      clearAuth();
      await AsyncStorage.multiRemove(['basicAuthUser', 'studentUser', 'userRole']);
    } catch (e) {
      console.error('logout clear error', e);
    }

    // close modal with a small animation
    Animated.parallel([
      Animated.timing(confirmOpacity, { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(confirmScale, { toValue: 0.9, duration: 160, useNativeDriver: true }),
    ]).start(() => {
      setConfirmVisible(false);
      // Reset navigation to AuthStack or Login (adjust route names for your app)
      try {
        if (nav?.reset) {
          nav.reset({ index: 0, routes: [{ name: 'Auth' }] });
        } else {
          nav.navigate('Login');
        }
      } catch (err) {
        // fallback
        try { nav.navigate('Login'); } catch (e) { /* ignore */ }
      }
    });
  };

  if (!visible) return null;

  // whether to show admin-only actions
  const isAdmin = role === 'admin';
  const showAdd = isAdmin;
  const showStudents = isAdmin;
  // logout action always shown (for students and admin)

  return (
    <>
      {/* Overlay when menu open */}
      {open ? (
        <TouchableWithoutFeedback onPress={() => toggle()}>
          <Animated.View
            style={[styles.overlay, { opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.6] }) }]}
            pointerEvents="auto"
          />
        </TouchableWithoutFeedback>
      ) : null}

      <View style={styles.container} pointerEvents="box-none">
        {/* ========= Actions (render order: farthest -> nearest) ========= */}

        {/* Logout (index depends on whether admin actions exist) */}
        <Animated.View
          style={[
            styles.actionWrapper,
            actionTranslateStyle(isAdmin ? 3 : 1),
          ]}
          pointerEvents={actionsInteractive ? 'auto' : 'none'}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={openLogoutConfirm}
            style={[styles.actionBtn, styles.logoutBtn, styles.actionShadow]}
          >
            <View style={[styles.dot, { backgroundColor: LOGOUT_DOT }]} />
            <Text style={[styles.actionText, { color: '#7f1d1d' }]}>Log out</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Manage Students (admin only) */}
        {showStudents ? (
          <Animated.View style={[styles.actionWrapper, actionTranslateStyle(2)]} pointerEvents={actionsInteractive ? 'auto' : 'none'}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigateAfterClose('ViewStudents')}
              style={[styles.actionBtn, styles.actionShadow]}
            >
              <View style={[styles.dot, { backgroundColor: '#3b82f6' }]} />
              <Text style={styles.actionText}>Manage{'\n'}Students</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : null}

        {/* Add Book (admin only) */}
        {showAdd ? (
          <Animated.View style={[styles.actionWrapper, actionTranslateStyle(1)]} pointerEvents={actionsInteractive ? 'auto' : 'none'}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigateAfterClose('AddBook')}
              style={[styles.actionBtn, styles.actionShadow]}
            >
              <View style={[styles.dot, { backgroundColor: ACCENT }]} />
              <Text style={styles.actionText}>Add Book</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : null}

        {/* Main FAB */}
        <Animated.View style={styles.mainWrapper}>
          <TouchableOpacity activeOpacity={0.92} onPress={toggle} style={[styles.mainBtn, styles.mainShadow]}>
            <View style={styles.icon}>
              <Animated.View style={[styles.bar, topBarTransform]} />
              <Animated.View style={[styles.bar, midBarOpacity]} />
              <Animated.View style={[styles.bar, botBarTransform]} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Logout confirmation modal */}
      <Modal visible={confirmVisible} transparent animationType="none">
        <View style={styles.modalRoot}>
          <Animated.View style={[styles.modalCard, { opacity: confirmOpacity, transform: [{ scale: confirmScale }] }]}>
            <Text style={styles.modalTitle}>Confirm Log out</Text>
            <Text style={styles.modalSubtitle}>You will be signed out on this device.</Text>

            <View style={styles.modalRow}>
              <Pressable
                onPress={() => {
                  // close modal
                  Animated.timing(confirmOpacity, { toValue: 0, duration: 140, useNativeDriver: true }).start(() => setConfirmVisible(false));
                }}
                style={[styles.modalBtn, styles.cancelBtn]}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </Pressable>

              <Pressable onPress={performLogout} style={[styles.modalBtn, styles.confirmBtn]}>
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Log out</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 22,
    bottom: Platform.OS === 'android' ? 30 : 36,
    width: MAIN_SIZE,
    height: MAIN_SIZE * 3.6,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 9999,
  },
  overlay: {
    position: 'absolute',
    left: 0, top: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.36)',
    zIndex: 500,
  },

  mainWrapper: { width: MAIN_SIZE, height: MAIN_SIZE, alignItems: 'center', justifyContent: 'center' },
  mainBtn: {
    width: MAIN_SIZE,
    height: MAIN_SIZE,
    borderRadius: MAIN_SIZE / 2,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },

  icon: { width: 26, height: 26, justifyContent: 'center', alignItems: 'center' },
  bar: { width: 22, height: 2.6, backgroundColor: '#fff', borderRadius: 1.6, position: 'absolute' },

  actionWrapper: { position: 'absolute', bottom: 16, alignItems: 'center', justifyContent: 'center', width: MAIN_SIZE, zIndex: 1000 },
  actionBtn: {
    width: ACTION_SIZE * 3.0,
    height: ACTION_SIZE,
    borderRadius: ACTION_SIZE / 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    flexDirection: 'row',
  },
  logoutBtn: { borderColor: '#ffecec', backgroundColor: '#fff7f7' },

  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 10 },
  actionText: { color: SUB_TEXT_COLOR, fontWeight: '700', fontSize: 13, letterSpacing: 0.2 },

  actionShadow: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },

  mainShadow: {
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 10,
  },

  /* Modal */
  modalRoot: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.36)' },
  modalCard: { width: '86%', backgroundColor: '#fff', borderRadius: 12, padding: 18, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 8, textAlign: 'center' },
  modalSubtitle: { color: '#64748b', marginBottom: 14, textAlign: 'center' },
  modalRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 12 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#f1f5f9' },
  confirmBtn: { backgroundColor: LOGOUT_ACCENT },
  modalBtnText: { fontWeight: '700', color: '#0f172a' },
});
