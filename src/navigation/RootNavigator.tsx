import React from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useLanguage } from '../hooks';
import { RootStackParamList, AuthStackParamList, TabParamList } from '../types';
import { COLORS } from '../theme/colors';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import LearnScreen from '../screens/LearnScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ShopScreen from '../screens/ShopScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LessonScreen from '../screens/LessonScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function HomeTabs() {
  const { t } = useLanguage();

  const tabConfig: Record<keyof TabParamList, { active: string; inactive: string; label: string }> = {
    Home: { active: 'home', inactive: 'home-outline', label: t('tab.home') },
    Learn: { active: 'book', inactive: 'book-outline', label: t('tab.learn') },
    Leaderboard: { active: 'trophy', inactive: 'trophy-outline', label: t('tab.leaderboard') },
    Shop: { active: 'cart', inactive: 'cart-outline', label: t('tab.shop') },
    Profile: { active: 'person', inactive: 'person-outline', label: t('tab.profile') },
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          const cfg = tabConfig[route.name];
          return (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <Ionicons name={(focused ? cfg.active : cfg.inactive) as any} size={24} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.hare,
        tabBarLabel: tabConfig[route.name].label,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.swan,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' as const, marginTop: 2 },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

function MainNavigator() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Main" component={HomeTabs} />
      <MainStack.Screen name="Lesson" component={LessonScreen} options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
    </MainStack.Navigator>
  );
}

const RootNavigator: React.FC = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return profile ? <MainNavigator /> : <AuthNavigator />;
};

export default RootNavigator;

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white },
  iconWrap: { alignItems: 'center', justifyContent: 'center', width: 40, height: 28, borderRadius: 14 },
  iconWrapActive: { backgroundColor: COLORS.primaryBg },
});
