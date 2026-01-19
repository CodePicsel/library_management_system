import React, { useState } from 'react';
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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { clearAuth } from '../api/api'; // <- uses your api instance

export default function AddBookScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      // Using your centralized axios instance
      const res = await api.post('/books/add', payload);

      // axios treats non-2xx as errors; successful response body is res.data
      Alert.alert('Success', 'Book added successfully.');
      // clear form or navigate back
      setTitle('');
      setAuthor('');
      setCategory('');
      setIsAvailable(true);
      navigation?.goBack?.();
    } catch (err) {
      // Normalize axios error messages
      let message = 'Failed to add book';
      if (err.response) {
        // server responded with a non-2xx status
        const data = err.response.data;
        message =
          typeof data === 'string'
            ? data
            : data?.message || JSON.stringify(data) || `Server ${err.response.status}`;
      } else if (err.request) {
        // request made but no response
        message = 'No response from server. Is the backend running?';
      } else {
        // something else
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
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Add Book</Text>

        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor="#9aa0a6"
          value={title}
          onChangeText={setTitle}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Author"
          placeholderTextColor="#9aa0a6"
          value={author}
          onChangeText={setAuthor}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Category"
          placeholderTextColor="#9aa0a6"
          value={category}
          onChangeText={setCategory}
          autoCapitalize="words"
        />

        <View style={styles.row}>
          <Text style={styles.label}>Available</Text>
          <Switch value={isAvailable} onValueChange={setIsAvailable} />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Add Book</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  container: {
    padding: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexGrow: 1,
  },
  heading: {
    alignSelf: 'flex-start',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    color: '#0f172a',
  },
  input: {
    width: 300,
    maxWidth: '85%',
    height: 44,
    borderRadius: 12,
    borderWidth: 0,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: '#f1f5f9',
    color: '#0f172a',
  },
  row: {
    width: 300,
    maxWidth: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  label: { fontSize: 16, color: '#0f172a' },
  button: {
    height: 40,
    width: 100,
    borderRadius: 10,
    backgroundColor: '#4ade80',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonDisabled: { opacity: 0.8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  error: { color: '#dc2626', textAlign: 'center', marginBottom: 6 },
});
