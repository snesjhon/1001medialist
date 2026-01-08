import { memo, ReactNode } from "react";
import { ScrollView, View, RefreshControl } from "react-native";
import { Navbar } from "./Navbar";

interface AuthenticatedLayoutProps {
  children: ReactNode;
  onSignOut: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const AuthenticatedLayout = memo(function AuthenticatedLayout({
  children,
  onSignOut,
  refreshing = false,
  onRefresh,
}: AuthenticatedLayoutProps) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f9fafb" }}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    >
      <Navbar onSignOut={onSignOut} isAuthenticated={true} />
      {children}
    </ScrollView>
  );
});
