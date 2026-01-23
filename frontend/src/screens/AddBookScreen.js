import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Alert,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import api from '../api/api'; 

export default function AddBookScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Animations ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance Animation: Slide up and Fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };
  // ------------------

  const validate = () => {
    if (!title.trim()) return 'Title is required';
    if (!author.trim()) return 'Author is required';
    if (!category.trim()) return 'Category is required';
    return null;
  };

  const handleSubmit = async () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        isAvailable: !!isAvailable,
      };

      // Exact endpoint logic kept
      const res = await api.post('/books/add', payload);

      Alert.alert('Success', 'Book added successfully.');
      
      setTitle('');
      setAuthor('');
      setCategory('');
      setIsAvailable(true);
      navigation?.goBack?.();
    } catch (err) {
      let message = 'Failed to add book';
      if (err.response) {
        const data = err.response.data;
        message =
          typeof data === 'string'
            ? data
            : data?.message || JSON.stringify(data) || `Server ${err.response.status}`;
      } else if (err.request) {
        message = 'No response from server. Is the backend running?';
      } else {
        message = err.message;
      }
      console.error('AddBook error:', err);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: null })}
      style={styles.screen}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.formContainer, 
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.heading}>New Entry</Text>
            <Text style={styles.subHeading}>Fill in the details to add a book</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. The Great Gatsby"
              placeholderTextColor="#9aa0a6"
              value={title}
              onChangeText={setTitle}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Author</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. F. Scott Fitzgerald"
              placeholderTextColor="#9aa0a6"
              value={author}
              onChangeText={setAuthor}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Fiction, History"
              placeholderTextColor="#9aa0a6"
              value={category}
              onChangeText={setCategory}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Mark as Available</Text>
            <Switch 
              value={isAvailable} 
              onValueChange={setIsAvailable}
              trackColor={{ false: '#cbd5e1', true: '#bbf7d0' }} // light version of accent
              thumbColor={isAvailable ? '#4ade80' : '#f4f4f5'}
            />
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.error}>{error}</Text>
            </View>
          ) : null}

          <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%' }}>
            <TouchableOpacity
              onPress={handleSubmit}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={[styles.button, loading && styles.buttonDisabled]}
              disabled={loading}
              activeOpacity={1} // Handled by scale animation
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Add Book</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  scrollContainer: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center', // Vertically center the form
  },
  formContainer: {
    width: '100%',
    alignSelf: 'center',
    maxWidth: 500, // Good for tablets
  },
  headerContainer: {
    marginBottom: 32,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subHeading: {
    fontSize: 16,
    color: '#64748b', // Slate 500
    fontWeight: '400',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155', // Slate 700
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 16,
    backgroundColor: '#f1f5f9',
    color: '#0f172a',
    fontSize: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 10,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  switchLabel: { 
    fontSize: 16, 
    fontWeight: '500',
    color: '#0f172a' 
  },
  button: {
    height: 56,
    width: '100%',
    borderRadius: 28, // Pill shape
    backgroundColor: '#4ade80',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4ade80',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: { 
    opacity: 0.7,
    shadowOpacity: 0.1,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 18,
    letterSpacing: 0.5,
  },
  errorContainer: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  error: { 
    color: '#dc2626', 
    textAlign: 'center', 
    fontWeight: '500' 
  },
});