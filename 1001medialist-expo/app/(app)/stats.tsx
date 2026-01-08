import { useState, useEffect } from 'react';
import { ScrollView, View, ActivityIndicator, Platform } from 'react-native';
import { Box, Heading, Text, VStack, HStack } from '@gluestack-ui/themed';
import { supabase } from '../../lib/supabase';
import { getUserStats, type UserStats } from '../../lib/supabase-queries';
import { StatCard } from '../../components/stats/StatCard';
import { TopRatedList } from '../../components/stats/TopRatedList';
import { DecadeBreakdown } from '../../components/stats/DecadeBreakdown';
import { RecentCompletions } from '../../components/stats/RecentCompletions';

export default function StatsScreen() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getUserStats(user.id);
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
      setError('Failed to load statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const completionPercentage = stats
    ? Math.round((stats.pairsCompleted / stats.totalPairs) * 100)
    : 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={{ maxWidth: 1280, marginHorizontal: 'auto', width: '100%', paddingHorizontal: 16 }}>
        <VStack space="md" py="$6">
          {/* Header */}
          <Box px="$4">
            <Heading size="2xl" color="$gray900">Statistics</Heading>
            <Text size="md" color="$gray600" mt="$2">
              Track your progress through the 1001 collection
            </Text>
          </Box>

          {/* Loading State */}
          {loading && (
            <Box py="$12" alignItems="center" justifyContent="center">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text size="sm" color="$gray600" mt="$4">
                Loading statistics...
              </Text>
            </Box>
          )}

          {/* Error State */}
          {error && (
            <Box py="$12" alignItems="center" justifyContent="center" px="$4">
              <Text size="lg" color="$red500" textAlign="center">
                {error}
              </Text>
            </Box>
          )}

          {/* Stats Content */}
          {!loading && !error && stats && (
            <Box px="$4">
              <VStack space="lg">
                {/* Overview Stats */}
                <VStack space="sm">
                  <Text size="sm" color="$gray700" fontWeight="$semibold" mb="$2">
                    OVERVIEW
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <View style={{ flex: 1, minWidth: Platform.OS === 'web' ? 200 : 150 }}>
                      <StatCard
                        title="Pairs Completed"
                        value={stats.pairsCompleted}
                        subtitle={`${completionPercentage}% of 1001`}
                        color="$green500"
                      />
                    </View>
                    <View style={{ flex: 1, minWidth: Platform.OS === 'web' ? 200 : 150 }}>
                      <StatCard
                        title="Albums Done"
                        value={stats.albumsCompleted}
                        subtitle={`${stats.albumsSkipped} skipped`}
                        color="$blue500"
                      />
                    </View>
                    <View style={{ flex: 1, minWidth: Platform.OS === 'web' ? 200 : 150 }}>
                      <StatCard
                        title="Movies Done"
                        value={stats.moviesCompleted}
                        subtitle={`${stats.moviesSkipped} skipped`}
                        color="$purple500"
                      />
                    </View>
                  </View>
                </VStack>

                {/* Average Ratings */}
                <VStack space="sm">
                  <Text size="sm" color="$gray700" fontWeight="$semibold" mb="$2">
                    AVERAGE RATINGS
                  </Text>
                  <HStack space="sm">
                    <Box flex={1}>
                      <StatCard
                        title="Album Rating"
                        value={stats.averageAlbumRating > 0 ? `${stats.averageAlbumRating}★` : 'N/A'}
                        subtitle="Average across all rated"
                        color="$blue600"
                      />
                    </Box>
                    <Box flex={1}>
                      <StatCard
                        title="Movie Rating"
                        value={stats.averageMovieRating > 0 ? `${stats.averageMovieRating}★` : 'N/A'}
                        subtitle="Average across all rated"
                        color="$purple600"
                      />
                    </Box>
                  </HStack>
                </VStack>

                {/* Top Rated */}
                <VStack space="sm">
                  <Text size="sm" color="$gray700" fontWeight="$semibold" mb="$2">
                    TOP RATED
                  </Text>
                  <HStack space="sm" flexDirection={Platform.OS === 'web' ? 'row' : 'column'}>
                    <Box flex={1}>
                      <TopRatedList
                        title="TOP ALBUMS"
                        items={stats.topRatedAlbums}
                        type="album"
                      />
                    </Box>
                    <Box flex={1}>
                      <TopRatedList
                        title="TOP MOVIES"
                        items={stats.topRatedMovies}
                        type="movie"
                      />
                    </Box>
                  </HStack>
                </VStack>

                {/* Recent Activity */}
                <VStack space="sm">
                  <Text size="sm" color="$gray700" fontWeight="$semibold" mb="$2">
                    RECENT ACTIVITY
                  </Text>
                  <RecentCompletions items={stats.recentCompletions} />
                </VStack>

                {/* By Decade */}
                <VStack space="sm">
                  <Text size="sm" color="$gray700" fontWeight="$semibold" mb="$2">
                    BY DECADE
                  </Text>
                  <HStack space="sm" flexDirection={Platform.OS === 'web' ? 'row' : 'column'}>
                    <Box flex={1}>
                      <DecadeBreakdown
                        title="ALBUMS BY DECADE"
                        data={stats.albumsByDecade}
                        color="$blue500"
                      />
                    </Box>
                    <Box flex={1}>
                      <DecadeBreakdown
                        title="MOVIES BY DECADE"
                        data={stats.moviesByDecade}
                        color="$purple500"
                      />
                    </Box>
                  </HStack>
                </VStack>
              </VStack>
            </Box>
          )}
        </VStack>
      </View>
    </ScrollView>
  );
}
