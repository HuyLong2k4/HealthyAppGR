import "expo-router/entry";
import { LogBox } from 'react-native';

// Suppress Reanimated warning (false positive)
LogBox.ignoreLogs([
  'It looks like you might be using shared value',
]);
