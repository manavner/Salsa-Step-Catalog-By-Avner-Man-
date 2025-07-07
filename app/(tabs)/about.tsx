import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, ExternalLink } from 'lucide-react-native';

export default function AboutScreen() {
  const openGoogleSheet = () => {
    Linking.openURL('https://docs.google.com/spreadsheets/d/1lHXna6z1NX3UNEQ-ujRVr3BF8MFY05_z1H7TUKPVuhM/edit');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>About This App</Text>
          <Text style={styles.subtitle}>
            Created with passion for salsa dancing
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Salsa Step Catalog</Text>
          <Text style={styles.description}>
            This app helps you learn and practice essential salsa dance steps. Each step includes:
          </Text>
          <View style={styles.featureList}>
            <Text style={styles.feature}>• Step names in Spanish</Text>
            <Text style={styles.feature}>• Original count patterns</Text>
            <Text style={styles.feature}>• Step types and difficulty levels</Text>
            <Text style={styles.feature}>• Spanish pronunciation audio</Text>
            <Text style={styles.feature}>• YouTube video demonstrations</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>By Avner Man</Text>
          <Text style={styles.description}>
            Curated and organized to help dancers of all levels improve their salsa skills.
          </Text>
        </View>

        <TouchableOpacity style={styles.linkButton} onPress={openGoogleSheet}>
          <ExternalLink size={20} color="#1DB954" />
          <Text style={styles.linkText}>View Source Data</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Heart size={16} color="#FF0000" />
          <Text style={styles.footerText}>Made with love for the salsa community</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191414',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#B3B3B3',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#B3B3B3',
    lineHeight: 24,
    marginBottom: 16,
  },
  featureList: {
    gap: 8,
  },
  feature: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#B3B3B3',
    lineHeight: 20,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 32,
  },
  linkText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1DB954',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 'auto',
    paddingTop: 20,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#B3B3B3',
  },
});