import { Box, Heading, Text } from '@gluestack-ui/themed';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function DashboardScreen() {
  // Redirect to home since home is now the dashboard
  useEffect(() => {
    router.replace('/');
  }, []);

  return (
    <Box className="flex-1 items-center justify-center bg-gray-50">
      <Text size="md" className="text-gray-600">Redirecting...</Text>
    </Box>
  );
}
