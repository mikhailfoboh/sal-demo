import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { ActionItem } from '@/components/ui/ActionItem';
import { Segmented } from '@/components/ui/Segmented';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  activeFilters: {
    noteType: string[];
    dateRange: string;
    entity: string;
  };
  onApply: (filters: any) => void;
}

export function FilterSheet({ visible, onClose, activeFilters, onApply }: FilterSheetProps) {
  const { colors } = useTheme();
  const [localFilters, setLocalFilters] = React.useState(activeFilters);

  React.useEffect(() => {
    setLocalFilters(activeFilters);
  }, [activeFilters]);

  const handleNoteTypeToggle = (type: string) => {
    setLocalFilters(prev => ({
      ...prev,
      noteType: prev.noteType.includes(type)
        ? prev.noteType.filter(t => t !== type)
        : [...prev.noteType, type]
    }));
  };

  const handleReset = () => {
    setLocalFilters({
      noteType: [],
      dateRange: 'all',
      entity: 'all'
    });
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Filters</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Note Type</Text>
            <View style={styles.typeGrid}>
              {['Meeting', 'Call', 'Email', 'Task', 'Other'].map((type) => (
                <ActionItem
                  key={type}
                  label={type}
                  selected={localFilters.noteType.includes(type)}
                  onPress={() => handleNoteTypeToggle(type)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Date Range</Text>
            <Segmented
              value={localFilters.dateRange}
              onChange={(value) => setLocalFilters(prev => ({ ...prev, dateRange: value }))}
              options={[
                { label: 'All Time', value: 'all' },
                { label: 'Today', value: 'today' },
                { label: 'This Week', value: 'week' },
                { label: 'This Month', value: 'month' }
              ]}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Entity Type</Text>
            <Segmented
              value={localFilters.entity}
              onChange={(value) => setLocalFilters(prev => ({ ...prev, entity: value }))}
              options={[
                { label: 'All', value: 'all' },
                { label: 'Leads', value: 'lead' },
                { label: 'Customers', value: 'customer' }
              ]}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Button 
            variant="secondary" 
            onPress={handleReset}
            style={styles.resetButton}
          >
            Reset
          </Button>
          <Button 
            onPress={() => onApply(localFilters)}
            style={styles.applyButton}
          >
            Apply Filters
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '50%',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  resetButton: {
    flex: 1,
  },
  applyButton: {
    flex: 2,
  },
});