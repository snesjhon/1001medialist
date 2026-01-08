import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Box, Spinner } from "@gluestack-ui/themed";
import { useLocalSearchParams, router } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { getPairByNumber } from "../../../lib/supabase-queries";
import { MediaDisplay } from "../../../components/dashboard/MediaDisplay";
import type { User } from "@supabase/supabase-js";

export default function MediaDetailScreen() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pairData, setPairData] = useState<any>(null);

  const pairNumber = typeof id === "string" ? parseInt(id, 10) : 1;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadPairData();
    }
  }, [user, pairNumber]);

  const loadPairData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getPairByNumber(user.id, pairNumber);
      setPairData(data);
    } catch (error) {
      console.error("Error loading pair:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center" bg="$gray50">
        <Spinner size="large" />
      </Box>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {!pairData ? (
        <Box flex={1} alignItems="center" justifyContent="center" p="$12">
          <Spinner size="large" />
        </Box>
      ) : (
        <MediaDisplay
          album={pairData.album}
          movie={pairData.movie}
          userAlbum={pairData.userAlbum}
          userMovie={pairData.userMovie}
          userId={user.id}
          onUpdate={loadPairData}
        />
      )}
    </ScrollView>
  );
}
