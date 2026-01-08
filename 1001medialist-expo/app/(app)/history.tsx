import { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Box, Heading, Text } from "@gluestack-ui/themed";
// import { supabase } from '../lib/supabase';
// import { Navbar } from '../components/layout/Navbar';
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/layout/Navbar";

export default function HistoryScreen() {
  const [user, setUser] = useState<any>(null);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <Navbar onSignOut={handleSignOut} isAuthenticated={!!user} />
      <View
        style={{
          maxWidth: 1280,
          marginHorizontal: "auto",
          width: "100%",
          padding: 32,
        }}
      >
        <Box>
          <Heading size="2xl" color="$gray900">
            History
          </Heading>
          <Text size="md" color="$gray600" mt="$2">
            Your listening history will appear here
          </Text>
        </Box>
      </View>
    </ScrollView>
  );
}
