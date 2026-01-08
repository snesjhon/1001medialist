import { VStack, HStack, Text, Card, Box } from "@gluestack-ui/themed";

interface DecadeBreakdownProps {
  title: string;
  data: Record<string, number>;
  color?: string;
}

export function DecadeBreakdown({ title, data, color = "$blue500" }: DecadeBreakdownProps) {
  const decades = Object.keys(data).sort();
  const maxCount = Math.max(...Object.values(data), 1);

  if (decades.length === 0) {
    return (
      <Card size="md" variant="elevated" bg="$white" borderRadius="$lg" p="$4">
        <Text size="xs" color="$gray600" fontWeight="$semibold" textTransform="uppercase" mb="$3">
          {title}
        </Text>
        <Text size="sm" color="$gray500">
          No data yet
        </Text>
      </Card>
    );
  }

  return (
    <Card size="md" variant="elevated" bg="$white" borderRadius="$lg" p="$4">
      <Text size="xs" color="$gray600" fontWeight="$semibold" textTransform="uppercase" mb="$4">
        {title}
      </Text>
      <VStack space="md">
        {decades.map((decade) => {
          const count = data[decade];
          const percentage = (count / maxCount) * 100;

          return (
            <VStack key={decade} space="xs">
              <HStack justifyContent="space-between" alignItems="center">
                <Text size="sm" color="$gray900" fontWeight="$medium">
                  {decade}
                </Text>
                <Text size="sm" color="$gray600">
                  {count}
                </Text>
              </HStack>
              <Box width="$full" height={8} bg="$gray200" borderRadius="$full" overflow="hidden">
                <Box
                  width={`${percentage}%`}
                  height="$full"
                  bg={color}
                  borderRadius="$full"
                />
              </Box>
            </VStack>
          );
        })}
      </VStack>
    </Card>
  );
}
