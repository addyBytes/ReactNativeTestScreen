import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from '@react-native-community/blur';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SystemNavigationBar from 'react-native-system-navigation-bar';

import FeedScreen from '../pages/FeedScreen';
import ProfileScreen from '../pages/ProfileScreen';
import SearchScreen from '../pages/SearchScreen';
import ChatScreen from '../pages/ChatScreen';
import { useTheme } from '../theme/ThemeContext';
import BottomGradient from './BottomGradient';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

function GlassTabBar({ state, navigation }: any) {
  const theme = useTheme();

  const sidePadding = 20;
  const aiSize = 60;
  const gap = 15;

  const pillWidth = width - sidePadding * 2 - aiSize - gap;
  const tabWidth = pillWidth / 4;

  const translateX = useRef(new Animated.Value(0)).current;

  /* ---------------------------------- */
  /* ANDROID SYSTEM NAVIGATION CONTROL */
  /* ---------------------------------- */

  useEffect(() => {
    if (Platform.OS === 'android') {
      if (theme.mode === 'dark') {
        SystemNavigationBar.setNavigationColor('transparent', 'light');
      } else {
        SystemNavigationBar.setNavigationColor('transparent', 'dark');
      }
      if (theme.mode === 'dark')
        SystemNavigationBar.setBarMode('light', 'navigation');
      else SystemNavigationBar.setBarMode('dark', 'navigation');
    }
  }, [theme.mode]);

  /* ---------------------------------- */

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * tabWidth,
      useNativeDriver: true,
    }).start();
  }, [state.index]);

  const getIcon = (routeName: string, isFocused: boolean) => {
    const inactiveColor = theme.mode === 'dark' ? '#ffffff' : '#000000';

    const color = isFocused ? theme.colors.accent : inactiveColor;

    switch (routeName) {
      case 'Home':
        return <Ionicons name="home" size={18} color={color} />;
      case 'Search':
        return <Ionicons name="search" size={18} color={color} />;
      case 'Chat':
        return <Ionicons name="chatbubble-outline" size={18} color={color} />;
      case 'Profile':
        return <Ionicons name="person-outline" size={18} color={color} />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.wrapper, { paddingHorizontal: sidePadding }]}>
      {/* TAB GLASS PILL */}
      <View
        style={[
          styles.container,
          {
            width: pillWidth,
            marginRight: gap,
          },
        ]}
      >
        {Platform.OS === 'ios'&& 'android' ? (
          <BlurView
            style={styles.blur}
            blurType={theme.mode === 'light' ? 'light' : 'dark'}
            blurAmount={20}
            reducedTransparencyFallbackColor={
              theme.mode === 'light'
                ? 'rgba(255,255,255,0.9)'
                : 'rgba(20,20,20,0.9)'
            }
          />
        ) : (
          <View
            style={[
              styles.androidGlass,
              {
                backgroundColor:
                  theme.mode === 'light'
                    ? 'rgba(255,255,255,0.85)'
                    : 'rgba(20,20,20,0.85)',
              },
            ]}
          />
        )}

        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderRadius: 40,
              borderWidth: 1.5,
              borderColor: '#35B9E9',
            },
          ]}
        />

        <Animated.View
          style={[
            styles.activeSlider,
            {
              width: tabWidth,
              transform: [{ translateX }],
            },
          ]}
        />

        <View style={styles.tabRow}>
          {state.routes.map((route: any, index: number) => {
            const isFocused = state.index === index;

            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => navigation.navigate(route.name)}
                style={styles.tabItem}
              >
                {getIcon(route.name, isFocused)}

                <Text
                  style={[
                    styles.label,
                    {
                      color: isFocused
                        ? theme.colors.accent
                        : theme.mode === 'dark'
                        ? '#ffffff'
                        : '#000000',
                    },
                  ]}
                >
                  {route.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* AI BUTTON */}
      <View style={styles.aiWrapper}>
        {Platform.OS === 'ios' && 'android'? (
          <BlurView
            style={styles.aiBlur}
            blurType={theme.mode === 'light' ? 'light' : 'dark'}
            blurAmount={20}
            reducedTransparencyFallbackColor={
              theme.mode === 'light'
                ? 'rgba(255,255,255,0.9)'
                : 'rgba(20,20,20,0.9)'
            }
          />
        ) : (
          <View
            style={[
              styles.aiAndroidGlass,
              {
                backgroundColor:
                  theme.mode === 'light'
                    ? 'rgba(255,255,255,0.85)'
                    : 'rgba(20,20,20,0.85)',
              },
            ]}
          />
        )}

        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderRadius: 30,
              borderWidth: 1.5,
              borderColor: '#35B9E9',
            },
          ]}
        />

        <TouchableOpacity style={styles.aiButtonContent}>
          <Ionicons name="sparkles" size={22} color={theme.colors.accent} />
          <Text style={[styles.aiLabel, { color: theme.colors.accent }]}>
            InfiAI
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function MainTabs() {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarBackground: () => null,
        }}
        tabBar={props => <GlassTabBar {...props} />}
      >
        <Tab.Screen name="Home" component={FeedScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
      <BottomGradient />
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
  },

  container: {
    height: 60,
    borderRadius: 40,
    overflow: 'hidden',
  },

  blur: {
    ...StyleSheet.absoluteFillObject,
  },

  androidGlass: {
    ...StyleSheet.absoluteFillObject,
  },

  activeSlider: {
    position: 'absolute',
    height: 50,
    top: 4,
    borderRadius: 30,
    backgroundColor: 'rgba(79,209,255,0.15)',
    left: 3,
  },

  tabRow: {
    flexDirection: 'row',
    height: '100%',
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    fontSize: 11,
    marginTop: 2,
  },

  aiWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },

  aiBlur: {
    ...StyleSheet.absoluteFillObject,
  },

  aiAndroidGlass: {
    ...StyleSheet.absoluteFillObject,
  },

  aiButtonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  aiLabel: {
    fontSize: 10,
    marginTop: 2,
  },
});
