import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX } from 'lucide-react';
import styles from './HorizontalMusicPlayer.module.css';

export const VolumeControl = ({ volume, isMuted, onVolumeChange, onToggleMute }) => (
  <div className={styles.volumeControl}>
    <Button variant="ghost" size="icon" onClick={onToggleMute} className={styles.volumeBtn}>
      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </Button>
    <Slider
      value={[volume]}
      max={1}
      step={0.01}
      className={styles.volumeSlider}
      onValueChange={(value) => onVolumeChange(value[0])}
    />
  </div>
);

