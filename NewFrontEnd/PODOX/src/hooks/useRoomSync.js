import { useCallback } from 'react';
import { ref, onValue, set, serverTimestamp, off } from 'firebase/database';
import { database } from '../firebase';

const useRoomSync = (roomCode, audioRef) => {
  const updateRoom = useCallback((track = null, isPlaying = null, currentTime = null, additionalControls = {}) => {
    if (roomCode) {
      const roomRef = ref(database, `rooms/${roomCode}`);
      const updateData = {};

      if (track) updateData.currentTrack = track;
      if (isPlaying !== null) updateData.controls = { ...updateData.controls, isPlaying };
      if (currentTime !== null) updateData.controls = { ...updateData.controls, currentTime };
      if (Object.keys(additionalControls).length > 0) {
        updateData.controls = { ...updateData.controls, ...additionalControls };
      }

      updateData.lastUpdated = serverTimestamp();

      set(roomRef, updateData);
    }
  }, [roomCode]);

  const syncWithRoom = useCallback((callback) => {
    if (roomCode) {
      const roomRef = ref(database, `rooms/${roomCode}`);
      const handleRoomUpdate = (snapshot) => {
        const data = snapshot.val();
        if (data) {
          callback(data);

          if (data.currentTrack && audioRef.current) {
            audioRef.current.src = data.currentTrack.audio_url;
            if (data.controls) {
              if (data.controls.currentTime !== undefined) {
                audioRef.current.currentTime = data.controls.currentTime;
              }
              if (data.controls.isPlaying) {
                audioRef.current.play().catch(error => console.error("Playback failed", error));
              } else {
                audioRef.current.pause();
              }
            }
          }
        }
      };

      onValue(roomRef, handleRoomUpdate);

      return () => off(roomRef, 'value', handleRoomUpdate);
    }
    return () => {};
  }, [roomCode]);

  return { updateRoom, syncWithRoom };
};

export default useRoomSync;

