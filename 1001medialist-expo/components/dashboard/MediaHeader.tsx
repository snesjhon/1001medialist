import { memo } from "react";
import { HStack, Button, ButtonIcon, Text } from "@gluestack-ui/themed";
import { router } from "expo-router";
import { Home, Shuffle, ChevronLeft, ChevronRight } from "lucide-react-native";

interface MediaHeaderProps {
  currentPairNumber: number;
  isOnDashboard?: boolean;
}

export const MediaHeader = memo(function MediaHeader({
  currentPairNumber,
  isOnDashboard = false,
}: MediaHeaderProps) {
  const hasPrevious = currentPairNumber > 1;
  const hasNext = currentPairNumber < 1001;

  const handleRandom = () => {
    const randomPair = Math.floor(Math.random() * 1001) + 1;
    router.push(`/(app)/media/${randomPair}`);
  };

  const handlePrevious = () => {
    if (hasPrevious) {
      router.push(`/(app)/media/${currentPairNumber - 1}`);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      router.push(`/(app)/media/${currentPairNumber + 1}`);
    }
  };

  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      gap="$4"
    >
      {/* Left group: Home, Random */}
      <HStack space="md">
        <Button
          variant="outline"
          size="sm"
          isDisabled={isOnDashboard}
          onPress={() => router.push("/(app)/dashboard")}
          borderRadius="$md"
          borderWidth={1.5}
          borderColor="$gray300"
        >
          <ButtonIcon as={Home} color="$gray700" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onPress={handleRandom}
          borderRadius="$md"
          borderWidth={1.5}
          borderColor="$gray300"
        >
          <ButtonIcon as={Shuffle} color="$gray700" />
        </Button>
      </HStack>

      {/* Right group: Previous, Number, Next */}
      <HStack space="md" alignItems="center">
        <Button
          variant="outline"
          size="sm"
          isDisabled={!hasPrevious}
          onPress={handlePrevious}
          borderRadius="$md"
          borderWidth={1.5}
          borderColor="$gray300"
        >
          <ButtonIcon
            as={ChevronLeft}
            color={hasPrevious ? "$gray700" : "$gray400"}
          />
        </Button>

        <Text size="2xl" fontWeight="$bold" px="$6" color="$gray900">
          {currentPairNumber}/1001
        </Text>

        <Button
          variant="outline"
          size="sm"
          isDisabled={!hasNext}
          onPress={handleNext}
          borderRadius="$md"
          borderWidth={1.5}
          borderColor="$gray300"
        >
          <ButtonIcon
            as={ChevronRight}
            color={hasNext ? "$gray700" : "$gray400"}
          />
        </Button>
      </HStack>
    </HStack>
  );
});
