import { useState } from 'react';
import { Button, ButtonText } from '@gluestack-ui/themed';
import { skipAlbum, skipMovie } from '../../lib/supabase-queries';

interface SkipButtonProps {
  type: 'album' | 'movie';
  itemId: string;
  userId: string;
  onSkip?: () => void;
}

export function SkipButton({ type, itemId, userId, onSkip }: SkipButtonProps) {
  const [isSkipping, setIsSkipping] = useState(false);

  const handleSkip = async () => {
    setIsSkipping(true);
    try {
      if (type === 'album') {
        await skipAlbum(userId, itemId);
      } else {
        await skipMovie(userId, itemId);
      }
      onSkip?.();
    } catch (error) {
      console.error('Error skipping:', error);
      alert('Failed to skip. Please try again.');
    } finally {
      setIsSkipping(false);
    }
  };

  return (
    <Button
      variant="outline"
      onPress={handleSkip}
      isDisabled={isSkipping}
      flex={1}
      borderRadius="$md"
      borderWidth={1.5}
      borderColor="$gray300"
      size="xl"
    >
      <ButtonText fontWeight="$semibold">{isSkipping ? 'Skipping...' : 'Skip'}</ButtonText>
    </Button>
  );
}
