import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Eye, EyeOff, Mail, Lock, User, BookOpen } from 'lucide-react';

export default function AuthForm({ submitLabel = 'Submit', onSubmit, initial = {} }) {
  const [email, setEmail] = useState(initial.email ?? '');
  const [password, setPassword] = useState(initial.password ?? '');
  const [name, setName] = useState(initial.name ?? '');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false, name: false });
  const [focused, setFocused] = useState(null);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getEmailError = () => {
    if (!touched.email || !email) return null;
    return !validateEmail(email) ? 'Please enter a valid email address' : null;
  };

  const getPasswordError = () => {
    if (!touched.password || !password) return null;
    return password.length < 6 ? 'Password must be at least 6 characters' : null;
  };

  const isFormValid = () => {
    return email && password && validateEmail(email) && password.length >= 6;
  };

  const handle = async () => {
    setTouched({ email: true, password: true, name: true });
    
    if (!isFormValid()) {
      setError('Please fix the errors above');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const payload = name ? { name, email, password } : { email, password };
      const result = await onSubmit(payload);
      if (!result?.ok) {
        setError(result?.error || 'Authentication failed. Please try again.');
      }
    } catch (e) {
      setError(e.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const emailError = getEmailError();
  const passwordError = getPasswordError();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BookOpen size={48} color="#6366f1" strokeWidth={2} />
        <Text style={styles.title}>Library Portal</Text>
        <Text style={styles.subtitle}>
          {name !== undefined ? 'Create your account' : 'Sign in to continue'}
        </Text>
      </View>

      <View style={styles.form}>
        {name !== undefined && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name (Optional)</Text>
            <View style={[
              styles.inputWrapper,
              focused === 'name' && styles.inputWrapperFocused
            ]}>
              <User size={20} color="#9ca3af" style={styles.icon} />
              <TextInput
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                onFocus={() => setFocused('name')}
                onBlur={() => {
                  setFocused(null);
                  setTouched({ ...touched, name: true });
                }}
                style={styles.input}
                autoCapitalize="words"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address *</Text>
          <View style={[
            styles.inputWrapper,
            focused === 'email' && styles.inputWrapperFocused,
            emailError && styles.inputWrapperError
          ]}>
            <Mail size={20} color="#9ca3af" style={styles.icon} />
            <TextInput
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocused('email')}
              onBlur={() => {
                setFocused(null);
                setTouched({ ...touched, email: true });
              }}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholderTextColor="#9ca3af"
            />
          </View>
          {emailError && <Text style={styles.fieldError}>{emailError}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password *</Text>
          <View style={[
            styles.inputWrapper,
            focused === 'password' && styles.inputWrapperFocused,
            passwordError && styles.inputWrapperError
          ]}>
            <Lock size={20} color="#9ca3af" style={styles.icon} />
            <TextInput
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocused('password')}
              onBlur={() => {
                setFocused(null);
                setTouched({ ...touched, password: true });
              }}
              secureTextEntry={!showPassword}
              style={styles.input}
              autoCapitalize="none"
              autoComplete="password"
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              activeOpacity={0.7}
            >
              {showPassword ? (
                <EyeOff size={20} color="#6b7280" />
              ) : (
                <Eye size={20} color="#6b7280" />
              )}
            </TouchableOpacity>
          </View>
          {passwordError && <Text style={styles.fieldError}>{passwordError}</Text>}
          {!passwordError && focused === 'password' && password && (
            <Text style={styles.hint}>
              Password strength: {password.length >= 12 ? 'Strong' : password.length >= 8 ? 'Good' : 'Weak'}
            </Text>
          )}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.error}>{String(error)}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.buttonDisabled,
            !isFormValid() && styles.buttonDisabled
          ]}
          onPress={handle}
          disabled={loading || !isFormValid()}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>{submitLabel}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    maxWidth: 420,
    alignSelf: 'center',
    marginTop: 24
  },
  header: {
    alignItems: 'center',
    marginBottom: 32
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 16
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    marginTop: 8
  },
  form: {
    gap: 20
  },
  inputGroup: {
    gap: 8
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    transition: 'all 0.2s'
  },
  inputWrapperFocused: {
    borderColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2
  },
  inputWrapperError: {
    borderColor: '#ef4444'
  },
  icon: {
    marginRight: 12
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    padding: 0
  },
  eyeButton: {
    padding: 8,
    marginLeft: 4
  },
  fieldError: {
    color: '#ef4444',
    fontSize: 13,
    marginTop: 4
  },
  hint: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 4
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444'
  },
  error: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500'
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});