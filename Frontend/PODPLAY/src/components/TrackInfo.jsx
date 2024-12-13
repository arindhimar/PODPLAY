import React from 'react';
import styles from './HorizontalMusicPlayer.module.css';  

export const TrackInfo = ({ track }) => (
  <div className={styles.trackInfoContainer}>
    <img src={track.image} alt={`${track.title} cover`} className={styles.coverArt} />
    <div className={styles.trackInfo}>
      <h2 className={styles.trackTitle}>{track.title}</h2>
      <p className={styles.trackArtist}>{track.artist}</p>
    </div>
  </div>
);
