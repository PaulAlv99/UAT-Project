import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  Image,
  SafeAreaView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from '../components/Navbar';
import { useTheme } from '../ThemeContext';
import { useFocusEffect } from '@react-navigation/native';

const HistoryScreen = () => {
  const [sections, setSections] = useState([]);
  const { isDarkMode, toggleTheme } = useTheme();

  useFocusEffect(
    useCallback(() => {
      fetchHistory(); // fetches every time screen comes into focus
    }, [])
  );

  const fetchHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/recipes/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSections([
          { title: 'Purchase History', data: data.history.bought },
          { title: 'Sales History', data: data.history.sold }
        ]);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load history.');
    }
  };

  const styles = getStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container}>
      <NavBar isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item._id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
        renderItem={({ item, section }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            {section.title === 'Purchase History' ? (
              <Text style={styles.detail}>From: {item.owner?.name || 'Unknown'}</Text>
            ) : (
              <Text style={styles.detail}>Sold to: {item.buyers?.map(b => b.name).join(', ') || 'None'}</Text>
            )}
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
};

const getStyles = (dark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: dark ? '#121212' : '#fff'
    },
    header: {
      fontSize: 22,
      fontWeight: 'bold',
      marginVertical: 16,
      color: dark ? '#fff' : '#000'
    },
    card: {
      backgroundColor: dark ? '#1e1e1e' : '#f0f0f0',
      borderRadius: 10,
      padding: 12,
      marginBottom: 10
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: dark ? '#fff' : '#000'
    },
    detail: {
      color: dark ? '#ccc' : '#333',
      marginVertical: 4
    },
    image: {
      width: '100%',
      height: 150,
      borderRadius: 10,
      marginTop: 8
    }
  });

export default HistoryScreen;
