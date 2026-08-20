import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Text, TextInput, useColorScheme } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import '@/global.css';

SplashScreen.preventAutoHideAsync();

type FontScalableComponent = {
  defaultProps?: { allowFontScaling?: boolean };
};

const globalText = Text as typeof Text & FontScalableComponent;
const globalTextInput = TextInput as typeof TextInput & FontScalableComponent;

globalText.defaultProps = { ...globalText.defaultProps, allowFontScaling: false };
globalTextInput.defaultProps = { ...globalTextInput.defaultProps, allowFontScaling: false };

export default function TabLayout() {
  const colorScheme = useColorScheme();
  useFonts({
    PoppinsThin: require('@/assets/fonts/Poppins/Poppins-Thin.ttf'),
    PoppinsLight: require('@/assets/fonts/Poppins/Poppins-Light.ttf'),
    PoppinsRegular: require('@/assets/fonts/Poppins/Poppins-Regular.ttf'),
    PoppinsMedium: require('@/assets/fonts/Poppins/Poppins-Medium.ttf'),
    PoppinsSemiBold: require('@/assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    PoppinsBold: require('@/assets/fonts/Poppins/Poppins-Bold.ttf'),
  });

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AnimatedSplashOverlay />
            <AppTabs />
          </ThemeProvider>
        </SafeAreaView>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
