import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { loadProfile } from './src/utils/storage';
import { colors } from './src/theme';

import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import LogScreen from './src/screens/LogScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile().then((p) => { setProfile(p); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg0 }}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (!profile) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <OnboardingScreen onComplete={(p) => setProfile(p)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={{ colors: { background: colors.bg0 } }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: colors.bg1,
              borderTopColor: colors.border,
              borderTopWidth: 0.5,
              paddingBottom: 8,
              paddingTop: 8,
              height: 64,
            },
            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: colors.textTertiary,
            tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 2 },
            tabBarIcon: ({ focused, color, size }) => {
              const icons = {
                Home: focused ? 'home' : 'home-outline',
                Log: focused ? 'barbell' : 'barbell-outline',
                Progress: focused ? 'bar-chart' : 'bar-chart-outline',
                Profile: focused ? 'person' : 'person-outline',
              };
              return <Ionicons name={icons[route.name]} size={22} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Home">
            {(props) => <HomeScreen {...props} profile={profile} />}
          </Tab.Screen>
          <Tab.Screen name="Log">
            {(props) => <LogScreen {...props} profile={profile} />}
          </Tab.Screen>
          <Tab.Screen name="Progress">
            {() => <ProgressScreen />}
          </Tab.Screen>
          <Tab.Screen name="Profile">
            {() => <ProfileScreen profile={profile} onUpdate={(p) => setProfile(p)} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
