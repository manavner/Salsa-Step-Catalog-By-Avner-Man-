import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react-native';
import { useSupabaseConnection } from '@/hooks/useSupabaseConnection';

export function ConnectionStatus() {
  const { isConnected, error, checkConnection } = useSupabaseConnection();

  if (isConnected === null) {
    return (
      <View style={styles.container}>
        <RefreshCw size={16} color="#FFA500" />
        <Text style={styles.checkingText}>Checking connection...</Text>
      </View>
    );
  }

  if (!isConnected) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <WifiOff size={16} color="#FF6B6B" />
        <Text style={styles.errorText}>Database connection failed</Text>
        <TouchableOpacity onPress={checkConnection} style={styles.retryButton}>
          <RefreshCw size={14} color="#FF6B6B" />
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.successContainer]}>
      <Wifi size={16} color="#1DB954" />
      <Text style={styles.successText}>Database connected</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    gap: 8,
  },
  errorContainer: {
    borderColor: '#FF6B6B',
    backgroundColor: '#2A1A1A',
  },
  successContainer: {
    borderColor: '#1DB954',
    backgroundColor: '#1A2A1A',
  },
  checkingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#FFA500',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#FF6B6B',
  },
  successText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#1DB954',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 8,
  },
  retryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FF6B6B',
  },
});