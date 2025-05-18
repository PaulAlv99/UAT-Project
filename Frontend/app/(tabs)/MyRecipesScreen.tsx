import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from '../components/Navbar';

const MyRecipesScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchMyRecipes();
    AsyncStorage.getItem('dark').then((d) => setIsDarkMode(d === 'true'));
  }, []);

  const fetchMyRecipes = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/recipes/mine`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) setRecipes(data.recipes || []);
  };

  const handleDelete = async (id) => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${EXPO_PUBLIC_API_URL}/api/recipes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      Alert.alert('Deleted', 'Recipe removed.');
      fetchMyRecipes();
    }
  };

  const styles = getStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container}>
      <NavBar isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode((p) => !p)} />
      <Text style={styles.title}>My Recipes</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price} credits</Text>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item._id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const getStyles = (dark) => StyleSheet.create({
  container: { flex: 1, backgroundColor: dark ? '#121212' : '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginVertical: 16, textAlign: 'center', color: dark ? '#fff' : '#000' },
  card: {
    backgroundColor: dark ? '#1e1e1e' : '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 3
  },
  name: { fontSize: 18, fontWeight: 'bold', color: dark ? '#fff' : '#000' },
  price: { color: dark ? '#aaa' : '#555', marginVertical: 6 },
  deleteBtn: { backgroundColor: '#c70038', padding: 8, borderRadius: 10 },
  deleteText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});

export default MyRecipesScreen;