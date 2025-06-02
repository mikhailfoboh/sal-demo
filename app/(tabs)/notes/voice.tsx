import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, Plus } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppContext } from '@/context/AppContext';

export default function VoiceNoteScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { notes, setNotes } = useAppContext();
  const params = useLocalSearchParams<{ leadId?: string; customerId?: string }>();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcribedText, setTranscribedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleStartRecording = async () => {
    try {
      setError(null);
      setIsRecording(true);
      setRecordingTime(0);
      setTranscribedText('');

      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        // Web Speech API implementation
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
          setError('Speech recognition not supported in this browser');
          setIsRecording(false);
          return;
        }
        
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');
          
          setTranscribedText(transcript);
        };
        
        recognition.onerror = (event: any) => {
          setError('Failed to record speech: ' + event.error);
          setIsRecording(false);
        };
        
        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
        
        // Store recognition instance for cleanup
        (window as any).currentRecognition = recognition;
      } else {
        // Native platforms - for now, just simulate recording and let user type
        setError('Speech recognition not yet supported on mobile. Please type your note manually.');
        setIsRecording(false);
        setTranscribedText('Type your note here...');
      }
    } catch (err) {
      setError('Failed to start recording');
      setIsRecording(false);
      console.error('Recording error:', err);
    }
  };
  
  const handleStopRecording = async () => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        // Stop Web Speech API recognition
        const recognition = (window as any).currentRecognition;
        if (recognition) {
          recognition.stop();
          delete (window as any).currentRecognition;
        }
      }
      setIsRecording(false);
    } catch (err) {
      setError('Failed to stop recording');
      console.error('Stop recording error:', err);
    }
  };
  
  const handleSaveNote = () => {
    if (!transcribedText.trim()) {
      setError('Cannot save empty note');
      return;
    }
    
    // Create new note object
    const newNote = {
      id: `note${Date.now()}`,
      content: transcribedText,
      date: new Date().toISOString(),
      type: 'Voice',
      ...(params.leadId && {
        leadId: params.leadId,
        leadName: notes.find(n => n.leadId === params.leadId)?.leadName
      }),
      ...(params.customerId && {
        customerId: params.customerId,
        customerName: notes.find(n => n.customerId === params.customerId)?.customerName
      }),
      tags: ['voice-note']
    };

    // Add new note to context
    setNotes([newNote, ...notes]);
    
    // Navigate back to notes list
    router.push('/(tabs)/notes');
  };
  
  const handleCancel = async () => {
    if (isRecording) {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        // Stop Web Speech API recognition
        const recognition = (window as any).currentRecognition;
        if (recognition) {
          recognition.stop();
          delete (window as any).currentRecognition;
        }
      }
      setIsRecording(false);
      setTranscribedText('');
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice Note</Text>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {transcribedText ? (
          <View style={styles.transcriptionContainer}>
            <Text style={styles.transcriptionTitle}>Transcription</Text>
            <Card style={styles.transcriptionCard}>
              <ScrollView style={styles.transcriptionScroll}>
                <Text style={styles.transcriptionText}>{transcribedText}</Text>
              </ScrollView>
            </Card>
            
            <View style={styles.buttonContainer}>
              <Button
                title="Save Note"
                variant="primary"
                onPress={handleSaveNote}
                style={styles.saveButton}
              />
              <Button
                title="Record Again"
                variant="secondary"
                onPress={handleStartRecording}
                style={styles.recordAgainButton}
              />
            </View>
          </View>
        ) : (
          <View style={styles.recordingContainer}>
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>
                {isRecording
                  ? "Recording... Tap the microphone when you're done."
                  : "Tap the microphone to start recording your note."}
              </Text>
            </View>
            
            <View style={styles.micContainer}>
              <TouchableOpacity
                style={[
                  styles.micButton,
                  isRecording && styles.micButtonRecording
                ]}
                onPress={isRecording ? handleStopRecording : handleStartRecording}
              >
                <Mic size={32} color="white" />
              </TouchableOpacity>
              
              {isRecording && (
                <View style={styles.timer}>
                  <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#111827',
  },
  cancelText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#4F46E5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#DC2626',
  },
  recordingContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  instructionContainer: {
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    maxWidth: '80%',
  },
  instructionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
  },
  micContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  micButtonRecording: {
    backgroundColor: '#DC2626',
  },
  timer: {
    marginTop: 16,
  },
  timerText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#111827',
  },
  transcriptionContainer: {
    flex: 1,
  },
  transcriptionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 16,
  },
  transcriptionCard: {
    flex: 1,
    marginBottom: 24,
  },
  transcriptionScroll: {
    flex: 1,
  },
  transcriptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 12,
  },
  saveButton: {
    marginBottom: 8,
  },
  recordAgainButton: {},
});