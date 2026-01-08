import { useEffect } from "react";
import { Stack } from "expo-router";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import { supabase } from "../lib/supabase";

import { config as defaultConfig } from "@gluestack-ui/config";

export default function RootLayout() {
  useEffect(() => {
    // Handle incoming deep links (magic link authentication)
    const handleDeepLink = async (event: Linking.EventType) => {
      const url = event.url;
      if (!url) return;

      try {
        // Parse the URL to extract tokens from hash (for web) or query params
        const parsedUrl = new URL(url);

        // Try hash first (web magic links use hash fragments)
        let access_token = null;
        let refresh_token = null;

        if (parsedUrl.hash) {
          const hashParams = new URLSearchParams(parsedUrl.hash.substring(1));
          access_token = hashParams.get("access_token");
          refresh_token = hashParams.get("refresh_token");
        }

        // Fallback to query params
        if (!access_token) {
          access_token = parsedUrl.searchParams.get("access_token");
          refresh_token = parsedUrl.searchParams.get("refresh_token");
        }

        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            console.error("Error setting session:", error);
          } else {
            console.log("Session set successfully!");
            // Clean up the URL by removing the hash
            if (typeof window !== "undefined") {
              window.history.replaceState({}, document.title, "/");
            }
          }
        }
      } catch (error) {
        console.error("Error handling deep link:", error);
      }
    };

    // Listen for deep links
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Check if app was opened with a URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    // Also check window.location.hash on web for initial load
    if (typeof window !== "undefined" && window.location.hash) {
      handleDeepLink({ url: window.location.href });
    }

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <GluestackUIProvider config={defaultConfig}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "none", // Disable animations for smoother transitions
          }}
        />
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}
