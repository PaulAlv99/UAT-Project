import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const ResetPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = () => {
    if (!email.trim()) return alert("Email is required.");
    if (!newPassword.trim() || newPassword.length < 6)
      return alert("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword)
      return alert("Passwords do not match.");

    fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          Alert.alert("Success", "Password reset successfully.");
          router.push("/(tabs)/login");
        } else {
          Alert.alert("Error", data.message || "Password reset failed.");
        }
      })
      .catch(() => Alert.alert("Error", "Server error. Try again later."));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>RESET PASSWORD</Text>
        <View style={styles.divider} />

        <TextInput
          style={styles.input}
          placeholder="EMAIL"
          placeholderTextColor="#8b0003"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="NEW PASSWORD"
          placeholderTextColor="#8b0003"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="CONFIRM PASSWORD"
          placeholderTextColor="#8b0003"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.confirmButton} onPress={handleReset}>
          <Text style={styles.confirmText}>RESET</Text>
        </TouchableOpacity>

        <Text style={styles.homeLink} onPress={() => router.push("/(tabs)/index")}>
          Back to Home
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f85457" },
  scroll: { alignItems: "center", padding: 20 },
  title: {
    fontSize: 40, fontFamily: "OpenSans-ExtraBold", color: "#fff",
    marginBottom: 8, textAlign: "center"
  },
  divider: {
    height: 6, width: 180, backgroundColor: "#ec0105",
    marginBottom: 20
  },
  input: {
    width: "90%", backgroundColor: "#fff", borderRadius: 100,
    borderWidth: 5, borderColor: "#ffcbcc", paddingHorizontal: 20,
    paddingVertical: 14, fontSize: 16, color: "#8b0003", fontFamily: "OpenSans-Bold",
    marginVertical: 10
  },
  confirmButton: {
    backgroundColor: "#ec0105", borderColor: "#a30003",
    borderWidth: 5, borderRadius: 100, width: 240, height: 55,
    justifyContent: "center", alignItems: "center", marginTop: 20
  },
  confirmText: {
    color: "#fff", fontSize: 24, fontFamily: "OpenSans-Bold"
  },
  homeLink: {
    color: "#fff", marginTop: 30, fontSize: 16,
    textDecorationLine: "underline", fontFamily: "OpenSans-Bold"
  }
});

export default ResetPasswordScreen;
