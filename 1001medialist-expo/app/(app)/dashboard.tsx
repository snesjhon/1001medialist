import { useEffect, useState, useCallback } from "react";
import { ScrollView, View, RefreshControl } from "react-native";
import { Box, Spinner } from "@gluestack-ui/themed";
import { useFocusEffect } from "expo-router";
import { supabase } from "../../lib/supabase";
import { getCurrentPair, getProgress } from "../../lib/supabase-queries";
import { MediaDisplay } from "../../components/dashboard/MediaDisplay";
import { ProgressBar } from "../../components/dashboard/ProgressBar";
import type { User } from "@supabase/supabase-js";

export default function DashboardScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [pairData, setPairData] = useState<any>(null);
  const [progressData, setProgressData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadData(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadData(user.id);
      }
    }, [user])
  );

  const handleRefresh = () => {
    if (user) {
      setRefreshing(true);
      loadData(user.id);
    }
  };

  if (!user || !pairData || !progressData) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center" bg="$gray50" p="$12">
        <Spinner size="large" />
      </Box>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f9fafb" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <MediaDisplay
        album={pairData.album}
        movie={pairData.movie}
        userAlbum={pairData.userAlbum}
        userMovie={pairData.userMovie}
        userId={user.id}
        onUpdate={handleRefresh}
      />

      {/* Progress Bar */}
      <View
        style={{
          maxWidth: 1280,
          marginHorizontal: "auto",
          width: "100%",
          paddingHorizontal: 32,
          paddingBottom: 32,
        }}
      >
        <ProgressBar
          albumsCompleted={progressData.albumsCompleted}
          moviesCompleted={progressData.moviesCompleted}
          currentPairNumber={progressData.currentPairNumber}
        />
      </View>
    </ScrollView>
  );
}
