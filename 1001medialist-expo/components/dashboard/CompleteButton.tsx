import { useState } from 'react';
import {
  Button,
  ButtonText,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Heading,
  Text,
  VStack,
  HStack,
  Textarea,
  TextareaInput,
  Pressable,
  Icon,
} from '@gluestack-ui/themed';
import { Star } from 'lucide-react-native';
import { completeAlbum, completeMovie } from '../../lib/supabase-queries';

interface CompleteButtonProps {
  type: 'album' | 'movie';
  itemId: string;
  userId: string;
  onComplete?: () => void;
}

export function CompleteButton({ type, itemId, userId, onComplete }: CompleteButtonProps) {
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      if (type === 'album') {
        await completeAlbum(userId, itemId, rating, notes);
      } else {
        await completeMovie(userId, itemId, rating, notes);
      }
      setVisible(false);
      setRating(0);
      setNotes('');
      onComplete?.();
    } catch (error) {
      console.error('Error completing:', error);
      alert('Failed to complete. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onPress={() => setVisible(true)}
        flex={1}
        bg="$primary600"
        borderRadius="$md"
        $active-bg="$primary700"
        size="xl"
      >
        <ButtonText fontWeight="$semibold">Complete</ButtonText>
      </Button>

      <Modal isOpen={visible} onClose={() => setVisible(false)}>
        <ModalBackdrop />
        <ModalContent bg="$white" borderRadius="$2xl" maxWidth={512}>
          <ModalHeader>
            <Heading size="lg">Rate this {type}</Heading>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <VStack space="lg">
              <VStack space="sm">
                <Text size="sm" fontWeight="$semibold" color="$gray700">
                  Rating
                </Text>
                <HStack space="sm">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Pressable
                      key={star}
                      onPress={() => setRating(star)}
                    >
                      <Icon
                        as={Star}
                        size="xl"
                        fill={star <= rating ? '$rating' : 'transparent'}
                        color={star <= rating ? '$rating' : '$gray300'}
                      />
                    </Pressable>
                  ))}
                </HStack>
              </VStack>

              <VStack space="sm">
                <Text size="sm" fontWeight="$semibold" color="$gray700">
                  Notes (optional)
                </Text>
                <Textarea borderRadius="$lg">
                  <TextareaInput
                    placeholder="Add your thoughts..."
                    value={notes}
                    onChangeText={setNotes}
                  />
                </Textarea>
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack space="md">
              <Button
                variant="outline"
                onPress={() => setVisible(false)}
                borderRadius="$lg"
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                onPress={handleSubmit}
                isDisabled={rating === 0 || isSubmitting}
                bg="$primary600"
                borderRadius="$lg"
                $active-bg="$primary700"
              >
                <ButtonText>{isSubmitting ? 'Saving...' : 'Save Rating'}</ButtonText>
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
