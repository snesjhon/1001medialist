import { View } from 'react-native';
import { Box, HStack, Heading, Button, ButtonText } from '@gluestack-ui/themed';
import { router } from 'expo-router';

interface NavbarProps {
  onSignOut?: () => void;
  isAuthenticated?: boolean;
}

export function Navbar({ onSignOut, isAuthenticated = false }: NavbarProps) {
  return (
    <Box bg="$white" borderBottomWidth={1} borderColor="$gray200" py="$6">
      <View style={{ maxWidth: 1280, marginHorizontal: 'auto', width: '100%', paddingHorizontal: 32 }}>
        <HStack alignItems="center" justifyContent="space-between">
          {/* Title */}
          <Heading size="2xl" color="$gray900">
            1001MediaList
          </Heading>

          {/* Navigation Buttons */}
          {isAuthenticated && (
            <HStack space="md" alignItems="center">
              <Button
                onPress={() => router.push('/')}
                variant="link"
                size="sm"
              >
                <ButtonText color="$gray700" fontWeight="$medium">
                  Home
                </ButtonText>
              </Button>
              <Button
                onPress={() => router.push('/list')}
                variant="link"
                size="sm"
              >
                <ButtonText color="$gray700" fontWeight="$medium">
                  List
                </ButtonText>
              </Button>
              <Button
                onPress={() => router.push('/stats')}
                variant="link"
                size="sm"
              >
                <ButtonText color="$gray700" fontWeight="$medium">
                  Stats
                </ButtonText>
              </Button>
              <Button
                onPress={() => router.push('/history')}
                variant="link"
                size="sm"
              >
                <ButtonText color="$gray700" fontWeight="$medium">
                  History
                </ButtonText>
              </Button>
              <Button
                onPress={onSignOut}
                variant="outline"
                size="sm"
                borderRadius="$lg"
                ml="$2"
              >
                <ButtonText>Sign Out</ButtonText>
              </Button>
            </HStack>
          )}
        </HStack>
      </View>
    </Box>
  );
}
