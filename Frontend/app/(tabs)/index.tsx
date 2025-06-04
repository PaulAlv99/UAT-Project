import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Pressable } from "react-native";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const HomeScreen = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const dynamicStyles = createStyles(width);

  // Shared values for button animations
  const loginScale = useSharedValue(1);
  const registerScale = useSharedValue(1);

  const loginAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: loginScale.value }],
  }));

  const registerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: registerScale.value }],
  }));

  return (
    <SafeAreaView style={dynamicStyles.primary}>
      <ScrollView contentContainerStyle={dynamicStyles.scrollContent}>
        <Image
          style={dynamicStyles.logo}
          resizeMode="contain"
          source={require("@/assets/images/so_logo_1.png")}
        />

        <Text style={dynamicStyles.whereYour}>WHERE YOUR</Text>
        <Text style={dynamicStyles.recipes}>RECIPES</Text>
        <Text style={dynamicStyles.comeTogether}>COME TOGETHER</Text>

        <AnimatedPressable
          onPressIn={() => (loginScale.value = withSpring(0.95))}
          onPressOut={() => (loginScale.value = withSpring(1))}
          onPress={() => router.push("/login")}
          style={[dynamicStyles.button, dynamicStyles.loginButton, loginAnimatedStyle]}
        >
          <Text style={dynamicStyles.buttonText}>LOGIN</Text>
        </AnimatedPressable>

        <AnimatedPressable
          onPressIn={() => (registerScale.value = withSpring(0.95))}
          onPressOut={() => (registerScale.value = withSpring(1))}
          onPress={() => router.push("/register")}
          style={[dynamicStyles.button, dynamicStyles.registerButton, registerAnimatedStyle]}
        >
          <Text style={dynamicStyles.buttonText}>REGISTER</Text>
        </AnimatedPressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (width: number) =>
  StyleSheet.create({
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
