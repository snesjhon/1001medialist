import { VStack, HStack, Text, Badge, BadgeText, Card } from "@gluestack-ui/themed";
import type { Album, Movie } from "../../lib/supabase-queries";

interface TopRatedListProps {
  title: string;
  items: Array<{ album?: Album; movie?: Movie; rating: number }>;
  type: 'album' | 'movie';
}

export function TopRatedList({ title, items, type }: TopRatedListProps) {
  if (items.length === 0) {
    return (
      <Card size="md" variant="elevated" bg="$white" borderRadius="$lg" p="$4">
        <Text size="xs" color="$gray600" fontWeight="$semibold" textTransform="uppercase" mb="$3">
          {title}
        </Text>
        <Text size="sm" color="$gray500">
          No {type}s rated yet
        </Text>
      </Card>
    );
  }

  return (
    <Card size="md" variant="elevated" bg="$white" borderRadius="$lg" p="$4">
      <Text size="xs" color="$gray600" fontWeight="$semibold" textTransform="uppercase" mb="$3">
        {title}
      </Text>
      <VStack space="sm">
        {items.map((item, index) => {
          const media = type === 'album' ? item.album : item.movie;
          if (!media) return null;

          return (
            <HStack key={index} space="sm" alignItems="center" justifyContent="space-between">
              <VStack flex={1}>
                <Text size="sm" color="$gray900" fontWeight="$medium" numberOfLines={1}>
                  {media.title}
                </Text>
                <Text size="xs" color="$gray600" numberOfLines={1}>
                  {type === 'album' ? (media as Album).artist : (media as Movie).director}
                </Text>
              </VStack>
              <Badge variant="solid" action="success" borderRadius="$md" size="sm">
                <BadgeText fontSize="$sm">{item.rating}★</BadgeText>
              </Badge>
            </HStack>
          );
        })}
      </VStack>
    </Card>
  );
}
