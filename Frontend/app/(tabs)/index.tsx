import React from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
// TODO In every page needs to keep track if it's black or light mode passs context between them
const HomeScreen = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const dynamicStyles = createStyles(width);

  return (
    <SafeAreaView style={dynamicStyles.primary}>
      <ScrollView contentContainerStyle={dynamicStyles.scrollContent}>
        <Image
          style={dynamicStyles.logo}
          resizeMode="contain"
          source={require('@/assets/images/so_logo_1.png')}
        />

        <Text style={dynamicStyles.whereYour}>WHERE YOUR</Text>
        <Text style={dynamicStyles.recipes}>RECIPES</Text>
        <Text style={dynamicStyles.comeTogether}>COME TOGETHER</Text>

        <TouchableOpacity style={[dynamicStyles.button, dynamicStyles.loginButton]} onPress={() => router.push("/login")}>
          <Text style={dynamicStyles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[dynamicStyles.button, dynamicStyles.registerButton]} onPress={() => router.push("/register")}>
          <Text style={dynamicStyles.buttonText}>REGISTER</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (width: number) => StyleSheet.create({
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
    width: width * 0.8,
    height: width * 0.4,
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
    width: width * 0.75,
    borderRadius: 50,
    paddingVertical: 14,
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
