import { Image, Pressable } from "react-native";
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
import type { AlbumWithUserData } from "../../lib/supabase-queries";

interface ListAlbumCardProps {
  album: AlbumWithUserData;
}

export function ListAlbumCard({ album }: ListAlbumCardProps) {
  const userAlbum = album.user_album;
  const isCompleted = userAlbum && userAlbum.completed_at;
  const isSkipped = userAlbum && userAlbum.skipped;
  const isDone = isCompleted || isSkipped;

  const handlePress = () => {
    router.push(`/media/${album.list_number}` as any);
  };

  return (
    <Pressable onPress={handlePress}>
      <Card
        size="md"
        variant="elevated"
        bg="$white"
        borderRadius="$lg"
        opacity={isDone ? 0.7 : 1}
        p="$0"
        overflow="hidden"
      >
        <VStack space="sm">
          {/* Album Cover */}
          <Box
            w="$full"
            aspectRatio={1}
            bg="$gray100"
            position="relative"
            overflow="hidden"
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
                <Text size="sm" color="$gray500">
                  No Image
                </Text>
              </Box>
            )}

            {/* Status Badge Overlay */}
            {isDone && (
              <Box position="absolute" top="$2" right="$2">
                <Badge
                  variant="solid"
                  action={isSkipped ? "muted" : "success"}
                  borderRadius="$md"
                  size="sm"
                >
                  <BadgeText fontSize="$xs">
                    {isSkipped ? "Skipped" : `${userAlbum.rating}★`}
                  </BadgeText>
                </Badge>
              </Box>
            )}

            {/* List Number Badge */}
            <Box position="absolute" bottom="$2" left="$2">
              <Badge
                variant="solid"
                action="info"
                borderRadius="$md"
                size="sm"
                bg="$black"
                opacity={0.7}
              >
                <BadgeText fontSize="$xs" color="$white">
                  #{album.list_number}
                </BadgeText>
              </Badge>
            </Box>
          </Box>

          {/* Content Section */}
          <VStack space="xs" px="$3" pb="$3">
            <Heading
              size="sm"
              color="$gray900"
              numberOfLines={2}
              lineHeight="$sm"
            >
              {album.title}
            </Heading>
            <Text size="xs" color="$gray600" numberOfLines={1}>
              {album.artist}
            </Text>

            {/* Year Badge */}
            <HStack space="xs" mt="$1">
              <Badge variant="outline" borderRadius="$sm" size="sm">
                <BadgeText fontSize="$2xs">{album.year}</BadgeText>
              </Badge>
              {album.genre && (
                <Badge variant="outline" borderRadius="$sm" size="sm">
                  <BadgeText fontSize="$2xs" numberOfLines={1}>
                    {album.genre}
                  </BadgeText>
                </Badge>
              )}
            </HStack>
          </VStack>
        </VStack>
      </Card>
    </Pressable>
  );
}
