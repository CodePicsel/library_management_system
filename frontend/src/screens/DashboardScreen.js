// DashboardScreen.js
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity
} from 'react-native';

// Import your illustration image (keep your existing path)
import illustration from '../../assets/reading_img_removed_bg.png';

const DashboardScreen = () => {
  // compute greeting based on local time, and split into two lines:
  // "Good" on first line and "<Period>," on second (e.g. "Afternoon,")
  const { firstLine, secondLine } = useMemo(() => {
    const hour = new Date().getHours();
    let period = 'Morning';
    if (hour >= 12 && hour < 17) period = 'Afternoon';
    else if (hour >= 17 && hour < 21) period = 'Evening';
    else period = 'Night';
    return { firstLine: 'Good', secondLine: `${period},` };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EAECEF" />
      
      {/* Main content container */}
      <View style={styles.content}>
        
        {/* Greeting and Search Header */}
        <View style={styles.headerContainer}>
          {/* Greeting split across two lines */}
          <Text style={styles.greetingText}>
            {firstLine}
            {'\n'}
            {secondLine}
          </Text>

          <Text style={styles.userName}>John Deo</Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            {/* simple green search icon (plain glyph) */}
            <TouchableOpacity activeOpacity={0.7} style={styles.searchIcon}>
              <Text style={styles.searchIconText}>🔍</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.searchInput}
              placeholder="Search for Books..."
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>
        
        {/* Illustration placed absolutely */}
        <Image 
          source={illustration}
          style={styles.illustration}
          resizeMode="contain"
        />

      </View>
      
      {/* The rest of your dashboard content would go here */}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // This is your "opaqe bg image" color. Place it here.
    backgroundColor: '#EAECEF', // A light, opaque grey background
  },
  content: {
    flex: 1,
    position: 'relative', // Needed for absolute positioning of the image
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 40, // Adjust for status bar height
    zIndex: 1, // Ensure the text is above the image
  },
  greetingText: {
    fontSize: 18,                          // base size you gave
    lineHeight: 21,                        // tall leading so "Good" and "Afternoon," sit nicely
    color: '#6AAB73',                      // green tint (your value)
    fontWeight: '200',                     // light/regular stroke
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', // serif feel on both platforms

    // micro-typography tweaks to match the reference
    letterSpacing: -0.3,                   // slightly tighter tracking
    textAlign: 'left',
    marginTop: 20,

    // subtle shadow to give a touch of depth (very light)
    textShadowColor: 'rgba(0,0,0,0.06)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  },
  userName: {
    fontSize: 35,
    color: '#000000', // Black color
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
  searchContainer: {
    // marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1, // Ensure search bar is above the image
  },
  searchIcon: {
    marginRight: 10,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchIconText: {
    fontSize: 18,
    color: '#22c55e' // green color (as requested)
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  illustration: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 275, // Adjust width as needed
    height: 275, // Adjust height as needed
    // Adjust positioning to match the design
    transform: [{ translateX: 50 }, { translateY: -25 }], 
    zIndex: 0, // Place it behind the text/search bar
  },
});

export default DashboardScreen;
