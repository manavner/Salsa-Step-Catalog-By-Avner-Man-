import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { Volume2, Play } from 'lucide-react-native';
import * as Speech from 'expo-speech';

interface SalsaStep {
  level: string;
  stepName: string;
  originalCount: string;
  type: string;
  link: string;
}

interface StepCardProps {
  step: SalsaStep;
}

export function StepCard({ step }: StepCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const playTTS = async () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    
    const options = {
      language: 'es-ES',
      rate: 0.8,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    };

    if (Platform.OS === 'web') {
      // Web Speech API fallback
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(step.stepName);
        utterance.lang = 'es-ES';
        utterance.rate = 0.8;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      } else {
        setIsSpeaking(false);
      }
    } else {
      Speech.speak(step.stepName, options);
    }
  };

  const openVideo = () => {
    if (step.link) {
      Linking.openURL(step.link);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginners':
      case 'beginner':
        return '#1DB954';
      case 'intermediate':
        return '#FFA500';
      case 'advanced':
        return '#FF6B6B';
      default:
        return '#B3B3B3';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.stepName}>{step.stepName}</Text>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(step.level) }]}>
            <Text style={styles.levelText}>{step.level}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.ttsButton, isSpeaking && styles.ttsButtonActive]}
          onPress={playTTS}
        >
          <Volume2 size={20} color={isSpeaking ? '#191414' : '#1ED760'} />
        </TouchableOpacity>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Type</Text>
          <Text style={styles.detailValue}>{step.type}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Count</Text>
          <Text style={styles.detailValue}>{step.originalCount}</Text>
        </View>
      </View>

      {step.link && (
        <TouchableOpacity style={styles.videoButton} onPress={openVideo}>
          <Play size={16} color="#FFFFFF" />
          <Text style={styles.videoButtonText}>Watch Video</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  stepName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 24,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#191414',
  },
  ttsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3A3A3A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1ED760',
  },
  ttsButtonActive: {
    backgroundColor: '#1ED760',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#B3B3B3',
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  videoButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});