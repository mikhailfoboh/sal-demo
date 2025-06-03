import { Tabs } from 'expo-router';
import { StyleSheet, View, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { CalendarCheck, Target, UserCircle, Notepad, PlusCircle } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const renderIcon = (route: string, color: string, size: number, focused: boolean = false) => {
    const icons = {
      plan: CalendarCheck,
      leads: Target,
      action: PlusCircle,
      customers: UserCircle,
      notes: Notepad,
    };

    const Icon = icons[route as keyof typeof icons];
    if (!Icon) return null;

    // Special styling for the action tab to make it stand out
    if (route === 'action') {
      return (
        <View style={styles.actionTabIcon}>
          <Icon size={32} color="#087057" weight={focused ? "fill" : "regular"} />
        </View>
      );
    }

    return <Icon size={size} color={color} weight={focused ? "fill" : "regular"} />;
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
              borderTopColor: '#7AA496',
              borderTopWidth: 2,
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
            tabBarIcon: ({ color, size, focused }) => renderIcon('plan', color, size, focused),
          }}
        />
        <Tabs.Screen
          name="leads"
          options={{
            title: 'Leads',
            tabBarIcon: ({ color, size, focused }) => renderIcon('leads', color, size, focused),
          }}
        />
        <Tabs.Screen
          name="action"
          options={{
            title: 'Actions',
            tabBarIcon: ({ color, size, focused }) => renderIcon('action', color, size, focused),
            tabBarLabel: '',
          }}
        />
        <Tabs.Screen
          name="customers"
          options={{
            title: 'Customers',
            tabBarIcon: ({ color, size, focused }) => renderIcon('customers', color, size, focused),
          }}
        />
        <Tabs.Screen
          name="notes"
          options={{
            title: 'Notes',
            tabBarIcon: ({ color, size, focused }) => renderIcon('notes', color, size, focused),
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
  actionTabIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#C6E1D5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});