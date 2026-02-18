import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainTabs from './src/components/MainTabs';
import { ThemeProvider } from './src/theme/ThemeContext';

export default function App(): React.JSX.Element {
  // Force light theme across the app
  return (
    <ThemeProvider initial="light">
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar barStyle={'dark-content'} backgroundColor={'#ffffff'} />
          <MainTabs />
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
