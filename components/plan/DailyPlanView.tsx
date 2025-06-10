import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MapPin, Clock, CheckCircle } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { format, parse } from 'date-fns';
import { Plan } from '@/types/plan';
import { useTheme } from '@/hooks/useTheme';
import { planStyles } from '@/styles/components/plan';
import { mockCustomers } from '@/data/mockCustomers';

interface DailyPlanViewProps {
  plan: Plan;
  onVisitPress: (id: string) => void;
  onTaskPress: (id: string) => void;
  onToggleComplete?: (itemId: string, type: 'visit' | 'task') => void;
}

export function DailyPlanView({ plan, onVisitPress, onTaskPress, onToggleComplete }: DailyPlanViewProps) {
  const { colors } = useTheme();

  // Helper function to get customer by ID
  const getCustomerById = (customerId: string) => {
    return mockCustomers.find(customer => customer.id === customerId);
  };

  const formatTime = (timeString: string) => {
    try {
      const date = parse(timeString, 'HH:mm', new Date());
      return format(date, 'h:mm a');
    } catch (error) {
      return timeString;
    }
  };

  // Helper function to check if item is at current time
  const isCurrentTime = (itemTime: string) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;
    
    const [itemHour, itemMinutes] = itemTime.split(':').map(Number);
    const itemTimeInMinutes = itemHour * 60 + itemMinutes;
    
    // Consider "current time" as within 30 minutes before or after
    const timeDiff = Math.abs(currentTimeInMinutes - itemTimeInMinutes);
    return timeDiff <= 30;
  };

  // Combine all visits and tasks, then sort by time
  const allItems = [...plan.visits, ...plan.tasks].sort((a, b) => {
    const timeA = a.time || '09:00';
    const timeB = b.time || '09:00';
    return timeA.localeCompare(timeB);
  });

  const getPriorityTag = (priority: string) => {
    switch (priority) {
      case 'high':
        return { bg: colors.errorLight, text: colors.error };
      case 'medium':
        return { bg: colors.warningLight, text: colors.warning };
      case 'low':
        return { bg: colors.successLight, text: colors.success };
      default:
        return { bg: colors.defaultTagBackground, text: colors.textTertiary };
    }
  };

  const handleToggleComplete = (itemId: string, type: 'visit' | 'task') => {
    if (onToggleComplete) {
      onToggleComplete(itemId, type);
    }
  };

  return (
    <View 
      style={planStyles.dailyPlanContainer}
    >
      {/* Dynamic Activity Count Header */}
      <View style={planStyles.dayHeaderContainer}>
        <Text style={planStyles.dayHeaderText}>
          Your Day ({plan.visits.length + plan.tasks.length} Activit{plan.visits.length + plan.tasks.length === 1 ? 'y' : 'ies'})
        </Text>
      </View>

      {allItems.map((item: any) => {
        const isCurrent = isCurrentTime(item.time || '09:00');
        
        return (
          <TouchableOpacity
            key={item.id}
            style={planStyles.itemContainer}
            onPress={() => 'customerName' in item ? onVisitPress(item.customerId) : onTaskPress(item.id)}
          >
            <Card style={{
              ...planStyles.itemCard,
              ...(isCurrent ? planStyles.itemCardCurrentTime : planStyles.itemCardDefault)
            }}>
              <View style={planStyles.itemHeader}>
                {/* First Column: Time + Status */}
                <View style={planStyles.timeColumn}>
                  <View style={planStyles.timeContainer}>
                    <Text style={[
                      planStyles.timeText,
                      item.completed && planStyles.completedText
                    ]}>
                      {formatTime(item.time)}
                    </Text>
                  </View>
                  {item.priority && (
                    <View style={[
                      planStyles.priorityTag,
                      { backgroundColor: getPriorityTag(item.priority).bg }
                    ]}>
                      <Text style={[
                        planStyles.priorityText,
                        { color: getPriorityTag(item.priority).text }
                      ]}>
                        {item.priority}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Second Column: Venue + Address */}
                <View style={planStyles.contentColumn}>
                  {'customerName' in item ? (
                    <>
                      <Text style={[
                        planStyles.itemTitle,
                        item.completed && planStyles.completedText,
                        item.completed && planStyles.strikethrough
                      ]}>
                        {item.customerName}
                      </Text>
                      {item.location && (
                        <View style={planStyles.locationContainer}>
                          <Text style={[
                            planStyles.locationText,
                            item.completed && planStyles.completedText
                          ]}>
                            {item.location}
                          </Text>
                        </View>
                      )}
                      {(() => {
                        const customer = getCustomerById(item.customerId);
                        const suggestedActions = customer?.suggestedActions || [];
                        
                        return suggestedActions.length > 0 && (
                          <View style={planStyles.suggestedActions}>
                            {suggestedActions.map((action: { title: string; description: string; icon: string }, index: number) => (
                              <View key={index} style={planStyles.actionItem}>
                                <View style={[
                                  planStyles.actionCheckbox,
                                  // For now, all actions are unchecked. In a real app, you'd track completion state
                                  false && planStyles.actionCheckboxChecked
                                ]}>
                                  {false && (
                                    <Text style={{ color: 'white', fontSize: 10, textAlign: 'center' }}>✓</Text>
                                  )}
                                </View>
                                <Text style={[
                                  planStyles.actionText,
                                  false && planStyles.actionTextCompleted
                                ]}>
                                  {action.title}
                                </Text>
                              </View>
                            ))}
                          </View>
                        );
                      })()}
                    </>
                  ) : (
                    <>
                      <Text style={[
                        planStyles.itemTitle,
                        item.completed && planStyles.completedText,
                        item.completed && planStyles.strikethrough
                      ]}>
                        {item.title}
                      </Text>
                      {item.description && (
                        <Text style={[
                          planStyles.description,
                          item.completed && planStyles.completedText
                        ]}>
                          {item.description}
                        </Text>
                      )}
                    </>
                  )}
                </View>

                {/* Third Column: Icon */}
                <View style={planStyles.iconColumn}>
                  <TouchableOpacity
                    onPress={() => handleToggleComplete(item.id, 'customerName' in item ? 'visit' : 'task')}
                    style={planStyles.completeButton}
                  >
                    <CheckCircle 
                      size={20} 
                      color={item.completed ? colors.success : colors.textSecondary}
                      fill={item.completed ? colors.success : 'transparent'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}