import { View, Image, Pressable, Platform } from "react-native";
import {
  Card,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  BadgeText,
  Box,
} from "@gluestack-ui/themed";
import { router } from "expo-router";
import type { MediaPair } from "../../lib/supabase-queries";

interface PairRowProps {
  pair: MediaPair;
}

export function PairRow({ pair }: PairRowProps) {
  const handlePress = () => {
    router.push(`/(app)/media/${pair.pair_number}` as any);
  };

  const album = pair.album;
  const movie = pair.movie;

  const albumCompleted = album?.user_album?.completed_at && !album?.user_album?.skipped;
  const albumSkipped = album?.user_album?.skipped;
  const movieCompleted = movie?.user_movie?.completed_at && !movie?.user_movie?.skipped;
  const movieSkipped = movie?.user_movie?.skipped;

  return (
    <Pressable onPress={handlePress}>
      <Card
        size="md"
        variant="elevated"
        bg="$white"
        borderRadius="$lg"
        p="$4"
        mb="$3"
      >
        <HStack space="md" alignItems="center">
          {/* Pair Number */}
          <Box
            minWidth={60}
            alignItems="center"
            justifyContent="center"
            bg="$gray100"
            borderRadius="$md"
            p="$3"
          >
            <Text size="xs" color="$gray500" fontWeight="$semibold">
              PAIR
            </Text>
            <Heading size="xl" color="$gray900">
              {pair.pair_number}
            </Heading>
          </Box>

          {/* Album Section */}
          <Box flex={1}>
            {album ? (
              <HStack space="sm" alignItems="center">
                {/* Album Cover */}
                <Box
                  width={Platform.select({ web: 80, default: 60 })}
                  height={Platform.select({ web: 80, default: 60 })}
                  bg="$gray100"
                  borderRadius="$md"
                  overflow="hidden"
                  position="relative"
                >
                  {album.cover_url ? (
                    <Image
                      source={{ uri: album.cover_url }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Box
                      flex={1}
                      alignItems="center"
                      justifyContent="center"
                      bg="$gray200"
                    >
                      <Text size="2xs" color="$gray500">
                        No Image
                      </Text>
                    </Box>
                  )}
                </Box>

                {/* Album Info */}
                <VStack space="xs" flex={1}>
                  <Text size="2xs" color="$gray500" fontWeight="$semibold">
                    ALBUM
                  </Text>
                  <Heading size="sm" color="$gray900" numberOfLines={1}>
                    {album.title}
                  </Heading>
                  <Text size="xs" color="$gray600" numberOfLines={1}>
                    {album.artist}
                  </Text>
                  <HStack space="xs" mt="$1">
                    <Badge variant="outline" borderRadius="$sm" size="sm">
                      <BadgeText fontSize="$2xs">{album.year}</BadgeText>
                    </Badge>
                    {albumCompleted && (
                      <Badge variant="solid" action="success" borderRadius="$sm" size="sm">
                        <BadgeText fontSize="$2xs">{album.user_album?.rating}★</BadgeText>
                      </Badge>
                    )}
                    {albumSkipped && (
                      <Badge variant="outline" action="muted" borderRadius="$sm" size="sm">
                        <BadgeText fontSize="$2xs">Skipped</BadgeText>
                      </Badge>
                    )}
                  </HStack>
                </VStack>
              </HStack>
            ) : (
              <Box p="$3" alignItems="center">
                <Text size="xs" color="$gray400">
                  No album data
                </Text>
              </Box>
            )}
          </Box>

          {/* Divider */}
          <Box width={1} height="$full" bg="$gray200" />

          {/* Movie Section */}
          <Box flex={1}>
            {movie ? (
              <HStack space="sm" alignItems="center">
                {/* Movie Poster */}
                <Box
                  width={Platform.select({ web: 80, default: 60 })}
                  height={Platform.select({ web: 80, default: 60 })}
                  bg="$gray100"
                  borderRadius="$md"
                  overflow="hidden"
                  position="relative"
                >
                  {movie.poster_url ? (
                    <Image
                      source={{ uri: movie.poster_url }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Box
                      flex={1}
                      alignItems="center"
                      justifyContent="center"
                      bg="$gray200"
                    >
                      <Text size="2xs" color="$gray500">
                        No Image
                      </Text>
                    </Box>
                  )}
                </Box>

                {/* Movie Info */}
                <VStack space="xs" flex={1}>
                  <Text size="2xs" color="$gray500" fontWeight="$semibold">
                    MOVIE
                  </Text>
                  <Heading size="sm" color="$gray900" numberOfLines={1}>
                    {movie.title}
                  </Heading>
                  <Text size="xs" color="$gray600" numberOfLines={1}>
                    {movie.director}
                  </Text>
                  <HStack space="xs" mt="$1">
                    <Badge variant="outline" borderRadius="$sm" size="sm">
                      <BadgeText fontSize="$2xs">{movie.year}</BadgeText>
                    </Badge>
                    {movieCompleted && (
                      <Badge variant="solid" action="success" borderRadius="$sm" size="sm">
                        <BadgeText fontSize="$2xs">{movie.user_movie?.rating}★</BadgeText>
                      </Badge>
                    )}
                    {movieSkipped && (
                      <Badge variant="outline" action="muted" borderRadius="$sm" size="sm">
                        <BadgeText fontSize="$2xs">Skipped</BadgeText>
                      </Badge>
                    )}
                  </HStack>
                </VStack>
              </HStack>
            ) : (
              <Box p="$3" alignItems="center">
                <Text size="xs" color="$gray400">
                  No movie data
                </Text>
              </Box>
            )}
          </Box>
        </HStack>
      </Card>
    </Pressable>
  );
}
