import React from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const handleLogin = () => console.log("LOGIN pressed");
  const handleRegister = () => console.log("REGISTER pressed");

  return (
    <SafeAreaView style={styles.primary}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          style={styles.logo}
          resizeMode="contain"
          source={require('@/assets/images/so_logo_1.png')}
        />

        <Text style={styles.whereYour}>WHERE YOUR</Text>
        <Text style={styles.recipes}>RECIPES</Text>
        <Text style={styles.comeTogether}>COME TOGETHER</Text>

        <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleRegister}>
          <Text style={styles.buttonText}>REGISTER</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  primary: {
    flex: 1,
    backgroundColor: "#c70038",
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  logo: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  whereYour: {
    fontFamily: "OpenSans-ExtraBold",
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
    marginBottom: 4,
  },
  recipes: {
    fontFamily: "OleoScript-Bold",
    fontSize: 64,
    color: "#ffe789",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
    marginBottom: 4,
  },
  comeTogether: {
    fontFamily: "OpenSans-ExtraBold",
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
    marginBottom: 40,
  },
  button: {
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginVertical: 10,
    borderWidth: 3,
    borderColor: "#f8ac50",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  loginButton: {
    backgroundColor: "#ff8c00",
  },
  registerButton: {
    backgroundColor: "#ff8c00",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
  },
});

export default HomeScreen;
