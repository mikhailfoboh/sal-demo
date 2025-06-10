import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Check, Plus, X, Edit3, Calendar, Send, FileText, Phone, Package, PlusCircle } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { PostVisitChecklistItem, PostVisitNote, PostVisitAction } from '@/hooks/useLeads';

// Reference: PRD/POST_VISIT_PRD.md - Recommended Default Items
const RECOMMENDED_CHECKLIST_ITEMS = [
  { text: 'Pitched product', defaultChecked: true },
  { text: 'Sample requested', defaultChecked: false },
  { text: 'Owner unavailable', defaultChecked: false },
  { text: 'Not interested', defaultChecked: false },
  { text: 'Scheduled follow-up', defaultChecked: false },
  { text: 'Pricing discussed', defaultChecked: false },
  { text: 'Competitor analysis completed', defaultChecked: false },
  { text: 'Menu review conducted', defaultChecked: false },
];

const RECOMMENDED_NEXT_ACTIONS = [
  { title: 'Send updated pitch with price breakdown', icon: FileText },
  { title: 'Send product samples', icon: Package },
  { title: 'Follow-up email', icon: Send },
  { title: 'Call to check if owner reviewed pitch', icon: Phone },
  { title: 'Schedule next visit (e.g. next Tuesday at 2PM)', icon: Calendar },
  { title: 'Prepare pricing comparison document', icon: FileText },
];

const SAMPLE_DISCUSSION_NOTES = [
  'Owner interested in premium mozzarella for May menu',
  'Venue switching suppliers; wants pricing comparison next week',
  'Spoke with floor manager; suggested follow-up with owner on Thursday',
];

interface PostVisitTabProps {
  leadId: string;
  checklistItems: PostVisitChecklistItem[];
  notes: PostVisitNote[];
  actions: PostVisitAction[];
  onUpdateData: (data: {
    checklist?: PostVisitChecklistItem[];
    notes?: PostVisitNote[];
    actions?: PostVisitAction[];
  }) => void;
}

