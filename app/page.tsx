'use client';

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Plus, Clock, CheckCircle, Calendar } from 'lucide-react-native';
import { format, isSameDay } from 'date-fns';
import { AppProvider, useAppContext } from '@/context/AppContext';
import { useTheme } from '@/hooks/useTheme';
import { DailyPlanView } from '@/components/plan/DailyPlanView';
import { WeekSelector } from '@/components/plan/WeekSelector';
import { PriorityAlert } from '@/components/plan/PriorityAlert';
import { EmptyState } from '@/components/ui/EmptyState';
import { planStyles } from '@/styles/components/plan';

function PlanScreen() {
  const { colors } = useTheme();
  const { plans, priorities } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const selectedDayPlan = plans.find(plan => 
    isSameDay(new Date(plan.date), selectedDate)
  );

  const pendingTasks = selectedDayPlan?.tasks.filter(t => !t.completed).length || 0;
  const completedTasks = selectedDayPlan?.tasks.filter(t => t.completed).length || 0;
  const weekTasks = plans.reduce((acc, plan) => acc + plan.tasks.length, 0);
  
  const hasPriority = priorities.length > 0;

  // Web-compatible navigation handlers
  const handleCustomerPress = (customerId: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = `/customers/${customerId}`;
    }
  };

  const handleAddVisit = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/plan/add-visit';
    }
  };

  return (
    <View style={planStyles.screenContainer}>
      <View style={planStyles.header}>
        <View style={planStyles.profileSection}>
          <View style={planStyles.avatar}>
            <Text style={planStyles.avatarText}>MS</Text>
          </View>
          <View style={planStyles.userInfo}>
            <Text style={planStyles.userName}>Mark Smith</Text>
            <Text style={planStyles.userTitle}>Sales Rep at TwoZipz Inc.</Text>
          </View>
        </View>

        <View style={planStyles.statsContainer}>
          <View style={[planStyles.statCard, planStyles.pendingCard]}>
            <Text style={[planStyles.statValue, planStyles.statLabelOrange]}>{pendingTasks}</Text>
            <Text style={[planStyles.statLabel, planStyles.statLabelOrange]}>Pending</Text>
            <View style={[planStyles.statIconContainer, planStyles.pendingIconContainer]}>
              <Clock size={20} color="#FFFFFF" />
            </View>
          </View>
          <View style={[planStyles.statCard, planStyles.completedCard]}>
            <Text style={[planStyles.statValue, planStyles.statLabelGreen]}>{completedTasks}</Text>
            <Text style={[planStyles.statLabel, planStyles.statLabelGreen]}>Completed</Text>
            <View style={[planStyles.statIconContainer, planStyles.completedIconContainer]}>
              <CheckCircle size={20} color="#FFFFFF" />
            </View>
          </View>
          <View style={[planStyles.statCard, planStyles.weekCard]}>
            <Text style={[planStyles.statValue, planStyles.statLabelGray]}>{weekTasks}</Text>
            <Text style={[planStyles.statLabel, planStyles.statLabelGray]}>This Week</Text>
            <View style={[planStyles.statIconContainer, planStyles.weekIconContainer]}>
              <Calendar size={20} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {hasPriority && (
          <View style={{ marginTop: 20 }}>
            <PriorityAlert 
              priority={priorities[0]} 
              onPress={() => handleCustomerPress(priorities[0].customerId)}
            />
          </View>
        )}
      </View>
      
      <WeekSelector 
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      
      {selectedDayPlan ? (
        <DailyPlanView 
          plan={selectedDayPlan}
          onVisitPress={handleCustomerPress}
          onTaskPress={(id) => console.log('Task pressed', id)}
          onToggleComplete={(itemId, type) => {
            console.log('Toggle complete:', itemId, type);
          }}
        />
      ) : (
        <EmptyState
          icon="clipboard"
          title="No plans for this day"
          message="Tap the + button to add a visit or task to your schedule."
        />
      )}

      <TouchableOpacity 
        style={planStyles.fab}
        onPress={handleAddVisit}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

export default function HomePage() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <PlanScreen />
      </AppProvider>
    </SafeAreaProvider>
  );
} 