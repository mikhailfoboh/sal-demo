import { StyleSheet, View, Image, Text } from 'react-native';
import type { FigmaFrame as FigmaFrameType } from '@/types/figma';

interface FigmaFrameProps {
  frame: FigmaFrameType;
  scale?: number;
}

export function FigmaFrame({ frame, scale = 1 }: FigmaFrameProps) {
  if (!frame.absoluteBoundingBox) {
    return null;
  }

  const { width, height } = frame.absoluteBoundingBox;
  
  const styles = StyleSheet.create({
    container: {
      width: width * scale,
      height: height * scale,
      backgroundColor: frame.backgroundColor ? `rgba(${frame.backgroundColor.r * 255}, ${frame.backgroundColor.g * 255}, ${frame.backgroundColor.b * 255}, ${frame.backgroundColor.a})` : 'transparent',
    },
    name: {
      position: 'absolute',
      top: 8,
      left: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 4,
      borderRadius: 4,
    },
    nameText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontFamily: 'Inter-Medium',
    },
  });

  return (
    <View style={styles.container}>
      {frame.children?.map((child) => (
        <FigmaFrame key={child.id} frame={child} scale={scale} />
      ))}
      <View style={styles.name}>
        <Text style={styles.nameText}>{frame.name}</Text>
      </View>
    </View>
  );
}