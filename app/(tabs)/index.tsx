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
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Volume2, Play, Filter, Mail, User, ArrowRight, CircleCheck as CheckCircle } from 'lucide-react-native';
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
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
  });
  const [registrationErrors, setRegistrationErrors] = useState({
    name: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setShowRegistration(true);
    setShowWelcome(false);
  };

  const handleSkipRegistration = () => {
    setShowRegistration(false);
  };

  const validateForm = () => {
    const errors = { name: '', email: '' };
    let isValid = true;

    if (!registrationData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (registrationData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registrationData.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
      }
    }

    setRegistrationErrors(errors);
    return isValid;
  };

  const handleRegistrationSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically send the data to your backend
      console.log('Registration data:', registrationData);
      
      // Show success and continue to app
      Alert.alert(
        'Registration Successful!',
        `Thank you ${registrationData.name}! ${registrationData.email ? 'We\'ll keep you updated.' : 'Welcome to the salsa community!'}`,
        [{ text: 'Continue', onPress: () => setShowRegistration(false) }]
      );
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateRegistrationField = (field: 'name' | 'email', value: string) => {
    setRegistrationData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (registrationErrors[field]) {
      setRegistrationErrors(prev => ({ ...prev, [field]: '' }));
    }
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
      
      {showRegistration && (
        <View style={styles.registrationContainer}>
          <View style={styles.registrationCard}>
            <View style={styles.registrationHeader}>
              <Text style={styles.registrationTitle}>Join the Salsa Community</Text>
              <Text style={styles.registrationSubtitle}>
                Get updates on new steps and salsa tips (optional)
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <User size={20} color="#B3B3B3" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, registrationErrors.name && styles.inputError]}
                    placeholder="Your name *"
                    placeholderTextColor="#B3B3B3"
                    value={registrationData.name}
                    onChangeText={(text) => updateRegistrationField('name', text)}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
                {registrationErrors.name ? (
                  <Text style={styles.errorText}>{registrationErrors.name}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Mail size={20} color="#B3B3B3" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, registrationErrors.email && styles.inputError]}
                    placeholder="Email address (optional)"
                    placeholderTextColor="#B3B3B3"
                    value={registrationData.email}
                    onChangeText={(text) => updateRegistrationField('email', text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {registrationErrors.email ? (
                  <Text style={styles.errorText}>{registrationErrors.email}</Text>
                ) : null}
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleRegistrationSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Continue</Text>
                    <ArrowRight size={20} color="#FFFFFF" />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.skipButton}
                onPress={handleSkipRegistration}
                disabled={isSubmitting}
              >
                <Text style={styles.skipButtonText}>Skip for now</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.privacyText}>
              We respect your privacy. Your information will only be used for salsa-related updates.
            </Text>
          </View>
        </View>
      )}

      {!showWelcome && !showRegistration && (
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
  registrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  registrationCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  registrationHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  registrationTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  registrationSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#B3B3B3',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    gap: 20,
    marginBottom: 32,
  },
  inputContainer: {
    gap: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#191414',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 0,
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FF6B6B',
    marginLeft: 4,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#1DB954',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#B3B3B3',
  },
  privacyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#B3B3B3',
    textAlign: 'center',
    lineHeight: 16,
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