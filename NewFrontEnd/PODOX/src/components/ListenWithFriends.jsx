import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaPlus, FaCopy } from 'react-icons/fa';
import { ref, set, onValue, push, serverTimestamp, off } from 'firebase/database';
import { database } from '../firebase';

const ListenWithFriends = ({
  currentTrack,
  isPlaying,
  onTrackChange,
  onPlayPause,
  onSeek,
  roomCode,
  setRoomCode,
  audioRef,
  userCount
}) => {
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const createRoom = useCallback(() => {
    if (!currentTrack) {
      alert("Please select a track before creating a room.");
      return;
    }
    const roomRef = push(ref(database, 'rooms'));
    const newRoomCode = roomRef.key;
    set(roomRef, {
      currentTrack,
      controls: {
        isPlaying: isPlaying,
      },
      users: 1,
      lastUpdated: serverTimestamp()
    }).then(() => {
      setRoomCode(newRoomCode);
      console.log("Room created with code:", newRoomCode);
    }).catch((error) => {
      console.error("Error creating room:", error);
      alert("Failed to create room. Please try again.");
    });
  }, [currentTrack, isPlaying, setRoomCode]);

  const joinRoom = useCallback((code) => {
    if (!code) {
      alert("Please enter a room code.");
      return;
    }
    const roomRef = ref(database, `rooms/${code}`);
    onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        setRoomCode(code);
        const roomData = snapshot.val();
        set(roomRef, {
          ...roomData,
          users: (roomData.users || 0) + 1,
          lastUpdated: serverTimestamp()
        });
      } else {
        alert("Room not found!");
      }
    }, { onlyOnce: true });
  }, [setRoomCode]);

  const leaveRoom = useCallback(() => {
    if (roomCode) {
      const roomRef = ref(database, `rooms/${roomCode}`);
      onValue(roomRef, (snapshot) => {
        if (snapshot.exists()) {
          const roomData = snapshot.val();
          const newUserCount = Math.max((roomData.users || 1) - 1, 0);
          if (newUserCount === 0) {
            set(roomRef, null);
          } else {
            set(roomRef, {
              ...roomData,
              users: newUserCount,
              lastUpdated: serverTimestamp()
            });
          }
        }
      }, { onlyOnce: true });
      setRoomCode('');
    }
  }, [roomCode, setRoomCode]);

  const copyRoomCode = useCallback(() => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  }, [roomCode]);

  useEffect(() => {
    return () => {
      leaveRoom();
    };
  }, [leaveRoom]);

  return (
    <motion.div 
      className="w-full bg-gray-800 bg-opacity-75 p-4 rounded-xl backdrop-filter backdrop-blur-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <motion.h2 
          className="text-xl md:text-2xl font-bold text-blue-300 mb-2 md:mb-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Listen with Friends
        </motion.h2>
        {roomCode ? (
          <div className="flex items-center">
            <span className="mr-2">Room: {roomCode}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyRoomCode}
              className="bg-blue-500 text-white px-2 py-1 rounded-full flex items-center hover:bg-blue-600 transition-colors"
            >
              <FaCopy className="mr-1" />
              {copySuccess ? 'Copied!' : 'Copy'}
            </motion.button>
            <span className="ml-4">Users in room: {userCount}</span>
          </div>
        ) : (
          <div className="flex items-center">
            <motion.button 
              className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center hover:bg-blue-600 transition-colors mr-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={createRoom}
              disabled={!currentTrack}
            >
              <FaPlus className="mr-2" />
              Create Room
            </motion.button>
            <input
              type="text"
              placeholder="Room Code"
              value={joinRoomCode}
              onChange={(e) => setJoinRoomCode(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-l-full"
            />
            <motion.button 
              className="bg-blue-500 text-white px-4 py-2 rounded-r-full flex items-center hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => joinRoom(joinRoomCode)}
            >
              Join
            </motion.button>
          </div>
        )}
      </div>
      <motion.div 
        className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-700 rounded-full flex items-center justify-center">
          <FaUsers size={32} className="text-blue-300" />
        </div>
        <div className="text-center md:text-left">
          <h3 className="font-semibold text-lg md:text-xl">{currentTrack?.title || 'No track playing'}</h3>
          <p className="text-sm text-gray-300">{currentTrack?.artist || 'Unknown artist'}</p>
          <p className="text-sm text-gray-400">{isPlaying ? 'Playing' : 'Paused'}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(ListenWithFriends);

