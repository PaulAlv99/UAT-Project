import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemeProvider } from "../ThemeContext";

const hiddenTab = { tabBarStyle: { display: 'none' }, href: null };

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          tabBarButton: HapticTab,
          tabBarStyle: Platform.select({
            ios: { position: 'absolute' },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            ...hiddenTab,
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen name="login" options={hiddenTab} />
        <Tabs.Screen name="register" options={hiddenTab} />
        <Tabs.Screen name="recover_password" options={hiddenTab} />
        <Tabs.Screen name="LandingScreen" options={hiddenTab} />
        <Tabs.Screen name="MyRecipesScreen" options={hiddenTab} />
        <Tabs.Screen name="BuyRecipesScreen" options={hiddenTab} />
        <Tabs.Screen name="SellRecipeScreen" options={hiddenTab} />
        <Tabs.Screen name="HistoryScreen" options={hiddenTab} />
        <Tabs.Screen name="GroceryMap" options={hiddenTab} />
        <Tabs.Screen name="reset-password" options={hiddenTab} />
        <Tabs.Screen name="UpdateProfileScreen" options={hiddenTab} />
        <Tabs.Screen name="ForgotPasswordScreen" options={hiddenTab} />
        <Tabs.Screen name="ChatScreen" options={hiddenTab} />
      </Tabs>
    </ThemeProvider>
  );
}
