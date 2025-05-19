import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from '../components/Navbar';
import { useTheme } from '../ThemeContext';

const MyRecipesScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const fetchMyRecipes = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/recipes/mine`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setRecipes(data.recipes || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to load recipes.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/recipes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('Deleted', 'Recipe removed.');
        fetchMyRecipes();
      } else {
        Alert.alert('Error', data.message || 'Failed to delete.');
      }
    } catch (err) {
      Alert.alert('Error', 'Server error on delete.');
    }
  };

  const toggleDetails = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const styles = getStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container}>
      <NavBar isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      <Text style={styles.title}>My Recipes</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const expanded = expandedId === item._id;

          return (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price} credits</Text>

              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={{ width: '100%', height: 200, borderRadius: 10, marginVertical: 10 }}
                />
              ) : (
                <Text style={{ color: '#888', marginVertical: 10 }}>No image</Text>
              )}

              <TouchableOpacity
                style={styles.detailBtn}
                onPress={() => toggleDetails(item._id)}
              >
                <Text style={styles.detailText}>{expanded ? 'Hide Details' : 'Show Details'}</Text>
              </TouchableOpacity>

              {expanded && (
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.sectionTitle}>Ingredients:</Text>
                  <Text style={styles.sectionText}>{item.ingredients || 'N/A'}</Text>

                  <Text style={styles.sectionTitle}>Steps:</Text>
                  <Text style={styles.sectionText}>{item.steps || 'N/A'}</Text>
                </View>
              )}

              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item._id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

const getStyles = (dark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: dark ? '#121212' : '#fff',
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      marginVertical: 16,
      textAlign: 'center',
      color: dark ? '#fff' : '#000',
    },
    card: {
      backgroundColor: dark ? '#1e1e1e' : '#fff',
      borderRadius: 10,
      padding: 16,
      marginBottom: 12,
      elevation: 3,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: dark ? '#fff' : '#000',
    },
    price: {
      color: dark ? '#aaa' : '#555',
      marginVertical: 6,
    },
    deleteBtn: {
      backgroundColor: '#c70038',
      padding: 8,
      borderRadius: 10,
      marginTop: 10,
    },
    deleteText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    detailBtn: {
      backgroundColor: '#444',
      padding: 8,
      borderRadius: 10,
      marginTop: 10,
    },
    detailText: {
      color: '#fff',
      textAlign: 'center',
    },
    sectionTitle: {
      color: dark ? '#ffd700' : '#333',
      fontWeight: '600',
      marginTop: 10,
    },
    sectionText: {
      color: dark ? '#ddd' : '#555',
      marginTop: 2,
    },
  });

export default MyRecipesScreen;
