import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Volume2, Play, Filter } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { StepCard } from '@/components/StepCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { FilterButton } from '@/components/FilterButton';
import { SearchBar } from '@/components/SearchBar';

interface SalsaStep {
  level: string;
  stepName: string;
  originalCount: string;
  type: string;
  link: string;
}

const levels = ['All', 'Beginners', 'Intermediate', 'Advanced'];

export default function HomeScreen() {
  const [steps, setSteps] = useState<SalsaStep[]>([]);
  const [filteredSteps, setFilteredSteps] = useState<SalsaStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    fetchSteps();
  }, []);

  useEffect(() => {
    let filtered = steps;
    
    // Filter by level
    if (selectedLevel !== 'All') {
      filtered = filtered.filter(step => step.level === selectedLevel);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(step => 
        step.stepName.toLowerCase().includes(query) ||
        step.type.toLowerCase().includes(query) ||
        step.originalCount.toLowerCase().includes(query)
      );
    }
    
    setFilteredSteps(filtered);
  }, [steps, selectedLevel, searchQuery]);

  const fetchSteps = async () => {
    try {
      const response = await fetch(
        'https://docs.google.com/spreadsheets/d/1lHXna6z1NX3UNEQ-ujRVr3BF8MFY05_z1H7TUKPVuhM/export?format=csv'
      );
      const csvText = await response.text();
      const parsed = parseCSV(csvText);
      setSteps(parsed);
      setFilteredSteps(parsed);
    } catch (error) {
      console.error('Error fetching steps:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseCSV = (csvText: string): SalsaStep[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return {
        level: values[0]?.trim() || '',
        stepName: values[1]?.trim() || '',
        originalCount: values[2]?.trim() || '',
        type: values[3]?.trim() || '',
        link: values[4]?.trim() || '',
      };
    }).filter(step => step.stepName && step.level);
  };

  const handleDismissWelcome = () => {
    setShowWelcome(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {showWelcome && (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Salsa Step Catalog By Avner Man!</Text>
          <Text style={styles.welcomeSubtitle}>
            Discover, hear, and dance the essential salsa steps.
          </Text>
          <TouchableOpacity 
            style={styles.dismissButton} 
            onPress={handleDismissWelcome}
          >
            <Text style={styles.dismissButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {!showWelcome && (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Salsa Steps</Text>
            <Text style={styles.headerSubtitle}>{filteredSteps.length} steps available</Text>
          </View>

          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name, type, or count..."
          />

          <View style={styles.filtersContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScrollContainer}
            >
              {levels.map(level => (
                <FilterButton
                  key={level}
                  level={level}
                  isSelected={selectedLevel === level}
                  onPress={() => setSelectedLevel(level)}
                />
              ))}
            </ScrollView>
          </View>

          <ScrollView 
            style={styles.stepsContainer}
            showsVerticalScrollIndicator={false}
          >
            {filteredSteps.length === 0 && (searchQuery.trim() || selectedLevel !== 'All') && (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsTitle}>No steps found</Text>
                <Text style={styles.noResultsText}>
                  {searchQuery.trim() 
                    ? `No steps match "${searchQuery}"`
                    : `No ${selectedLevel.toLowerCase()} steps available`
                  }
                </Text>
              </View>
            )}
            {filteredSteps.map((step, index) => (
              <StepCard key={index} step={step} />
            ))}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191414',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  welcomeTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  welcomeSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: '#B3B3B3',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  dismissButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  dismissButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#B3B3B3',
  },
  filtersContainer: {
    paddingVertical: 8,
  },
  filtersScrollContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  stepsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bottomSpacer: {
    height: 20,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noResultsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  noResultsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#B3B3B3',
    textAlign: 'center',
    lineHeight: 20,
  },
});