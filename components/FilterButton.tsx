import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

interface FilterButtonProps {
  level: string;
  isSelected: boolean;
  onPress: () => void;
}

export function FilterButton({ level, isSelected, onPress }: FilterButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, isSelected && styles.buttonActive]}
      onPress={onPress}
    >
      <Text style={[styles.text, isSelected && styles.textActive]}>
        {level}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  buttonActive: {
    backgroundColor: '#1DB954',
    borderColor: '#1DB954',
  },
  text: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#B3B3B3',
  },
  textActive: {
    color: '#191414',
  },
});