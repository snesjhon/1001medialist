import { useEffect, useState, useCallback } from "react";
import { ScrollView, RefreshControl, View } from "react-native";
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
import { useFocusEffect } from "expo-router";
import { supabase } from "../lib/supabase";
import { getCurrentPair, getProgress } from "../lib/supabase-queries";
import { MediaHeader } from "../components/dashboard/MediaHeader";
import { ProgressBar } from "../components/dashboard/ProgressBar";
import { AlbumCard } from "../components/dashboard/AlbumCard";
import { MovieCard } from "../components/dashboard/MovieCard";
import { Navbar } from "../components/layout/Navbar";
import type { User } from "@supabase/supabase-js";

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [pairData, setPairData] = useState<any>(null);
  const [progressData, setProgressData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const checkSession = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    setLoading(false);
  }, []);

  const loadData = async (userId: string) => {
    try {
      const [pair, progress] = await Promise.all([
        getCurrentPair(userId),
        getProgress(userId),
      ]);

      setPairData(pair);
      setProgressData(progress);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadData(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [checkSession]);

  useEffect(() => {
    if (user) {
      loadData(user.id);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      checkSession();
    }, [checkSession]),
  );

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

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setPairData(null);
      setProgressData(null);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleRefresh = () => {
    if (user) {
      setRefreshing(true);
      loadData(user.id);
    }
  };

  if (loading) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center" bg="$gray50">
        <Spinner size="large" />
      </Box>
    );
  }

  // Not logged in - show auth
  if (!user) {
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

  // Logged in - show dashboard
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f9fafb" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Unified Navigation Header */}
      <Navbar onSignOut={handleSignOut} isAuthenticated={true} />

      {!pairData || !progressData ? (
        <Box flex={1} alignItems="center" justifyContent="center" p="$12">
          <Spinner size="large" />
        </Box>
      ) : (
        <View
          style={{
            maxWidth: 1280,
            marginHorizontal: "auto",
            width: "100%",
            padding: 32,
          }}
        >
          {/* Navigation Header */}
          <Box mb="$6">
            <MediaHeader
              currentPairNumber={progressData.currentPairNumber}
              isOnDashboard={true}
            />
          </Box>

          {/* Album and Movie Cards - Grid Layout for Web */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 32,
              flexWrap: "wrap",
              marginBottom: 32,
            }}
          >
            <View style={{ flex: 1, minWidth: 400 }}>
              <AlbumCard
                album={pairData.album}
                userAlbum={pairData.userAlbum}
                userId={user.id}
                onUpdate={handleRefresh}
              />
            </View>
            <View style={{ flex: 1, minWidth: 400 }}>
              <MovieCard
                movie={pairData.movie}
                userMovie={pairData.userMovie}
                userId={user.id}
                onUpdate={handleRefresh}
              />
            </View>
          </View>

          {/* Progress Bar */}
          <ProgressBar
            albumsCompleted={progressData.albumsCompleted}
            moviesCompleted={progressData.moviesCompleted}
            currentPairNumber={progressData.currentPairNumber}
          />
        </View>
      )}
    </ScrollView>
  );
}
