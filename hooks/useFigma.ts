import { useState, useEffect } from 'react';
import type { FigmaFile, FigmaFrame } from '@/types/figma';

const FIGMA_ACCESS_TOKEN = process.env.EXPO_PUBLIC_FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = process.env.EXPO_PUBLIC_FIGMA_FILE_KEY;

export function useFigma() {
  const [file, setFile] = useState<FigmaFile | null>(null);
  const [frames, setFrames] = useState<FigmaFrame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFigmaFile = async () => {
      if (!FIGMA_ACCESS_TOKEN || !FIGMA_FILE_KEY) {
        setError('Figma credentials not configured');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`,
          {
            headers: {
              'X-Figma-Token': FIGMA_ACCESS_TOKEN,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch Figma file');
        }

        const data = await response.json();
        setFile(data);
        
        // Extract all frames from the document
        const extractFrames = (nodes: FigmaFrame[]): FigmaFrame[] => {
          return nodes.reduce((acc: FigmaFrame[], node) => {
            if (node.type === 'FRAME') {
              acc.push(node);
            }
            if (node.children) {
              acc.push(...extractFrames(node.children));
            }
            return acc;
          }, []);
        };

        const allFrames = extractFrames(data.document.children);
        setFrames(allFrames);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch Figma data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFigmaFile();
  }, []);

  return { file, frames, isLoading, error };
}