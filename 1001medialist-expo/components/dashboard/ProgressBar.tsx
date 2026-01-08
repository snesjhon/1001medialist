import {
  Card,
  VStack,
  HStack,
  Heading,
  Text,
  Progress,
  ProgressFilledTrack,
  Divider
} from '@gluestack-ui/themed';

interface ProgressBarProps {
  albumsCompleted: number;
  moviesCompleted: number;
  currentPairNumber: number;
}

export function ProgressBar({
  albumsCompleted,
  moviesCompleted,
  currentPairNumber,
}: ProgressBarProps) {
  const totalCompleted = albumsCompleted + moviesCompleted;
  const totalItems = 2002; // 1001 albums + 1001 movies
  const progressPercent = (totalCompleted / totalItems) * 100;

  return (
    <Card size="lg" variant="elevated" bg="$white" p="$8" borderRadius="$xl">
      <VStack space="xl">
        <Heading size="lg">Your Progress</Heading>

        <VStack space="sm">
          <HStack justifyContent="space-between">
            <Text size="sm" color="$gray600">
              Overall Progress
            </Text>
            <Text size="sm" fontWeight="$semibold">
              {totalCompleted} / {totalItems} ({progressPercent.toFixed(1)}%)
            </Text>
          </HStack>
          <Progress value={progressPercent} size="sm" h={8}>
            <ProgressFilledTrack bg="$primary600" />
          </Progress>
        </VStack>

        <HStack space="lg" pt="$2">
          <VStack space="xs" flex={1}>
            <Text size="sm" color="$gray600">
              Albums
            </Text>
            <Text size="2xl" fontWeight="$bold">
              {albumsCompleted}
            </Text>
            <Text size="xs" color="$gray500">
              / 1001
            </Text>
          </VStack>
          <VStack space="xs" flex={1}>
            <Text size="sm" color="$gray600">
              Movies
            </Text>
            <Text size="2xl" fontWeight="$bold">
              {moviesCompleted}
            </Text>
            <Text size="xs" color="$gray500">
              / 1001
            </Text>
          </VStack>
        </HStack>

        <Divider my="$2" />

        <VStack space="xs">
          <Text size="sm" color="$gray600">
            Current Pair
          </Text>
          <Text size="xl" fontWeight="$semibold">
            #{currentPairNumber}
          </Text>
        </VStack>
      </VStack>
    </Card>
  );
}
