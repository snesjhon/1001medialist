import { VStack, HStack, Text, Badge, BadgeText, Card } from "@gluestack-ui/themed";
import type { Album, Movie } from "../../lib/supabase-queries";

interface RecentCompletionsProps {
  items: Array<{
    type: 'album' | 'movie';
    item: Album | Movie;
    rating: number;
    completed_at: string;
  }>;
}

export function RecentCompletions({ items }: RecentCompletionsProps) {
  if (items.length === 0) {
    return (
      <Card size="md" variant="elevated" bg="$white" borderRadius="$lg" p="$4">
        <Text size="xs" color="$gray600" fontWeight="$semibold" textTransform="uppercase" mb="$3">
          RECENT COMPLETIONS
        </Text>
        <Text size="sm" color="$gray500">
          No completions yet
        </Text>
      </Card>
    );
  }

  return (
    <Card size="md" variant="elevated" bg="$white" borderRadius="$lg" p="$4">
      <Text size="xs" color="$gray600" fontWeight="$semibold" textTransform="uppercase" mb="$3">
        RECENT COMPLETIONS
      </Text>
      <VStack space="sm">
        {items.map((item, index) => {
          const media = item.item;
          const date = new Date(item.completed_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <HStack key={index} space="sm" alignItems="center" justifyContent="space-between">
              <VStack flex={1}>
                <HStack space="xs" alignItems="center">
                  <Badge
                    variant="outline"
                    action={item.type === 'album' ? 'info' : 'warning'}
                    borderRadius="$sm"
                    size="sm"
                  >
                    <BadgeText fontSize="$2xs">
                      {item.type === 'album' ? 'ALBUM' : 'MOVIE'}
                    </BadgeText>
                  </Badge>
                  <Text size="sm" color="$gray900" fontWeight="$medium" numberOfLines={1} flex={1}>
                    {media.title}
                  </Text>
                </HStack>
                <Text size="xs" color="$gray500">
                  {date}
                </Text>
              </VStack>
              <Badge variant="solid" action="success" borderRadius="$md" size="sm">
                <BadgeText fontSize="$xs">{item.rating}★</BadgeText>
              </Badge>
            </HStack>
          );
        })}
      </VStack>
    </Card>
  );
}
