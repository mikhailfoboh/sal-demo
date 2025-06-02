import { Redirect } from 'expo-router';

// Redirect to notes in case this route is somehow accessed
export default function AddScreen() {
  return <Redirect href="/(tabs)/notes" />;
}