import { useAppContext } from '@/context/AppContext';

export function useNotes() {
  const { notes } = useAppContext();
  
  return {
    notes,
    isLoading: false
  };
}

export function useNoteById(id: string | undefined) {
  const { notes } = useAppContext();
  
  const note = notes.find(note => note.id === id);
  
  return {
    note,
    isLoading: false
  };
}