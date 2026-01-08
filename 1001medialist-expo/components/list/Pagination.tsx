import { HStack, Button, ButtonText, Text, Box } from "@gluestack-ui/themed";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  startIndex: number;
  endIndex: number;
  totalCount: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  totalCount,
}: PaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <Box py="$4">
      <HStack space="md" alignItems="center" justifyContent="space-between">
        {/* Info Text */}
        <Text size="sm" color="$gray600">
          Showing {startIndex}-{endIndex} of {totalCount}
        </Text>

        {/* Navigation Controls */}
        <HStack space="sm" alignItems="center">
          {/* Previous Button */}
          <Button
            size="sm"
            variant="outline"
            onPress={() => onPageChange(currentPage - 1)}
            isDisabled={!canGoPrevious}
            opacity={canGoPrevious ? 1 : 0.5}
          >
            <ChevronLeft size={16} color={canGoPrevious ? "#374151" : "#9ca3af"} />
          </Button>

          {/* Page Numbers */}
          <HStack space="xs" alignItems="center">
            {/* First page */}
            {currentPage > 3 && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => onPageChange(1)}
                  minWidth={40}
                >
                  <ButtonText>1</ButtonText>
                </Button>
                {currentPage > 4 && (
                  <Text size="sm" color="$gray500">
                    ...
                  </Text>
                )}
              </>
            )}

            {/* Page range around current */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                return (
                  page === currentPage ||
                  page === currentPage - 1 ||
                  page === currentPage + 1 ||
                  (currentPage <= 2 && page <= 3) ||
                  (currentPage >= totalPages - 1 && page >= totalPages - 2)
                );
              })
              .map((page) => (
                <Button
                  key={page}
                  size="sm"
                  variant={page === currentPage ? "solid" : "outline"}
                  action={page === currentPage ? "primary" : "secondary"}
                  onPress={() => onPageChange(page)}
                  minWidth={40}
                >
                  <ButtonText>{page}</ButtonText>
                </Button>
              ))}

            {/* Last page */}
            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && (
                  <Text size="sm" color="$gray500">
                    ...
                  </Text>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => onPageChange(totalPages)}
                  minWidth={40}
                >
                  <ButtonText>{totalPages}</ButtonText>
                </Button>
              </>
            )}
          </HStack>

          {/* Next Button */}
          <Button
            size="sm"
            variant="outline"
            onPress={() => onPageChange(currentPage + 1)}
            isDisabled={!canGoNext}
            opacity={canGoNext ? 1 : 0.5}
          >
            <ChevronRight size={16} color={canGoNext ? "#374151" : "#9ca3af"} />
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}
