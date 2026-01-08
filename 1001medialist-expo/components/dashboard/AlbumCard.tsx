import { memo } from "react";
import { Linking, Image } from "react-native";
import {
  Card,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  BadgeText,
  Pressable,
  Box,
} from "@gluestack-ui/themed";
import { CompleteButton } from "./CompleteButton";
import { SkipButton } from "./SkipButton";
import type { Album, UserAlbum } from "../../lib/supabase-queries";

interface AlbumCardProps {
  album: Album | null;
  userAlbum: UserAlbum | null;
  userId: string;
  onUpdate?: () => void;
}

export const AlbumCard = memo(function AlbumCard({
  album,
  userAlbum,
  userId,
  onUpdate,
}: AlbumCardProps) {
  if (!album) {
    return (
      <Card size="lg" variant="elevated" bg="$white" borderRadius="$xl" p="$6">
        <Text size="md" color="$gray500" textAlign="center">
          No album found for this pair number.
        </Text>
      </Card>
    );
  }

  const albumCompleted =
    userAlbum && (userAlbum.completed_at || userAlbum.skipped);

  return (
    <Card
      size="lg"
      variant="elevated"
      bg="$white"
      borderRadius="$xl"
      opacity={albumCompleted ? 0.6 : 1}
      p="$6"
    >
      <VStack space="md">
        {/* Album Cover */}
        {album.cover_url && (
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
              source={{ uri: album.cover_url }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          </Box>
        )}

        {/* Content Section */}
        <VStack space="md" px="$2">
          {/* Completion Badge */}
          {albumCompleted && (
            <Badge
              variant={userAlbum.skipped ? "outline" : "solid"}
              action={userAlbum.skipped ? "muted" : "success"}
              alignSelf="flex-start"
              borderRadius="$md"
            >
              <BadgeText>
                {userAlbum.skipped ? "Skipped" : `Rated ${userAlbum.rating}★`}
              </BadgeText>
            </Badge>
          )}

          {/* Title & Artist */}
          <VStack space="xs">
            <Heading size="xl" color="$gray900" lineHeight="$2xl">
              {album.title}
            </Heading>
            <Text size="md" color="$gray600">
              {album.artist}
            </Text>
          </VStack>

          {/* Badges */}
          <HStack space="sm" flexWrap="wrap">
            <Badge variant="outline" borderRadius="$sm" size="sm">
              <BadgeText fontSize="$xs">{album.year}</BadgeText>
            </Badge>
            {album.genre && (
              <Badge variant="outline" borderRadius="$sm" size="sm">
                <BadgeText fontSize="$xs">{album.genre}</BadgeText>
              </Badge>
            )}
          </HStack>

          {/* Spotify Link */}
          {album.spotify_id && (
            <Pressable
              onPress={() =>
                Linking.openURL(
                  `https://open.spotify.com/album/${album.spotify_id}`,
                )
              }
            >
              <Text size="sm" color="$primary600" fontWeight="$medium">
                Listen on Spotify →
              </Text>
            </Pressable>
          )}
        </VStack>

        {/* Actions */}
        {!albumCompleted && (
          <HStack space="sm" mt="$6">
            <CompleteButton
              type="album"
              itemId={album.id}
              userId={userId}
              onComplete={onUpdate}
            />
            <SkipButton
              type="album"
              itemId={album.id}
              userId={userId}
              onSkip={onUpdate}
            />
          </HStack>
        )}
      </VStack>
    </Card>
  );
});
