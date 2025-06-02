import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { formatDistanceToNow } from 'date-fns';

interface Note {
  id: string;
  content: string;
  date: string;
  customerName?: string;
}

interface NotesListProps {
  notes: Note[];
  onNotePress: (noteId: string) => void;
  showCustomer?: boolean;
}

export function NotesList({ notes, onNotePress, showCustomer = true }: NotesListProps) {
  const { colors } = useTheme();

  const formatTimestamp = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  if (notes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No notes yet
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {notes.map((note) => (
        <TouchableOpacity
          key={note.id}
          style={styles.noteCard}
          onPress={() => onNotePress(note.id)}
        >
          <Text style={styles.noteContent} numberOfLines={2}>
            {note.content}
          </Text>
          <View style={styles.noteFooter}>
            {showCustomer && note.customerName && (
              <Text style={[styles.customerName, { color: colors.textSecondary }]}>
                {note.customerName}
              </Text>
            )}
            <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
              {formatTimestamp(note.date)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  noteContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    marginBottom: 8,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});