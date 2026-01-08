import { Card, VStack, Heading, Text } from "@gluestack-ui/themed";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export function StatCard({ title, value, subtitle, color = "$blue500" }: StatCardProps) {
  return (
    <Card size="md" variant="elevated" bg="$white" borderRadius="$lg" p="$4">
      <VStack space="xs">
        <Text size="xs" color="$gray600" fontWeight="$semibold" textTransform="uppercase">
          {title}
        </Text>
        <Heading size="2xl" color={color}>
          {value}
        </Heading>
        {subtitle && (
          <Text size="sm" color="$gray500">
            {subtitle}
          </Text>
        )}
      </VStack>
    </Card>
  );
}
