import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  ButtonText,
  Input,
  InputField,
  Card,
  Spinner,
} from "@gluestack-ui/themed";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        router.replace("/(app)/dashboard");
      } else {
        setLoading(false);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        router.replace("/(app)/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    setIsSigningIn(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
      });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center" bg="$gray50">
        <Spinner size="large" />
      </Box>
    );
  }

  // Show login form
  return (
      <ScrollView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
        <Box p="$8" maxWidth={480} mx="auto" w="$full" mt="$20">
          <Card bg="$white" p="$10" borderRadius="$2xl" variant="elevated">
            <VStack space="2xl">
              <VStack space="sm">
                <Heading size="3xl" color="$gray900">
                  1001 Albums
                </Heading>
                <Text size="md" color="$gray600">
                  Track your progress through the 1001 Albums You Must Hear
                  Before You Die
                </Text>
              </VStack>

              <VStack space="md" mt="$4">
                <Input variant="outline" size="lg" borderRadius="$xl">
                  <InputField
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </Input>
                <Button
                  onPress={handleSignIn}
                  isDisabled={isSigningIn}
                  bg="$primary600"
                  borderRadius="$xl"
                  size="lg"
                  $active-bg="$primary700"
                >
                  {isSigningIn ? (
                    <Spinner color="white" />
                  ) : (
                    <ButtonText>Sign In with Email</ButtonText>
                  )}
                </Button>
                <Text size="sm" color="$gray500" textAlign="center">
                  We'll send you a magic link to sign in
                </Text>
              </VStack>
            </VStack>
          </Card>
        </Box>
      </ScrollView>
    );
}
