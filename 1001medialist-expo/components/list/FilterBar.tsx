import {
  HStack,
  VStack,
  Button,
  ButtonText,
  Text,
  Box,
} from "@gluestack-ui/themed";
import { ScrollView } from "react-native";

export type FilterType =
  | "all"
  | "both-completed"
  | "in-progress"
  | "pending"
  | "has-skipped";
export type SortType = "number" | "year" | "album-title";

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  activeSort: SortType;
  onSortChange: (sort: SortType) => void;
  totalCount: number;
  filteredCount: number;
}

export function FilterBar({
  activeFilter,
  onFilterChange,
  activeSort,
  onSortChange,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pending", label: "Not Started" },
    { value: "in-progress", label: "In Progress" },
    { value: "both-completed", label: "Both Done" },
    { value: "has-skipped", label: "Has Skipped" },
  ];

  const sorts: { value: SortType; label: string }[] = [
    { value: "number", label: "Number" },
    { value: "year", label: "Album Year" },
    { value: "album-title", label: "Album Title" },
  ];

  return (
    <VStack space="md" py="$4">
      {/* Filter Buttons */}
      <VStack space="xs">
        <Text size="xs" color="$gray600" fontWeight="$semibold" px="$1">
          FILTER BY STATUS
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {filters.map((filter) => (
            <Button
              key={filter.value}
              size="sm"
              variant={activeFilter === filter.value ? "solid" : "outline"}
              action={activeFilter === filter.value ? "primary" : "secondary"}
              onPress={() => onFilterChange(filter.value)}
              borderRadius="$full"
            >
              <ButtonText>{filter.label}</ButtonText>
            </Button>
          ))}
        </ScrollView>
      </VStack>

      {/* Sort Buttons */}
      <VStack space="xs">
        <Text size="xs" color="$gray600" fontWeight="$semibold" px="$1">
          SORT BY
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {sorts.map((sort) => (
            <Button
              key={sort.value}
              size="sm"
              variant={activeSort === sort.value ? "solid" : "outline"}
              action={activeSort === sort.value ? "primary" : "secondary"}
              onPress={() => onSortChange(sort.value)}
              borderRadius="$full"
            >
              <ButtonText>{sort.label}</ButtonText>
            </Button>
          ))}
        </ScrollView>
      </VStack>

      {/* Count Display */}
      <Box px="$1">
        <Text size="xs" color="$gray500">
          Showing {filteredCount} of {totalCount} pairs
        </Text>
      </Box>
    </VStack>
  );
}
