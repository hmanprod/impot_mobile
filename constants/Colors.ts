/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#FF7A59'; // Orange accent
const tintColorDark = '#FF7A59'; // Same orange accent for dark mode

export const Colors = {
  light: {
    text: '#2C3E50', // Deep Blue
    background: '#F8F9FA', // Pearl Gray
    card: '#FFFFFF', // White for cards
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    cardGreen: '#E8F5E9', // Light green for cards
    cardYellow: '#FFF8E1', // Light yellow for cards
    cardOrange: '#FFF0ED', // Light orange for cards
    cardBlue: '#E3F2FD', // Light blue for cards
  },
  dark: {
    text: '#E0E0E0', // Off-White Text
    background: '#121212', // Deep Black Background
    card: '#1E1E1E', // Dark card background
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    cardGreen: '#1B3129', // Dark green for cards
    cardYellow: '#2D2A20', // Dark yellow for cards
    cardOrange: '#2D211E', // Dark orange for cards
    cardBlue: '#1A2733', // Dark blue for cards
  },
};
