import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path, G, Circle } from "react-native-svg";

const NavBar = ({ onToggleTheme, isDarkMode }: { onToggleTheme: () => void, isDarkMode: boolean }) => {
  const router = useRouter();

  return (
    <View style={styles.navbar}>
      {/* Menu Icon */}
      <TouchableOpacity>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path fill="currentColor" d="M4 17.27v-1h16v1zm0-4.77v-1h16v1zm0-4.77v-1h16v1z" />
        </Svg>
      </TouchableOpacity>

      {/* Right Options */}
      <View style={styles.options}>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Text style={styles.optionText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/marketplace")}>
          <Text style={styles.optionText}>Marketplace</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/(tabs)/login")}>
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onToggleTheme}>
          {isDarkMode ? (
            // Light (sun) icon
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <G fill="none" stroke="currentColor" strokeWidth={1.5}>
                <Circle cx={12} cy={12} r={6} />
                <Path strokeLinecap="round" d="M12 2v1m0 18v1m10-10h-1M3 12H2m17.07-7.07l-.392.393M5.322 18.678l-.393.393m14.141-.001l-.392-.393M5.322 5.322l-.393-.393" />
              </G>
            </Svg>
          ) : (
            // Dark (moon) icon
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Path
                fill="currentColor"
                d="m21.067 11.857l-.642-.388zm-8.924-8.924l-.388-.642zM21.25 12A9.25 9.25 0 0 1 12 21.25v1.5c5.937 0 10.75-4.813 10.75-10.75zM12 21.25A9.25 9.25 0 0 1 2.75 12h-1.5c0 5.937 4.813 10.75 10.75 10.75zM2.75 12A9.25 9.25 0 0 1 12 2.75v-1.5C6.063 1.25 1.25 6.063 1.25 12zm12.75 2.25A5.75 5.75 0 0 1 9.75 8.5h-1.5a7.25 7.25 0 0 0 7.25 7.25zm4.925-2.781A5.75 5.75 0 0 1 15.5 14.25v1.5a7.25 7.25 0 0 0 6.21-3.505zM9.75 8.5a5.75 5.75 0 0 1 2.781-4.925l-.776-1.284A7.25 7.25 0 0 0 8.25 8.5zM12 2.75a.38.38 0 0 1-.268-.118a.3.3 0 0 1-.082-.155c-.004-.031-.002-.121.105-.186l.776 1.284c.503-.304.665-.861.606-1.299c-.062-.455-.42-1.026-1.137-1.026zm9.71 9.495c-.066.107-.156.109-.187.105a.3.3 0 0 1-.155-.082a.38.38 0 0 1-.118-.268h1.5c0-.717-.571-1.075-1.026-1.137c-.438-.059-.995.103-1.299.606z"
              />
            </Svg>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  options: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  optionText: {
    fontSize: 16,
    color: "#444",
    marginHorizontal: 10,
  },
});

export default NavBar;
