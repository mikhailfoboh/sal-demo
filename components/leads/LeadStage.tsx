import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { ProgressSteps } from '@/components/leads/ProgressSteps';

interface LeadStageProps {
  stage: string;
  onMoveStage: () => void;
}

export function LeadStage({ stage, onMoveStage }: LeadStageProps) {
  const stages = ['New', 'Contacted', 'Sampling', 'Won'];
  const currentStageIndex = stages.indexOf(stage);
  const isLastStage = currentStageIndex === stages.length - 1;

  const getNextStage = () => {
    return stages[currentStageIndex + 1];
  };

  return (
    <View style={styles.container}>
      <ProgressSteps
        steps={stages}
        currentStep={currentStageIndex}
      />
      {!isLastStage && (
        <Button
          title={`Move to ${getNextStage()}`}
          onPress={onMoveStage}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  button: {
    marginTop: 8,
  },
});