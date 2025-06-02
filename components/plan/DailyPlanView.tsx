import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MapPin, Clock, CheckCircle } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { format, parse } from 'date-fns';
import { Plan } from '@/types/plan';
import { useTheme } from '@/hooks/useTheme';
import { planStyles } from '@/styles/components/plan';

interface DailyPlanViewProps {
  plan: Plan;
  onVisitPress: (id: string) => void;
  onTaskPress: (id: string) => void;
  onToggleComplete?: (itemId: string, type: 'visit' | 'task') => void;
}

export function DailyPlanView({ plan, onVisitPress, onTaskPress, onToggleComplete }: DailyPlanViewProps) {
  const { colors } = useTheme();

  const formatTime = (timeString: string) => {
    try {
      const date = parse(timeString, 'HH:mm', new Date());
      return format(date, 'h:mm a');
    } catch (error) {
      return timeString;
    }
  };

  const getTimeBlock = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 12) return 'MORNING';
    if (hour < 17) return 'AFTERNOON';
    return 'EVENING';
  };

  // Group visits and tasks by time block
  const groupedItems = [...plan.visits, ...plan.tasks].reduce((acc, item) => {
    const timeBlock = getTimeBlock(item.time || '09:00');
    if (!acc[timeBlock]) acc[timeBlock] = [];
    acc[timeBlock].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  // Sort time blocks
  const timeBlocks = ['MORNING', 'AFTERNOON', 'EVENING'].filter(block => 
    groupedItems[block]?.length > 0
  );

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
    <ScrollView 
      style={planStyles.dailyPlanContainer}
      contentContainerStyle={planStyles.dailyPlanContent}
      showsVerticalScrollIndicator={false}
    >
      {timeBlocks.map(block => (
        <View key={block} style={planStyles.timeBlock}>
          <Text style={planStyles.blockTitle}>{block}</Text>
          
          {groupedItems[block].map((item: any) => (
            <TouchableOpacity
              key={item.id}
              style={planStyles.itemContainer}
              onPress={() => 'customerName' in item ? onVisitPress(item.customerId) : onTaskPress(item.id)}
            >
              <Card style={planStyles.itemCard}>
                <View style={planStyles.itemHeader}>
                  <View style={planStyles.timeContainer}>
                    <Clock size={14} color={colors.textSecondary} />
                    <Text style={[
                      planStyles.timeText,
                      item.completed && planStyles.completedText
                    ]}>
                      {formatTime(item.time)}
                    </Text>
                  </View>
                  
                  <View style={planStyles.rightContainer}>
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

                <View style={planStyles.itemContent}>
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
                          <MapPin size={14} color={item.completed ? colors.textTertiary : colors.textSecondary} />
                          <Text style={[
                            planStyles.locationText,
                            item.completed && planStyles.completedText
                          ]}>
                            {item.location}
                          </Text>
                        </View>
                      )}
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
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}