import { useState } from "react";
import { Linking, Image } from "react-native";
import {
  Card,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  BadgeText,
  Button,
  ButtonText,
  Pressable,
  Box,
} from "@gluestack-ui/themed";
import { CompleteButton } from "./CompleteButton";
import { SkipButton } from "./SkipButton";
import type { Movie, UserMovie } from "../../lib/supabase-queries";

interface MovieCardProps {
  movie: Movie | null;
  userMovie: UserMovie | null;
  userId: string;
  onUpdate?: () => void;
}

export function MovieCard({
  movie,
  userMovie,
  userId,
  onUpdate,
}: MovieCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (!movie) {
    return (
      <Card size="lg" variant="elevated" bg="$white" borderRadius="$xl" p="$6">
        <Text size="md" color="$gray500" textAlign="center">
          No movie found for this pair number.
        </Text>
      </Card>
    );
  }

  const movieCompleted =
    userMovie && (userMovie.completed_at || userMovie.skipped);

  return (
    <Card
      size="lg"
      variant="elevated"
      bg="$white"
      borderRadius="$xl"
      opacity={movieCompleted ? 0.6 : 1}
      p="$6"
    >
      <VStack space="md">
        {/* Movie Poster */}
        {movie.poster_url && (
          <Box
            w="$full"
            h={400}
            bg="$gray100"
            borderRadius="$xl"
            overflow="hidden"
            alignItems="center"
            justifyContent="center"
          >
            <Image
              source={{ uri: movie.poster_url }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          </Box>
        )}

        {/* Content Section */}
        <VStack space="md" px="$2">
          {/* Completion Badge */}
          {movieCompleted && (
            <Badge
              variant={userMovie.skipped ? "outline" : "solid"}
              action={userMovie.skipped ? "muted" : "success"}
              alignSelf="flex-start"
              borderRadius="$md"
            >
              <BadgeText>
                {userMovie.skipped ? "Skipped" : `Rated ${userMovie.rating}★`}
              </BadgeText>
            </Badge>
          )}

          {/* Title & Director */}
          <VStack space="xs">
            <Heading size="xl" color="$gray900" lineHeight="$2xl">
              {movie.title}
            </Heading>
            <Text size="md" color="$gray600">
              {movie.director}
            </Text>
          </VStack>

          {/* Badges */}
          <HStack space="sm" flexWrap="wrap">
            <Badge variant="outline" borderRadius="$sm" size="sm">
              <BadgeText fontSize="$xs">{movie.year}</BadgeText>
            </Badge>
            {movie.genre && (
              <Badge variant="outline" borderRadius="$sm" size="sm">
                <BadgeText fontSize="$xs">{movie.genre}</BadgeText>
              </Badge>
            )}
            {movie.runtime && (
              <Badge variant="outline" borderRadius="$sm" size="sm">
                <BadgeText fontSize="$xs">{movie.runtime} min</BadgeText>
              </Badge>
            )}
          </HStack>

          {/* Toggle Details */}
          {(movie.description ||
            movie.watch_provider_link ||
            movie.tmdb_id) && (
            <Button
              variant="link"
              onPress={() => setShowDetails(!showDetails)}
              alignSelf="flex-start"
              size="sm"
              px="$0"
            >
              <ButtonText color="$primary600" fontSize="$sm">
                {showDetails ? "▲ Hide details" : "▼ Show details"}
              </ButtonText>
            </Button>
          )}

          {/* Details Section */}
          {showDetails && (
            <VStack space="sm" pt="$2">
              {movie.description && (
                <Text size="sm" color="$gray600" lineHeight="$lg">
                  {movie.description}
                </Text>
              )}

              <HStack space="md" flexWrap="wrap">
                {movie.watch_provider_link && (
                  <Pressable
                    onPress={() => Linking.openURL(movie.watch_provider_link!)}
                  >
                    <Text size="sm" color="$primary600" fontWeight="$medium">
                      Where to Watch →
                    </Text>
                  </Pressable>
                )}
                {movie.tmdb_id && (
                  <Pressable
                    onPress={() =>
                      Linking.openURL(
                        `https://www.themoviedb.org/movie/${movie.tmdb_id}`,
                      )
                    }
                  >
                    <Text size="sm" color="$gray500">
                      TMDB →
                    </Text>
                  </Pressable>
                )}
              </HStack>
            </VStack>
          )}
        </VStack>

        {/* Actions */}
        {!movieCompleted && (
          <HStack space="sm" mt="$6">
            <CompleteButton
              type="movie"
              itemId={movie.id}
              userId={userId}
              onComplete={onUpdate}
            />
            <SkipButton
              type="movie"
              itemId={movie.id}
              userId={userId}
              onSkip={onUpdate}
            />
          </HStack>
        )}
      </VStack>
    </Card>
  );
}
