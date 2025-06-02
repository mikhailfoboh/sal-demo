import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = index <= currentStep;
        const isLast = index === steps.length - 1;
        
        return (
          <React.Fragment key={step}>
            <View style={styles.stepContainer}>
              {/* Step Circle */}
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor: isCompleted ? colors.primary : '#E5E7EB',
                  },
                ]}
              >
                {isCompleted && (
                  <View
                    style={[
                      styles.innerCircle,
                      { backgroundColor: colors.white },
                    ]}
                  />
                )}
              </View>
              
              {/* Step Label */}
              <Text
                style={[
                  styles.stepLabel,
                  {
                    color: isCompleted ? colors.primary : '#9CA3AF',
                    fontFamily: isCompleted ? 'Poppins-Medium' : 'Poppins-Regular',
                  },
                ]}
              >
                {step}
              </Text>
            </View>
            
            {/* Connector Line */}
            {!isLast && (
              <View
                style={[
                  styles.line,
                  {
                    backgroundColor: isCompleted ? colors.primary : '#E5E7EB',
                  },
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  stepContainer: {
    alignItems: 'center',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  line: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
  },
  stepLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});