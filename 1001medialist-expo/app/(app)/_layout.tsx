import { useEffect, useState } from "react";
import { View } from "react-native";
import { Stack, router, useSegments, usePathname } from "expo-router";
import { supabase } from "../../lib/supabase";
import { Navbar } from "../../components/layout/Navbar";
import { MediaHeader } from "../../components/dashboard/MediaHeader";
import { getProgress } from "../../lib/supabase-queries";
import type { User } from "@supabase/supabase-js";

export default function AppLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPairNumber, setCurrentPairNumber] = useState<number>(1);
  const segments = useSegments();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        router.replace("/");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        router.replace("/");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Update pair number based on route
  useEffect(() => {
    const isMediaRoute = segments.includes("media");
    const isDashboardRoute = pathname.includes("/dashboard");

    if (isMediaRoute) {
      // Extract pair number from URL like /(app)/media/42
      const match = pathname.match(/\/media\/(\d+)/);
      if (match) {
        setCurrentPairNumber(parseInt(match[1], 10));
      }
    } else if (isDashboardRoute && user) {
      // Fetch current pair number for dashboard
      getProgress(user.id).then((progress) => {
        setCurrentPairNumber(progress.currentPairNumber);
      });
    }
  }, [pathname, segments, user]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const isOnDashboard = pathname === "/(app)/dashboard" || pathname === "/dashboard";

  return (
    <>
      <Navbar onSignOut={handleSignOut} isAuthenticated={!!user} />

      {/* Persistent MediaHeader */}
      <View
        style={{
          backgroundColor: "#f9fafb",
          paddingTop: 32,
          paddingHorizontal: 32,
        }}
      >
        <View
          style={{
            maxWidth: 1280,
            marginHorizontal: "auto",
            width: "100%",
          }}
        >
          <MediaHeader
            currentPairNumber={currentPairNumber}
            isOnDashboard={isOnDashboard}
          />
        </View>
      </View>

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none", // Disable animations for instant transitions
        }}
      />
    </>
  );
}
