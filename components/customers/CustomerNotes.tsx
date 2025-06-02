import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { ChevronRight } from 'lucide-react-native';
import { NotesList } from '@/components/notes/NotesList';
import { useTheme } from '@/hooks/useTheme';

interface Note {
  id: string;
  content: string;
  createdAt: string;
}

interface CustomerNotesProps {
  notes: Note[];
  onNotePress: (noteId: string) => void;
  onViewAll: () => void;
}

export function CustomerNotes({ notes, onNotePress, onViewAll }: CustomerNotesProps) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Notes</Text>
        <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
          <Text style={[styles.viewAllText, { color: colors.primary }]}>View all</Text>
          <ChevronRight size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <NotesList
        notes={notes}
        onNotePress={onNotePress}
        showCustomer={false}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    marginRight: 4,
  },
});