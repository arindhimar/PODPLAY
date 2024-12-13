import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Repeat, Shuffle } from 'lucide-react';
import styles from './HorizontalMusicPlayer.module.css';

export const ExtraControls = ({ onShuffle }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);

  const toggleLike = () => setIsLiked(!isLiked);
  const toggleRepeat = () => setIsRepeat(!isRepeat);
  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
    onShuffle(!isShuffled);
  };

  return (
    <div className={styles.extraControls}>
      <Button variant="ghost" size="icon" onClick={toggleLike} className={styles.controlBtn}>
        <Heart className={`h-4 w-4 ${isLiked ? 'text-red-500' : 'text-gray-500'}`} />
      </Button>
      <Button variant="ghost" size="icon" onClick={toggleRepeat} className={styles.controlBtn}>
        <Repeat className={`h-4 w-4 ${isRepeat ? 'text-blue-500' : 'text-gray-500'}`} />
      </Button>
      <Button variant="ghost" size="icon" onClick={toggleShuffle} className={styles.controlBtn}>
        <Shuffle className={`h-4 w-4 ${isShuffled ? 'text-green-500' : 'text-gray-500'}`} />
      </Button>
    </div>
  );
};

