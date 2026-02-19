// src/screens/DashboardScreen.js
import React, { useMemo, useLayoutEffect, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';

import illustration from '../../assets/reading_img_removed_bg.png';
import FloatingAddButton from '../components/FloatingAddButton';
import BookCard from '../components/BookCard';
import api from '../api/api'; // your axios instance

const DashboardScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    if (navigation?.setOptions) {
      navigation.setOptions({ headerShown: false });
    }
  }, [navigation]);

  const { firstLine, secondLine } = useMemo(() => {
    const hour = new Date().getHours();
    let period = 'Morning';
    if (hour >= 12 && hour < 17) period = 'Afternoon';
    else if (hour >= 17 && hour < 21) period = 'Evening';
    else period = 'Night';
    return { firstLine: 'Good', secondLine: `${period},` };
  }, []);

  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/books/books-all');
      setBooks(Array.isArray(res.data) ? res.data : []);
      // console.log(filtered)
      setFiltered(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('fetchBooks error', err?.response ?? err.message ?? err);
      setError('Failed to load books. Check server or network.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBooks();
    setRefreshing(false);
  }, [fetchBooks]);

  // Search filter
  useEffect(() => {
    if (!query?.trim()) {
      setFiltered(books);
      return;
    }
    const q = query.toLowerCase();
    setFiltered(
      books.filter(b =>
        `${b.title ?? ''} ${b.author ?? ''} ${b.category ?? ''}`.toLowerCase().includes(q)
      )
    );
  }, [query, books]);

  const renderEmpty = () => {
    if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
    return (
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Text style={{ color: '#6b7280' }}>{error ? error : 'No books found'}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EAECEF" />
      {/* <FloatingAddButton /> */}
      <FloatingAddButton navigation={navigation} />
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.greetingText}>
            {firstLine}
            {'\n'}
            {secondLine}
          </Text>
          <Text style={styles.userName}>John Deo</Text>

          <View style={styles.searchContainer}>
            <TouchableOpacity activeOpacity={0.7} style={styles.searchIcon}>
              <Text style={styles.searchIconText}>🔍</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.searchInput}
              placeholder="Search for Books..."
              placeholderTextColor="#A0A0A0"
              value={query}
              onChangeText={setQuery}
            />
          </View>
        </View>

        <Image source={illustration} style={styles.illustration} resizeMode="contain" />

        {/* Book list area */}
        <View style={styles.listContainer}>
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.book_id ?? item.id ?? Math.random())}
            renderItem={({ item }) => (
              <BookCard
                book={item}
                // onPress={(b) => {
                //   // Navigate to details or edit - optional
                //   navigation.navigate('BookDetail', { book: b });
                // }}
              />
            )}
            ListEmptyComponent={renderEmpty}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 120 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAECEF' },
  content: { flex: 1, position: 'relative' },
  headerContainer: { paddingHorizontal: 20, paddingTop: 40, zIndex: 1 },
  greetingText: {
    fontSize: 18,
    lineHeight: 21,
    color: '#4ade80',
    fontWeight: '200',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: -0.3,
    textAlign: 'left',
    marginTop: 20,
    textShadowColor: 'rgba(0,0,0,0.06)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  userName: { fontSize: 35, color: '#000', fontWeight: 'bold', marginBottom: 20, marginTop: 10 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  searchIcon: { marginRight: 10, width: 28, alignItems: 'center', justifyContent: 'center' },
  searchIconText: { fontSize: 18, color: '#22c55e' },
  searchInput: { flex: 1, fontSize: 16, color: '#000' },
  illustration: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 275,
    height: 275,
    transform: [{ translateX: 50 }, { translateY: -25 }],
    zIndex: 0,
  },
  listContainer: {
    marginTop: 16,
    zIndex: 2,
  },
});

export default DashboardScreen;