export function PostVisitTab({
  leadId,
  checklistItems: initialChecklistItems,
  notes: initialNotes,
  actions: initialActions,
  onUpdateData,
}: PostVisitTabProps) {
  const { colors } = useTheme();
  
  // Local state for immediate UI updates
  const [checklistItems, setChecklistItems] = useState<PostVisitChecklistItem[]>(initialChecklistItems);
  const [notes, setNotes] = useState<PostVisitNote[]>(initialNotes);
  const [actions, setActions] = useState<PostVisitAction[]>(initialActions);
  
  // UI state
  const [showCustomChecklistInput, setShowCustomChecklistInput] = useState(false);
  const [showCustomNoteInput, setShowCustomNoteInput] = useState(false);
  const [showCustomActionInput, setShowCustomActionInput] = useState(false);
  const [customChecklistText, setCustomChecklistText] = useState('');
  const [customNoteText, setCustomNoteText] = useState('');
  const [customActionText, setCustomActionText] = useState('');

  // Initialize recommended items if none exist
  useEffect(() => {
    if (checklistItems.length === 0) {
      const recommendedItems: PostVisitChecklistItem[] = RECOMMENDED_CHECKLIST_ITEMS.map((item, index) => ({
        id: `recommended-${index}`,
        text: item.text,
        checked: item.defaultChecked,
        is_custom: false,
        created_at: new Date().toISOString(),
      }));
      setChecklistItems(recommendedItems);
      onUpdateData({ checklist: recommendedItems });
    }
  }, []);

  // Handle checklist item toggle
  const handleChecklistToggle = (itemId: string) => {
    const updatedItems = checklistItems.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    setChecklistItems(updatedItems);
    
    // Save to database
    console.log('💾 Saving checklist update to database');
    onUpdateData({ checklist: updatedItems });
  };

  // Add custom checklist item
  const handleAddCustomChecklistItem = () => {
    if (customChecklistText.trim()) {
      const newItem: PostVisitChecklistItem = {
        id: `custom-${Date.now()}`,
        text: customChecklistText.trim(),
        checked: false,
        is_custom: true,
        created_at: new Date().toISOString(),
      };
      const updatedItems = [...checklistItems, newItem];
      setChecklistItems(updatedItems);
      
      // Save to database
      console.log('💾 Saving new checklist item to database');
      onUpdateData({ checklist: updatedItems });
      
      setCustomChecklistText('');
      setShowCustomChecklistInput(false);
    }
  };

  // Delete custom checklist item
  const handleDeleteChecklistItem = (itemId: string) => {
    const updatedItems = checklistItems.filter(item => item.id !== itemId);
    setChecklistItems(updatedItems);
    
    // Save to database
    console.log('💾 Saving checklist deletion to database');
    onUpdateData({ checklist: updatedItems });
  };

  // Add note (custom or sample)
  const handleAddNote = (content: string) => {
    const newNote: PostVisitNote = {
      id: `note-${Date.now()}`,
      content: content.trim(),
      created_at: new Date().toISOString(),
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    
    // Save to database
    console.log('💾 Saving new note to database');
    onUpdateData({ notes: updatedNotes });
    
    setCustomNoteText('');
    setShowCustomNoteInput(false);
  };

  // Delete note
  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    
    // Save to database
    console.log('💾 Saving note deletion to database');
    onUpdateData({ notes: updatedNotes });
  };

  // Add action (recommended or custom)
  const handleAddAction = (title: string, isCustom: boolean = false) => {
    const newAction: PostVisitAction = {
      id: `action-${Date.now()}`,
      title: title.trim(),
      completed: false,
      is_custom: isCustom,
      created_at: new Date().toISOString(),
    };
    const updatedActions = [...actions, newAction];
    setActions(updatedActions);
    
    // Save to database
    console.log('💾 Saving new action to database');
    onUpdateData({ actions: updatedActions });
    
    setCustomActionText('');
    setShowCustomActionInput(false);
  };

  // Toggle action completion
  const handleToggleAction = (actionId: string) => {
    const updatedActions = actions.map(action =>
      action.id === actionId 
        ? { 
            ...action, 
            completed: !action.completed,
            completed_at: !action.completed ? new Date().toISOString() : undefined
          }
        : action
    );
    setActions(updatedActions);
    
    // Save to database
    console.log('💾 Saving action completion to database');
    onUpdateData({ actions: updatedActions });
  };

  // Delete custom action
  const handleDeleteAction = (actionId: string) => {
    const updatedActions = actions.filter(action => action.id !== actionId);
    setActions(updatedActions);
    
    // Save to database
    console.log('💾 Saving action deletion to database');
    onUpdateData({ actions: updatedActions });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Reference: PRD/POST_VISIT_PRD.md - Epic 2: Post Visit Checklist Management */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Post Visit Checklist</Text>
        <Text style={styles.sectionSubtitle}>What happened during the visit?</Text>
        
        {checklistItems.map((item) => (
          <View key={item.id} style={styles.checklistItem}>
            <TouchableOpacity
              style={[styles.checkbox, item.checked && { backgroundColor: colors.success }]}
              onPress={() => handleChecklistToggle(item.id)}
            >
              {item.checked && <Check size={16} color="#FFFFFF" />}
            </TouchableOpacity>
            <Text style={[styles.checklistText, item.checked && styles.checkedText]}>
              {item.text}
            </Text>
            {item.is_custom && (
              <TouchableOpacity
                onPress={() => handleDeleteChecklistItem(item.id)}
                style={styles.deleteButton}
              >
                <X size={16} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>
        ))}

        {showCustomChecklistInput ? (
          <View style={styles.customInput}>
            <TextInput
              style={styles.input}
              placeholder="Enter custom checklist item..."
              value={customChecklistText}
              onChangeText={setCustomChecklistText}
              multiline
              autoFocus
            />
            <View style={styles.inputActions}>
              <View style={styles.inputButton}>
                <Button
                  title="Add"
                  variant="primary"
                  onPress={handleAddCustomChecklistItem}
                />
              </View>
              <View style={styles.buttonSpacer} />
              <View style={styles.inputButton}>
                <Button
                  title="Cancel"
                  variant="secondary"
                  onPress={() => {
                    setShowCustomChecklistInput(false);
                    setCustomChecklistText('');
                  }}
                />
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowCustomChecklistInput(true)}
          >
            <Plus size={16} color={colors.primary} />
            <Text style={[styles.addButtonText, { color: colors.primary }]}>Add Checklist</Text>
          </TouchableOpacity>
        )}
      </Card>

      {/* Reference: PRD/POST_VISIT_PRD.md - Epic 3: Post Visit Notes Capture */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <Text style={styles.sectionSubtitle}>What was discussed?</Text>

        {/* Sample notes for guidance */}
        {notes.length === 0 && (
          <View style={styles.sampleNotes}>
            <Text style={styles.suggestedTitle}>Suggested Discussion Notes</Text>
            <Text style={styles.suggestedSubtitle}>Tap to add any that apply to your visit:</Text>
            {SAMPLE_DISCUSSION_NOTES.map((note, index) => (
              <TouchableOpacity
                key={index}
                style={styles.sampleNote}
                onPress={() => handleAddNote(note)}
              >
                <Text style={styles.sampleNoteText}>• {note}</Text>
                <Plus size={14} color={colors.primary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Existing notes */}
        {notes.map((note) => (
          <View key={note.id} style={styles.noteItem}>
            <Text style={styles.noteText}>• {note.content}</Text>
            <View style={styles.noteActions}>
              <Text style={styles.noteTimestamp}>
                {new Date(note.created_at).toLocaleString()}
              </Text>
              <TouchableOpacity
                onPress={() => handleDeleteNote(note.id)}
                style={styles.deleteButton}
              >
                <X size={14} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {showCustomNoteInput ? (
          <View style={styles.customInput}>
            <TextInput
              style={[styles.input, styles.noteInput]}
              placeholder="What was discussed during your visit..."
              value={customNoteText}
              onChangeText={setCustomNoteText}
              multiline
              autoFocus
              maxLength={1000}
            />
            <Text style={styles.characterCount}>{customNoteText.length}/1000</Text>
            <View style={styles.inputActions}>
              <View style={styles.inputButton}>
                <Button
                  title="Add Note"
                  variant="primary"
                  onPress={() => handleAddNote(customNoteText)}
                  disabled={!customNoteText.trim()}
                />
              </View>
              <View style={styles.buttonSpacer} />
              <View style={styles.inputButton}>
                <Button
                  title="Cancel"
                  variant="secondary"
                  onPress={() => {
                    setShowCustomNoteInput(false);
                    setCustomNoteText('');
                  }}
                />
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowCustomNoteInput(true)}
          >
            <Plus size={16} color={colors.primary} />
            <Text style={[styles.addButtonText, { color: colors.primary }]}>Add Notes</Text>
          </TouchableOpacity>
        )}
      </Card>

      {/* Reference: PRD/POST_VISIT_PRD.md - Epic 4: Next Actions Planning */}
      <Card style={{...styles.section, ...styles.lastSection}}>
        <Text style={styles.sectionTitle}>Next Actions</Text>
        <Text style={styles.sectionSubtitle}>What do you need to do next?</Text>

        {/* Recommended actions */}
        <View style={styles.recommendedActions}>
          <Text style={styles.suggestedTitle}>Recommended Next Actions</Text>
          <Text style={styles.suggestedSubtitle}>Tap to add any that apply:</Text>
          {RECOMMENDED_NEXT_ACTIONS.map((action, index) => {
            // Check if this action is already added
            const isAlreadyAdded = actions.some(existingAction => 
              existingAction.title === action.title
            );
            
            if (isAlreadyAdded) return null;
            
            return (
              <TouchableOpacity
                key={index}
                style={styles.recommendedAction}
                onPress={() => handleAddAction(action.title)}
              >
                <View style={styles.actionIcon}>
                  <action.icon size={16} color={colors.primary} />
                </View>
                <Text style={styles.recommendedActionText}>{action.title}</Text>
                <Plus size={14} color={colors.primary} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Existing actions */}
        {actions.map((action) => (
          <View key={action.id} style={styles.actionItem}>
            <TouchableOpacity
              style={[styles.checkbox, action.completed && { backgroundColor: colors.success }]}
              onPress={() => handleToggleAction(action.id)}
            >
              {action.completed && <Check size={16} color="#FFFFFF" />}
            </TouchableOpacity>
            <View style={styles.actionContent}>
              <Text style={[styles.actionText, action.completed && styles.completedAction]}>
                {action.title}
              </Text>
              {action.completed_at && (
                <Text style={styles.actionTimestamp}>
                  Completed: {new Date(action.completed_at).toLocaleDateString()}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => handleDeleteAction(action.id)}
              style={styles.deleteButton}
            >
              <X size={16} color={colors.error} />
            </TouchableOpacity>
          </View>
        ))}

        {showCustomActionInput ? (
          <View style={styles.customInput}>
            <TextInput
              style={styles.input}
              placeholder="Enter custom action..."
              value={customActionText}
              onChangeText={setCustomActionText}
              multiline
              autoFocus
            />
            <View style={styles.inputActions}>
              <View style={styles.inputButton}>
                <Button
                  title="Add Todo"
                  variant="primary"
                  onPress={() => handleAddAction(customActionText, true)}
                  disabled={!customActionText.trim()}
                />
              </View>
              <View style={styles.buttonSpacer} />
              <View style={styles.inputButton}>
                <Button
                  title="Cancel"
                  variant="secondary"
                  onPress={() => {
                    setShowCustomActionInput(false);
                    setCustomActionText('');
                  }}
                />
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowCustomActionInput(true)}
          >
            <Plus size={16} color={colors.primary} />
            <Text style={[styles.addButtonText, { color: colors.primary }]}>Add Todo</Text>
          </TouchableOpacity>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  lastSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checklistText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  deleteButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  customInput: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#FFFFFF',
    minHeight: 44,
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 12,
  },
  inputActions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  inputButton: {
    flex: 1,
  },
  buttonSpacer: {
    width: 8,
  },
  sampleNotes: {
    marginBottom: 16,
  },
  sampleNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 6,
    marginBottom: 8,
  },
  sampleNoteText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0C4A6E',
  },
  noteItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  noteText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    lineHeight: 20,
    marginBottom: 4,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteTimestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  recommendedActions: {
    marginBottom: 16,
  },
  recommendedAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    marginBottom: 8,
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recommendedActionText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionContent: {
    flex: 1,
    marginLeft: 12,
  },
  actionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  completedAction: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  actionTimestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  suggestedTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  suggestedSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
}); 