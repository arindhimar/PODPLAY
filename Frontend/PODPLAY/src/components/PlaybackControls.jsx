import React from 'react';
import { Button } from "@/components/ui/button";
import { SkipBack, SkipForward, Play, Pause } from 'lucide-react';
import styles from './HorizontalMusicPlayer.module.css';

export const PlaybackControls = ({ isPlaying, onTogglePlay, onSkipBack, onSkipForward }) => (
  <div className={styles.controls}>
    <Button variant="ghost" size="icon" className={styles.controlBtn} onClick={onSkipBack}>
      <SkipBack className="h-4 w-4" />
    </Button>
    <Button onClick={onTogglePlay} size="icon" className={`${styles.controlBtn} ${styles.playPause}`}>
      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
    </Button>
    <Button variant="ghost" size="icon" className={styles.controlBtn} onClick={onSkipForward}>
      <SkipForward className="h-4 w-4" />
    </Button>
  </div>
);

