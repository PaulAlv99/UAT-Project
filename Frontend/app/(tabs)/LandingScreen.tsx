import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView, View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";

const landing_screen = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return router.replace("/(tabs)/login");

        const res = await fetch("http://localhost:3000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          alert("Session expired. Please login again.");
          router.replace("/(tabs)/login");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        alert("Failed to load user data.");
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#ff8c00" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.name}>{user.name}</Text>
          </View>
        </View>

        <View style={styles.creditsCard}>
          <Text style={styles.creditsTitle}>Your Balance</Text>
          <Text style={styles.creditsAmount}>💰 {user.credits} credits</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.bought || 0}</Text>
            <Text style={styles.statLabel}>Recipes Bought</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.sold || 0}</Text>
            <Text style={styles.statLabel}>Recipes Sold</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/buy-recipes")}>
          <Text style={styles.buttonText}>🛒 Explore Recipes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/sell-recipe")}>
          <Text style={styles.buttonText}>📤 Sell a Recipe</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/my-recipes")}>
          <Text style={styles.buttonText}>📁 My Recipes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logout}
          onPress={async () => {
            await AsyncStorage.removeItem("token");
            router.replace("/(tabs)/login");
          }}
        >
          <Text style={styles.logoutText}>🚪 Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default landing_screen;
