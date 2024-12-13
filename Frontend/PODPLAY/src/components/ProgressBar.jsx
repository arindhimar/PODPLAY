import React from 'react';
import { Slider } from "@/components/ui/slider";
import styles from './HorizontalMusicPlayer.module.css';

export const ProgressBar = ({ currentTime, duration, onProgressChange }) => {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.progressContainer}>
      <Slider
        value={[currentTime]}
        max={duration}
        step={1}
        onValueChange={(value) => onProgressChange(value[0])}
        className={styles.progressSlider}
      />
      <div className={styles.timeDisplay}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

