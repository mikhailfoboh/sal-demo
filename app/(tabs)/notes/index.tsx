import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Mic, Building2, Clock, Plus } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { useNotes } from '@/hooks/useNotes';
import { formatDistanceToNow, format } from 'date-fns';

export default function NotesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ leadId?: string; customerId?: string }>();
  const { notes, isLoading } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
    
    if (isToday) {
      return format(date, "'Today at' h:mm a");
    } else if (isYesterday) {
      return format(date, "'Yesterday at' h:mm a");
    } else if (date.getFullYear() === now.getFullYear()) {
      return format(date, 'MMM d, h:mm a');
    } else {
      return format(date, 'MMM d, yyyy, h:mm a');
    }
  };

  const filteredNotes = notes.filter(note => {
    if (params.leadId && note.leadId !== params.leadId) return false;
    if (params.customerId && note.customerId !== params.customerId) return false;
    return note.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Notes</Text>
      </View>

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={18} color={colors.textSecondary} />}
          containerStyle={styles.searchInput}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredNotes.length > 0 ? (
          <View style={styles.notesList}>
            {filteredNotes.map((note) => (
              <TouchableOpacity
                key={note.id}
                style={styles.noteCard}
                onPress={() => router.push(`/notes/${note.id}`)}
              >
                <View style={styles.noteHeader}>
                  {note.type === 'Call' && (
                    <View style={styles.noteTypeIcon}>
                      <Mic size={16} color={colors.textSecondary} />
                    </View>
                  )}
                  <Text style={styles.noteTitle}>{note.type}</Text>
                </View>

                <Text style={styles.noteContent} numberOfLines={2}>
                  {note.content}
                </Text>

                <View style={styles.noteFooter}>
                  {(note.customerName || note.leadName) && (
                    <View style={styles.entityContainer}>
                      <Building2 size={14} color={colors.textSecondary} />
                      <Text style={styles.entityText}>
                        {note.customerName || note.leadName}
                      </Text>
                    </View>
                  )}
                  <View style={styles.timeContainer}>
                    <Clock size={14} color={colors.textSecondary} />
                    <Text style={styles.timeText}>{formatDate(note.date)}</Text>
                  </View>
                </View>

                {note.tags && note.tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {note.tags.map((tag) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <EmptyState
            icon="clipboard"
            title="No notes found"
            message={
              searchQuery
                ? "We couldn't find any notes matching your search."
                : "Tap the + button to create your first note."
            }
          />
        )}
      </ScrollView>

      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/notes/voice')}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
    color: '#111827',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 0,
  },
  content: {
    flex: 1,
  },
  notesList: {
    padding: 16,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTypeIcon: {
    marginRight: 8,
  },
  noteTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#111827',
  },
  noteContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 20,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entityText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  tagText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#4B5563',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
}); 