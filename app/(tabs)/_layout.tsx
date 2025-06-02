import { Tabs } from 'expo-router';
import { StyleSheet, View, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Chrome as Home, Target, Users, ClipboardList } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const renderIcon = (route: string, color: string, size: number) => {
    const icons = {
      plan: Home,
      leads: Target,
      customers: Users,
      notes: ClipboardList,
    };

    const Icon = icons[route as keyof typeof icons];
    if (!Icon) return null;

    return <Icon size={size} color={color} />;
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarShowLabel: true,
          tabBarStyle: [
            styles.tabBar,
            { 
              backgroundColor: colors.cardBackground,
              borderTopColor: Platform.OS === 'ios' ? colors.border : 'transparent',
              height: 60 + insets.bottom,
              paddingBottom: insets.bottom,
            }
          ],
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tabs.Screen
          name="plan"
          options={{
            title: 'Plan',
            tabBarIcon: ({ color, size }) => renderIcon('plan', color, size),
          }}
        />
        <Tabs.Screen
          name="leads"
          options={{
            title: 'Leads',
            tabBarIcon: ({ color, size }) => renderIcon('leads', color, size),
          }}
        />
        <Tabs.Screen
          name="customers"
          options={{
            title: 'Customers',
            tabBarIcon: ({ color, size }) => renderIcon('customers', color, size),
          }}
        />
        <Tabs.Screen
          name="notes"
          options={{
            title: 'Notes',
            tabBarIcon: ({ color, size }) => renderIcon('notes', color, size),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderTopWidth: Platform.OS === 'ios' ? 0.5 : 0,
  },
  tabBarLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginTop: 4,
  },
});