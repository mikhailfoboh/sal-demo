import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { MapPin, Building2, Trash2, CreditCard as Edit2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useNoteById } from '@/hooks/useNotes';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAppContext } from '@/context/AppContext';
import { useState } from 'react';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { note, isLoading } = useNoteById(id);
  const { notes, setNotes } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note?.content || '');

  if (isLoading || !note) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Note Details" showBackButton />
        <EmptyState
          icon="alert"
          title="Loading..."
          message="Please wait while we fetch the note details."
        />
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy h:mm a');
    } catch {
      return dateString;
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedNotes = notes.filter(n => n.id !== id);
            setNotes(updatedNotes);
            router.back();
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    if (isEditing) {
      // Save changes
      const updatedNotes = notes.map(n => 
        n.id === id ? { ...n, content: editedContent } : n
      );
      setNotes(updatedNotes);
      setIsEditing(false);
    } else {
      // Enter edit mode
      setEditedContent(note.content);
      setIsEditing(true);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="Note Details" 
        showBackButton
        RightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity 
              onPress={handleEdit}
              style={styles.headerButton}
            >
              <Edit2 size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleDelete}
              style={styles.headerButton}
            >
              <Trash2 size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        }
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Card style={styles.noteCard}>
            <View style={styles.metadata}>
              <View style={styles.typeContainer}>
                <Text style={styles.type}>{note.type}</Text>
                <Text style={styles.date}>{formatDate(note.date)}</Text>
              </View>

              {(note.customerName || note.leadName) && (
                <View style={styles.entityContainer}>
                  <Building2 size={16} color={colors.textSecondary} />
                  <Text style={styles.entityName}>
                    {note.customerName || note.leadName}
                  </Text>
                </View>
              )}

              {note.location && (
                <View style={styles.locationContainer}>
                  <MapPin size={16} color={colors.textSecondary} />
                  <Text style={styles.location}>{note.location}</Text>
                </View>
              )}
            </View>

            {isEditing ? (
              <Input
                value={editedContent}
                onChangeText={setEditedContent}
                multiline
                numberOfLines={8}
                style={styles.editInput}
              />
            ) : (
              <Text style={styles.noteContent}>{note.content}</Text>
            )}

            {note.tags && note.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {note.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {isEditing && (
              <View style={styles.editActions}>
                <Button
                  title="Cancel"
                  variant="secondary"
                  onPress={() => setIsEditing(false)}
                  style={styles.editButton}
                />
                <Button
                  title="Save Changes"
                  variant="primary"
                  onPress={handleEdit}
                  style={styles.editButton}
                />
              </View>
            )}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  noteCard: {
    marginBottom: 16,
  },
  metadata: {
    marginBottom: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  type: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#111827',
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  entityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  entityName: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#374151',
    marginLeft: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  noteContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  editInput: {
    marginBottom: 16,
    height: 200,
    textAlignVertical: 'top',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#4B5563',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  editButton: {
    flex: 1,
  },
});