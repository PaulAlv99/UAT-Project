import * as React from "react";
import {
  Text, StyleSheet, View, TextInput, TouchableOpacity, Switch,
  Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const RegisterScreen = () => {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [preference, setPreference] = React.useState('');
  const [recoveryPhrase, setRecoveryPhrase] = React.useState('');
  const [cookiesAccepted, setCookiesAccepted] = React.useState(true);
  const [imageBase64, setImageBase64] = React.useState(null);

  const strength = getPasswordStrength(password);
  const barWidth = useSharedValue(0);

  React.useEffect(() => {
    barWidth.value = withTiming((strength / 4) * 100, { duration: 300 });
  }, [strength]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageBase64(result.assets[0].base64 || null);
    }
  };

  const handleRegister = () => {
    if (!name.trim()) return alert("Name is required.");
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return alert("Valid email is required.");
    if (!password || password.length < 6) return alert("Password must be at least 6 characters.");
    if (!preference.trim()) return alert("Food preference is required.");
    if (!recoveryPhrase.trim()) return alert("Recovery phrase is required.");
    if (!cookiesAccepted) return alert("You must accept cookies.");

    fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        preference,
        recoveryPhrase,
        profileImage: imageBase64
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Registered successfully!");
          setName('');
          setEmail('');
          setPassword('');
          setPreference('');
          setRecoveryPhrase('');
          setImageBase64('');
          router.push("/(tabs)/login");
        } else {
          alert(data.message || "Registration failed.");
        }
      })
      .catch(() => alert("Server error. Try again later."));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>REGISTER</Text>
            <View style={styles.divider} />

            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {imageBase64 ? (
                <Image
                  source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
                  style={styles.imagePreview}
                />
              ) : (
                <Text style={styles.pickText}>Pick Profile Image</Text>
              )}
            </TouchableOpacity>
            <View style={{ width: '90%', marginBottom: 2 }}>
                <Text style={styles.strengthLabel}>
                    {['Too weak', 'Weak', 'Fair', 'Strong', 'Very strong'][strength]}
                </Text>
                  <View style={styles.strengthWrapper}>
                    <Animated.View style={[styles.strengthBar, useAnimatedStyle(() => ({
                      width: `${barWidth.value}%`,
                      backgroundColor:
                        strength <= 1 ? '#d32f2f' :
                        strength === 2 ? '#fbc02d' :
                        strength === 3 ? '#388e3c' : '#2e7d32',
                    }))]} />
                  </View>
              </View>
            <TextInput style={styles.input} placeholder="FULL NAME" value={name} onChangeText={setName} placeholderTextColor="#95002a" />
            <TextInput style={styles.input} placeholder="EMAIL" value={email} onChangeText={setEmail} placeholderTextColor="#95002a" keyboardType="email-address" />


            <TextInput
              style={styles.input}
              placeholder="PASSWORD"
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#95002a"
              secureTextEntry
            />
            <TextInput style={styles.input} placeholder="RECOVERY PHRASE" value={recoveryPhrase} onChangeText={setRecoveryPhrase} placeholderTextColor="#95002a" />
            <TextInput style={styles.input} placeholder="FOOD PREFERENCE" value={preference} onChangeText={setPreference} placeholderTextColor="#95002a" />

            <View style={styles.cookiesContainer}>
              <Text style={styles.cookiesText}>ACCEPT COOKIES</Text>
              <Switch
                trackColor={{ false: "#ccc", true: "#ffcc00" }}
                thumbColor={cookiesAccepted ? "#fff" : "#eee"}
                value={cookiesAccepted}
                onValueChange={setCookiesAccepted}
              />
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={handleRegister}>
              <Text style={styles.confirmText}>CONFIRM</Text>
            </TouchableOpacity>

            <Text style={styles.loginLink} onPress={() => router.push("/(tabs)/login")}>Already have an account? LOGIN</Text>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ff5833" },
  scroll: { alignItems: "center", padding: 20 },
  title: { fontSize: 48, color: "#fff", fontFamily: "OpenSans-ExtraBold", marginBottom: 8 },
  divider: { height: 6, width: 180, backgroundColor: "#ffcc00", marginBottom: 20 },
  input: {
    width: "90%", backgroundColor: "#ffe789", borderRadius: 100, borderWidth: 5, borderColor: "#e5b700",
    paddingHorizontal: 20, paddingVertical: 14, fontSize: 16, color: "#95002a", fontFamily: "OpenSans-Bold", marginVertical: 8,
  },
  strengthWrapper: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffe789",
    overflow: "hidden",
    marginBottom: 6,
  },
  strengthBar: {
    height: "100%",
    borderRadius: 4,
  },
  strengthLabel: {
    fontFamily: "OpenSans-Bold",
    fontSize: 14,
    color: "#fff",
    alignSelf: "flex-start",
    marginBottom: 8,
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
    backgroundColor: "#ffe789",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  },
  pickText: {
    color: "#95002a",
    fontFamily: "OpenSans-Bold",
    textAlign: "center"
  },
  cookiesContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, width: "90%" },
  cookiesText: { color: "#fff", fontSize: 18, fontFamily: "OpenSans-Bold" },
  confirmButton: {
    backgroundColor: "#e5b800", borderColor: "#ad8b06", borderWidth: 5, borderRadius: 100, marginTop: 24,
    width: 240, height: 55, justifyContent: "center", alignItems: "center"
  },
  confirmText: { color: "#fff", fontSize: 24, fontFamily: "OpenSans-Bold" },
  loginLink: {
    color: "#fff",
    fontSize: 16,
    textDecorationLine: "underline",
    marginTop: 24,
    fontFamily: "OpenSans-Bold",
  }
});

export default RegisterScreen;
