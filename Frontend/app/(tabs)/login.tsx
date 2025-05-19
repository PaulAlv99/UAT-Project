import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Image, StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { API_URL } from '@env'
const ELEMENT_WIDTH = 290;
const ELEMENT_HEIGHT = 55;

const LoginScreen = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return alert("Email and password are required.");

    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success && data.token) {

        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("dark", "false");

        router.push("/(tabs)/LandingScreen");
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Server error. Try again later.");
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image style={styles.logo} resizeMode="contain" source={require('@/assets/images/so_logo_1.png')} />
        <Text style={styles.loginTitle}>LOGIN</Text>

        <TextInput
          style={styles.inputBox}
          placeholder="EMAIL"
          placeholderTextColor="#95002a"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.inputBox}
          placeholder="PASSWORD"
          placeholderTextColor="#95002a"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.forgotPassword} onPress={() => router.push("/(tabs)/recover_password")}>
                  FORGOT PASSWORD?
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.loginText}>ENTER</Text>
        </TouchableOpacity>

        <Text style={styles.registerLink} onPress={() => router.push("/(tabs)/register")}>
          Don’t have an account? REGISTER
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ff8c00" },
  scrollContainer: { alignItems: "center", paddingVertical: 40, paddingHorizontal: 20 },
  logo: { width: "100%", height: 200, marginBottom: 20 },
  loginTitle: {
    fontSize: 64, fontFamily: "OpenSans-ExtraBold", color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.25)", textShadowOffset: { width: 0, height: 6 }, textShadowRadius: 4, marginBottom: 20,
  },
  inputBox: {
    width: ELEMENT_WIDTH, height: ELEMENT_HEIGHT, backgroundColor: "#fff",
    borderColor: "rgba(180, 180, 180, 0.5)", borderWidth: 5, borderRadius: 100,
    paddingHorizontal: 20, marginVertical: 12, fontSize: 18,
    fontFamily: "OpenSans-Bold", color: "#95002a",
  },
  forgotPassword: { fontSize: 16, color: "#c70038", marginVertical: 8, textAlign: "center" },
  button: {
    width: ELEMENT_WIDTH, height: ELEMENT_HEIGHT, justifyContent: "center", alignItems: "center",
    backgroundColor: "#c70038", borderColor: "#ff5833", borderWidth: 5, borderRadius: 100, marginTop: 20,
  },
  loginText: { fontSize: 24, color: "#fff", fontFamily: "OpenSans-ExtraBold" },
  registerLink: {
    color: "#fff",
    fontSize: 16,
    textDecorationLine: "underline",
    marginTop: 24,
    fontFamily: "OpenSans-Bold",
  },

  registerText: { fontSize: 20, color: "#fff", fontFamily: "OpenSans-ExtraBold" },
});

export default LoginScreen;
