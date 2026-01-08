import { useState, useEffect, useMemo } from "react";
import { ScrollView, View, ActivityIndicator } from "react-native";
import { Box, Heading, Text, VStack } from "@gluestack-ui/themed";
import { supabase } from "../../lib/supabase";
import { getAllPairs, type MediaPair } from "../../lib/supabase-queries";
import {
  FilterBar,
  type FilterType,
  type SortType,
} from "../../components/list/FilterBar";
import { PairRow } from "../../components/list/PairRow";
import { Pagination } from "../../components/list/Pagination";

const ITEMS_PER_PAGE = 20;

export default function ListScreen() {
  const [user, setUser] = useState<any>(null);
  const [pairs, setPairs] = useState<MediaPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeSort, setActiveSort] = useState<SortType>("number");
  const [currentPage, setCurrentPage] = useState(1);

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
      loadPairs();
    }
  }, [user]);

  const loadPairs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getAllPairs(user.id);
      setPairs(data);
    } catch (err) {
      console.error("Error loading pairs:", err);
      setError("Failed to load pairs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 when filter or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, activeSort]);

  // Filter and sort pairs
  const filteredAndSortedPairs = useMemo(() => {
    let filtered = [...pairs];

    // Apply filter
    if (activeFilter === "both-completed") {
      filtered = filtered.filter((pair) => {
        const albumDone =
          pair.album?.user_album?.completed_at &&
          !pair.album?.user_album?.skipped;
        const movieDone =
          pair.movie?.user_movie?.completed_at &&
          !pair.movie?.user_movie?.skipped;
        return albumDone && movieDone;
      });
    } else if (activeFilter === "in-progress") {
      filtered = filtered.filter((pair) => {
        const albumDone =
          pair.album?.user_album &&
          (pair.album.user_album.completed_at || pair.album.user_album.skipped);
        const movieDone =
          pair.movie?.user_movie &&
          (pair.movie.user_movie.completed_at || pair.movie.user_movie.skipped);
        return (albumDone && !movieDone) || (!albumDone && movieDone);
      });
    } else if (activeFilter === "pending") {
      filtered = filtered.filter((pair) => {
        const albumDone = pair.album?.user_album;
        const movieDone = pair.movie?.user_movie;
        return !albumDone && !movieDone;
      });
    } else if (activeFilter === "has-skipped") {
      filtered = filtered.filter((pair) => {
        const albumSkipped = pair.album?.user_album?.skipped;
        const movieSkipped = pair.movie?.user_movie?.skipped;
        return albumSkipped || movieSkipped;
      });
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (activeSort) {
        case "number":
          return a.pair_number - b.pair_number;
        case "year":
          const yearA = a.album?.year || 0;
          const yearB = b.album?.year || 0;
          return yearA - yearB;
        case "album-title":
          const titleA = a.album?.title || "";
          const titleB = b.album?.title || "";
          return titleA.localeCompare(titleB);
        default:
          return 0;
      }
    });

    return filtered;
  }, [pairs, activeFilter, activeSort]);

  // Pagination calculations
  const totalItems = filteredAndSortedPairs.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  // Get current page of pairs
  const paginatedPairs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredAndSortedPairs.slice(start, end);
  }, [filteredAndSortedPairs, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <View
        style={{
          maxWidth: 1280,
          marginHorizontal: "auto",
          width: "100%",
          paddingHorizontal: 16,
        }}
      >
        <VStack space="md" py="$6">
          {/* Header */}
          <Box px="$4">
            <Heading size="2xl" color="$gray900">
              Media List
            </Heading>
            <Text size="md" color="$gray600" mt="$2">
              Browse all 1001 pairs - albums and movies you must experience
            </Text>
          </Box>

          {/* Filter Bar */}
          {!loading && !error && (
            <Box px="$4">
              <FilterBar
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                activeSort={activeSort}
                onSortChange={setActiveSort}
                totalCount={pairs.length}
                filteredCount={totalItems}
              />
            </Box>
          )}

          {/* Top Pagination */}
          {!loading && !error && totalPages > 1 && (
            <Box px="$4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                startIndex={startIndex}
                endIndex={endIndex}
                totalCount={totalItems}
              />
            </Box>
          )}

          {/* Loading State */}
          {loading && (
            <Box py="$12" alignItems="center" justifyContent="center">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text size="sm" color="$gray600" mt="$4">
                Loading pairs...
              </Text>
            </Box>
          )}

          {/* Error State */}
          {error && (
            <Box py="$12" alignItems="center" justifyContent="center" px="$4">
              <Text size="lg" color="$red500" textAlign="center" mb="$2">
                {error}
              </Text>
            </Box>
          )}

          {/* Pairs List */}
          {!loading && !error && (
            <Box px="$4">
              {paginatedPairs.map((pair) => (
                <PairRow key={pair.pair_number} pair={pair} />
              ))}

              {/* Empty State */}
              {paginatedPairs.length === 0 && totalItems === 0 && (
                <Box py="$12" alignItems="center" justifyContent="center">
                  <Text size="md" color="$gray600" textAlign="center">
                    No pairs found for this filter.
                  </Text>
                </Box>
              )}
            </Box>
          )}

          {/* Bottom Pagination */}
          {!loading && !error && totalPages > 1 && (
            <Box px="$4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                startIndex={startIndex}
                endIndex={endIndex}
                totalCount={totalItems}
              />
            </Box>
          )}
        </VStack>
      </View>
    </ScrollView>
  );
}
