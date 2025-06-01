import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';
import NavBar from '../components/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';

const UpdateProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showProfileImage, setShowProfileImage] = useState<string | null>(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const styles = getStyles(isDarkMode);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const base64 = result.assets[0].base64;
      if (base64) {

        setProfileImage(base64);
        setShowProfileImage(`data:image/jpeg;base64,${base64}`);

      } else {
        Alert.alert("Failed to get base64 image.");
      }
    } else {
      Alert.alert("Image selection canceled or failed.");
    }
  };


    const navigation = useNavigation();

    const logout = async () => {
      try {
        await AsyncStorage.clear(); // Remove token and other data

        // Navigate to landing screen and reset stack
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'LandingScreen' }],
          })
        );
      } catch (err) {
        console.error("Logout failed", err);
        Alert.alert("Logout failed", "Please try again.");
      }
    };


  const handleUpdate = async () => {
    if (newPassword && newPassword.length < 6) {
      return Alert.alert('Password must be at least 6 characters');
    }

    if (!username && !newPassword && !profileImage) {
      return Alert.alert('Please provide at least one value to update');
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/users/update-profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...(username && { username }),
          ...(newPassword && { newPassword }),
          ...(profileImage && { profileImage }),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('Profile updated successfully!');
        if(newPassword != ''){
            logout();
        }
        setProfileImage('');
        setNewPassword('');
        setShowProfileImage('');
        setUsername('');
      } else {
        Alert.alert('Error', data.message || 'Update failed');
      }
    } catch (err: any) {
      console.error('Update error:', err);
      Alert.alert('Network error', err.message || 'Check your connection and try again.');
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <NavBar isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>UPDATE PROFILE</Text>
            <View style={styles.divider} />

            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {profileImage ? (
                <Image source={{ uri: showProfileImage }} style={styles.imagePreview} />
              ) : (
                <Text style={styles.pickText}>Pick Profile Image</Text>
              )}
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="NEW USERNAME"
              placeholderTextColor={isDarkMode ? "#ffeeee" : "#95002a"}
              value={username}
              onChangeText={setUsername}
            />

            <TextInput
              style={styles.input}
              placeholder="NEW PASSWORD"
              placeholderTextColor={isDarkMode ? "#ffeeee" : "#95002a"}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TouchableOpacity style={styles.confirmButton} onPress={handleUpdate}>
              <Text style={styles.confirmText}>CONFIRM</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#fff'
  },
  scroll: {
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 40,
    color: isDarkMode ? '#fff' : '#333',
    fontFamily: "OpenSans-ExtraBold",
    marginBottom: 8,
  },
  divider: {
    height: 6,
    width: 180,
    backgroundColor: "#ffcc00",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    backgroundColor: isDarkMode ? "#333" : "#ffe789",
    borderRadius: 100,
    borderWidth: 5,
    borderColor: isDarkMode ? "#666" : "#e5b700",
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    color: isDarkMode ? "#fff" : "#95002a",
    fontFamily: "OpenSans-Bold",
    marginVertical: 10,
  },
  imagePicker: {
    marginBottom: 12,
    width: 160,
    height: 160,
    borderRadius: 80,
    borderColor: "#e5b700",
    borderWidth: 3,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: isDarkMode ? "#444" : "#ffe789",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  pickText: {
    color: isDarkMode ? "#ddd" : "#95002a",
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: "#e5b800",
    borderColor: "#ad8b06",
    borderWidth: 5,
    borderRadius: 100,
    marginTop: 24,
    width: 240,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "OpenSans-Bold",
  },
});

export default UpdateProfileScreen;
