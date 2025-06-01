import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = React.useState('');
  const [recoveryPhrase, setRecoveryPhrase] = React.useState('');
  const router = useRouter();

  const handleRecover = () => {
    if (!email.trim() || !recoveryPhrase.trim()) {
      alert("Please fill in both fields.");
      return;
    }

    fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/recover-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, recoveryPhrase }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Recovery verified. You can now reset your password.");
          router.push({ pathname: "/reset-password", params: { email } });
        } else {
          alert(data.message || "Recovery failed.");
        }
      })
      .catch(() => alert("Server error. Try again later."));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>RECOVER ACCOUNT</Text>
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
          placeholder="RECOVERY PHRASE"
          placeholderTextColor="#8b0003"
          value={recoveryPhrase}
          onChangeText={setRecoveryPhrase}
        />

        <TouchableOpacity style={styles.confirmButton} onPress={handleRecover}>
          <Text style={styles.confirmText}>CONFIRM</Text>
        </TouchableOpacity>

        <Text style={styles.homeLink} onPress={() => router.push("/(tabs)/LandingScreen")}>
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
    fontSize: 40,
    fontFamily: "OpenSans-ExtraBold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  divider: {
    height: 6,
    width: 180,
    backgroundColor: "#ec0105",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 100,
    borderWidth: 5,
    borderColor: "#ffcbcc",
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    color: "#8b0003",
    fontFamily: "OpenSans-Bold",
    marginVertical: 10,
  },
  confirmButton: {
    backgroundColor: "#ec0105",
    borderColor: "#a30003",
    borderWidth: 5,
    borderRadius: 100,
    width: 240,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  confirmText: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "OpenSans-Bold",
  },
  homeLink: {
    color: "#fff",
    marginTop: 30,
    fontSize: 16,
    textDecorationLine: "underline",
    fontFamily: "OpenSans-Bold",
  },
});

export default ForgotPasswordScreen;