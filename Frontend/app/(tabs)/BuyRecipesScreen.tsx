import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, SafeAreaView
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from '../components/Navbar';

const BuyRecipesScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchRecipes();
    AsyncStorage.getItem('dark').then((d) => setIsDarkMode(d === 'true'));
  }, []);

  const fetchRecipes = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/recipes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) setRecipes(data.recipes || []);
  };

  const handleBuy = async (id) => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/recipes/${id}/buy`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      Alert.alert('Purchased!', 'Recipe added to your account.');
    } else {
      Alert.alert('Error', data.message);
    }
  };

  const styles = getStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container}>
      <NavBar isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode((prev) => !prev)} />
      <Text style={styles.title}>Explore Recipes</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price} credits</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleBuy(item._id)}>
              <Text style={styles.buttonText}>Buy</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const getStyles = (dark) => StyleSheet.create({
  container: { flex: 1, backgroundColor: dark ? '#121212' : '#fff' },
  title: {
    fontSize: 28, fontWeight: 'bold', textAlign: 'center',
    marginVertical: 16, color: dark ? '#fff' : '#333'
  },
  card: {
    backgroundColor: dark ? '#1e1e1e' : '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4
  },
  name: { fontSize: 20, fontWeight: '600', color: dark ? '#fff' : '#000' },
  price: { fontSize: 16, color: dark ? '#aaa' : '#555', marginBottom: 8 },
  image: { height: 150, width: '100%', borderRadius: 10, marginBottom: 10 },
  button: {
    backgroundColor: '#ff8c00', paddingVertical: 10, borderRadius: 100, alignItems: 'center'
  },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});

export default BuyRecipesScreen;
