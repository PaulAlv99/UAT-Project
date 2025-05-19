import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  Image
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import NavBar from '../components/Navbar';
import { useTheme } from '../ThemeContext';

const SellRecipeScreen = () => {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [price, setPrice] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const forSale=true;
  const { isDarkMode, toggleTheme } = useTheme();

  useFocusEffect(
     useCallback(() => {

       return () => {
         // On screen blur: reset form
         setName('');
         setIngredients('');
         setSteps('');
         setPrice('');
         setImageBase64(null);
       };
     }, [])
   );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets[0].base64) {
      setImageBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          ingredients,
          steps,
          price,
          forSale,
          image: imageBase64 // include image
        })
      });

      const data = await res.json();
      if (data.success) {
        Alert.alert('Success', 'Recipe listed for sale!');
        setName('');
        setIngredients('');
        setSteps('');
        setPrice('');
        setImageBase64(null);
      } else {
        Alert.alert('Error', data.message || 'Could not submit recipe.');
      }
    } catch (err) {
      Alert.alert('Error', 'Server error while submitting recipe.');
    }
  };

  const styles = getStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container}>
      <NavBar isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.title}>Sell a Recipe</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Ingredients"
          placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
          value={ingredients}
          onChangeText={setIngredients}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Steps"
          placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
          value={steps}
          onChangeText={setSteps}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Price (credits)"
          placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        {imageBase64 && (
          <Image
            source={{ uri: imageBase64 }}
            style={{ width: '100%', height: 200, borderRadius: 10, marginBottom: 12 }}
          />
        )}

        <TouchableOpacity style={[styles.button, { marginBottom: 10 }]} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (dark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: dark ? '#121212' : '#fff'
    },
    form: {
      padding: 20
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: dark ? '#fff' : '#000'
    },
    input: {
      backgroundColor: dark ? '#222' : '#f9f9f9',
      color: dark ? '#fff' : '#000',
      padding: 12,
      borderRadius: 10,
      marginBottom: 12
    },
    button: {
      backgroundColor: '#c70038',
      padding: 14,
      borderRadius: 100,
      alignItems: 'center'
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold'
    }
  });

export default SellRecipeScreen;
