import * as React from "react";
import { Image, StyleSheet, View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          style={styles.logo}
          resizeMode="contain"
          source={require('@/assets/images/so_logo_1.png')}
        />

        <Text style={styles.loginTitle}>LOGIN</Text>

        <View style={styles.inputBox}>
          <Text style={styles.label}>USER NAME</Text>
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>PASSWORD</Text>
        </View>

        <Text style={styles.forgotPassword}>FORGOT PASSWORD?</Text>

        <View style={styles.loginButton}>
          <Text style={styles.loginText}>ENTER</Text>
        </View>

        <View style={styles.registerButton}>
          <Text style={styles.registerText}>REGISTER</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff8c00",
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logo: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 64,
    fontFamily: "OpenSans-ExtraBold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 4,
    marginBottom: 20,
  },
  divider: {
    marginVertical: 16,
  },
  inputBox: {
    width: 290,
    height: 48,
    backgroundColor: "#fff",
    borderColor: "rgba(180, 180, 180, 0.5)",
    borderWidth: 5,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 12,
  },
  label: {
    fontSize: 24,
    color: "#95002a",
    fontFamily: "OpenSans-ExtraBold",
  },
  forgotPassword: {
    fontSize: 16,
    color: "#c70038",
    marginVertical: 8,
    textAlign: "center",
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: "#c70038",
    borderColor: "#ff5833",
    borderWidth: 5,
    borderRadius: 100,
    width: 247,
    height: 57,
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 32,
    color: "#fff",
    fontFamily: "OpenSans-ExtraBold",
  },
  registerButton: {
    marginTop: 20,
    backgroundColor: "#95002a",
    borderColor: "#d02600",
    borderWidth: 4,
    borderRadius: 100,
    width: 181,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "OpenSans-ExtraBold",
  },
});

export default LoginScreen;
