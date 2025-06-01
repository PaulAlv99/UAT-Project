import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import NavBar from "../components/Navbar";
import { useTheme } from "../ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

const LandingScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();

  const glow = useSharedValue(1);

  const glowStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: glow.value }],
        shadowColor: "#ffd700",
        shadowOpacity: 0.7,
        shadowRadius: 10 * glow.value,

      };
  });

  const animateGlow = () => {
    glow.value = withRepeat(
      withTiming(1.1, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  };

  const fetchUser = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return router.replace("/(tabs)/login");

      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
      } else {
        await AsyncStorage.multiRemove(["token", "user"]); // clear invalid session
        router.replace("/(tabs)/login");
      }
    } catch (err) {
      Alert.alert("Error", "Unable to load user.");
      await AsyncStorage.multiRemove(["token", "user"]); // ensure clean fallback
      router.replace("/(tabs)/login");
    } finally {
      setLoading(false);
    }
  }, [router]);


  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchUser();
      animateGlow();
    }, [fetchUser])
  );

  const logout = async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    setUser(null);
    router.replace("/(tabs)/login");
  };

  const styles = getThemeStyles(isDarkMode);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#ff8c00" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <NavBar isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.name}>{user?.name ?? "User"}</Text>
        </View>

        {user?.profileImage ? (
          <View style={styles.imageWrapper}>
            <Animated.View style={glowStyle}>
              <Image
                source={{ uri: `data:image/jpeg;base64,${user.profileImage}` }}
                style={styles.imagePreview}
              />
            </Animated.View>
          </View>

        ) : (
          <Text style={{ marginBottom: 20, color: isDarkMode ? "#ccc" : "#555" }}>
            No profile image uploaded.
          </Text>
        )}

        <View style={styles.creditsCard}>
          <Text style={styles.creditsTitle}>Your Balance</Text>
          <Text style={styles.creditsAmount}>{user?.credits ?? 0} credits</Text>
        </View>

        <View style={styles.statsContainer}>
          <Stat label="Recipes Bought" value={user?.bought?.length ?? 0} style={styles} />
          <Stat label="Recipes Sold" value={user?.sold?.length ?? 0} style={styles} />
        </View>

        <NavButton label="Update Profile" onPress={() => router.push("/(tabs)/UpdateProfileScreen")} style={styles} />
        <NavButton label="Explore Recipes" onPress={() => router.push("/(tabs)/BuyRecipesScreen")} style={styles} />
        <NavButton label="Sell a Recipe" onPress={() => router.push("/(tabs)/SellRecipeScreen")} style={styles} />
        <NavButton label="My Recipes" onPress={() => router.push("/(tabs)/MyRecipesScreen")} style={styles} />

        <TouchableOpacity style={styles.logout} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const Stat = ({ label, value, style }: { label: string; value: number; style: any }) => (
  <View style={style.statBox}>
    <Text style={style.statNumber}>{value}</Text>
    <Text style={style.statLabel}>{label}</Text>
  </View>
);

const NavButton = ({ label, onPress, style }: { label: string; onPress: () => void; style: any }) => (
  <TouchableOpacity style={style.button} onPress={onPress}>
    <Text style={style.buttonText}>{label}</Text>
  </TouchableOpacity>
);

const getThemeStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#121212" : "#ffffff",
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    scroll: {
      padding: 20,
      alignItems: "center",
    },
    header: {
      width: "100%",
      marginBottom: 20,
    },
    greeting: {
      fontSize: 16,
      color: isDark ? "#ccc" : "#777",
    },
    name: {
      fontSize: 24,
      fontWeight: "700",
      color: isDark ? "#fff" : "#333",
    },
    imagePreview: {
      width: 140,
      height: 140,
      borderRadius: 70,
      marginBottom: 20,
      borderWidth: 3,
      borderColor: isDark ? "#666" : "#e5b700",
      backgroundColor: isDark ? "#333" : "#ffe789",
    },
    creditsCard: {
      backgroundColor: isDark ? "#2a2a2a" : "#fff5d0",
      borderColor: isDark ? "#666" : "#ffd700",
      borderWidth: 2,
      borderRadius: 16,
      padding: 20,
      width: "100%",
      alignItems: "center",
      marginBottom: 20,
    },
    creditsTitle: {
      fontSize: 18,
      color: isDark ? "#ddd28e" : "#8b6f00",
      marginBottom: 4,
    },
    imageWrapper: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    creditsAmount: {
      fontSize: 28,
      fontWeight: "bold",
      color: isDark ? "#f5de7b" : "#8b6f00",
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      marginBottom: 30,
    },
    statBox: {
      backgroundColor: isDark ? "#333" : "#f3f3f3",
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      width: "45%",
    },
    statNumber: {
      fontSize: 24,
      fontWeight: "bold",
      color: isDark ? "#fff" : "#333",
    },
    statLabel: {
      fontSize: 14,
      color: isDark ? "#bbb" : "#777",
      marginTop: 4,
    },
    button: {
      backgroundColor: "#ff8c00",
      paddingVertical: 14,
      borderRadius: 100,
      width: "100%",
      marginVertical: 10,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 3,
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "600",
    },
    logout: {
      marginTop: 30,
    },
    logoutText: {
      fontSize: 16,
      color: "#c70038",
      textDecorationLine: "underline",
    },
  });

export default LandingScreen;
