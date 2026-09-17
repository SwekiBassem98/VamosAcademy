import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ParentPortalView } from '../components/parent/ParentPortalView.tsx';

export default function ParentPortalScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ParentPortalView onExit={() => router.replace('/' as any)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
