import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path, G, Circle } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, useNavigation } from "@react-navigation/native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

const NavBar = ({
  onToggleTheme,
  isDarkMode,
}: {
  onToggleTheme: () => void;
  isDarkMode: boolean;
}) => {
  const router = useRouter();
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  const styles = getStyles(isDarkMode);

  // Animation state for toggle icon
  const toggleAnim = useSharedValue(0);
  const iconAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withTiming(toggleAnim.value ? 1.2 : 1, { duration: 300 }) },
        { rotate: withTiming(`${toggleAnim.value * 180}deg`, { duration: 400 }) },
      ],
    };
  });

  const logout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "LandingScreen" }],
        })
      );
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        onPress={() => {
          toggleAnim.value = toggleAnim.value === 0 ? 1 : 0;
          setMenuVisible(false);
          onToggleTheme();
        }}
      >
        <Animated.View style={iconAnimStyle}>
          {isDarkMode ? (
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <G fill="none" stroke="currentColor" strokeWidth={1.5}>
                <Circle cx={12} cy={12} r={6} />
                <Path strokeLinecap="round" d="M12 2v1m0 18v1m10-10h-1M3 12H2m17.07-7.07l-.392.393M5.322 18.678l-.393.393m14.141-.001l-.392-.393M5.322 5.322l-.393-.393" />
              </G>
            </Svg>
          ) : (
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Path
                fill="currentColor"
                d="m21.067 11.857l-.642-.388zm-8.924-8.924l-.388-.642zM21.25 12A9.25 9.25 0 0 1 12 21.25v1.5c5.937 0 10.75-4.813 10.75-10.75zM12 21.25A9.25 9.25 0 0 1 2.75 12h-1.5c0 5.937 4.813 10.75 10.75 10.75zM2.75 12A9.25 9.25 0 0 1 12 2.75v-1.5C6.063 1.25 1.25 6.063 1.25 12zm12.75 2.25A5.75 5.75 0 0 1 9.75 8.5h-1.5a7.25 7.25 0 0 0 7.25 7.25zm4.925-2.781A5.75 5.75 0 0 1 15.5 14.25v1.5a7.25 7.25 0 0 0 6.21-3.505zM9.75 8.5a5.75 5.75 0 0 1 2.781-4.925l-.776-1.284A7.25 7.25 0 0 0 8.25 8.5z"
              />
            </Svg>
          )}
        </Animated.View>
      </TouchableOpacity>

      <View style={{ flex: 1 }} />

      <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Path
            fill="currentColor"
            d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z"
          />
        </Svg>
      </TouchableOpacity>

      <Modal
        transparent
        animationType="fade"
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
        statusBarTranslucent={true}
      >
        <TouchableOpacity style={styles.overlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.dropdown}>
            <TouchableOpacity onPress={() => { setMenuVisible(false); router.push("/(tabs)/LandingScreen"); }}>
              <Text style={styles.menuItem}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setMenuVisible(false); router.push("/(tabs)/MyRecipesScreen"); }}>
              <Text style={styles.menuItem}>My Recipes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setMenuVisible(false); router.push("/(tabs)/BuyRecipesScreen"); }}>
              <Text style={styles.menuItem}>Buy Recipes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setMenuVisible(false); router.push("/(tabs)/SellRecipeScreen"); }}>
              <Text style={styles.menuItem}>Sell Recipes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setMenuVisible(false); router.push("/(tabs)/HistoryScreen"); }}>
              <Text style={styles.menuItem}>Recipes History</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setMenuVisible(false); router.replace("/(tabs)/ChatScreen"); }}>
              <Text style={styles.menuItem}>Chat with others</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setMenuVisible(false); router.replace("/(tabs)/GroceryMap"); }}>
              <Text style={styles.menuItem}>Groceries nearby</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                setMenuVisible(false);
                await logout();
              }}
            >
              <Text style={styles.menuItem}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const getStyles = (isDarkMode: boolean) => {
  return StyleSheet.create({
    navbar: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      backgroundColor: isDarkMode ? "#474444" : "#fff",
      borderBottomColor: isDarkMode ? "#333" : "#eee",
      borderBottomWidth: 1,
    },
    overlay: {
      position: "absolute",
      top: 70,
      right: 10,
      backgroundColor: "rgba(0,0,0,0.1)",
      zIndex: 99,
    },
    dropdown: {
      backgroundColor: isDarkMode ? "#2b2b2b" : "#fff",
      borderRadius: 8,
      padding: 10,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 5,
      width: 180,
      gap: 12,
    },
    menuItem: {
      fontSize: 16,
      paddingVertical: 6,
      color: isDarkMode ? "#eee" : "#333",
    },
  });
};

export default NavBar;
