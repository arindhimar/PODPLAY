import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, UserPlus, Music } from 'lucide-react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const ListenWithFriends = ({ currentTrack, isPlaying, onPlayPause, onSeek }) => {
  const [roomCode, setRoomCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('room_joined', handleRoomJoined);
    socket.on('track_updated', handleTrackUpdated);
    socket.on('play_pause_updated', handlePlayPauseUpdated);
    socket.on('seek_updated', handleSeekUpdated);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('room_joined');
      socket.off('track_updated');
      socket.off('play_pause_updated');
      socket.off('seek_updated');
    };
  }, []);

  const createRoom = async () => {
    const response = await fetch('http://localhost:5000/sync/create_room', { method: 'POST' });
    const data = await response.json();
    setRoomCode(data.room_code);
    setIsHost(true);
    socket.emit('join', { room_code: data.room_code });
  };

  const joinRoom = () => {
    socket.emit('join', { room_code: roomCode });
  };

  const handleRoomJoined = (data) => {
    setRoomCode(data.room_code);
    setIsConnected(true);
  };

  const handleTrackUpdated = (track) => {
    // Update the current track in your main component
    // You'll need to lift this state up to the parent component
    // and pass it down as a prop
  };

  const handlePlayPauseUpdated = (data) => {
    onPlayPause(data.is_playing);
  };

  const handleSeekUpdated = (data) => {
    onSeek(data.current_time);
  };

  useEffect(() => {
    if (isConnected && currentTrack) {
      socket.emit('update_track', { room_code: roomCode, track: currentTrack });
    }
  }, [currentTrack, isConnected, roomCode]);

  useEffect(() => {
    if (isConnected) {
      socket.emit('play_pause', { room_code: roomCode, is_playing: isPlaying });
    }
  }, [isPlaying, isConnected, roomCode]);

  const handleSeek = (currentTime) => {
    if (isConnected) {
      socket.emit('seek', { room_code: roomCode, current_time: currentTime });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Listen with Friends</h2>
      <div className="space-y-4">
        <Button onClick={createRoom} className="w-full" disabled={isConnected}>
          <Users className="mr-2 h-4 w-4" /> Create a Room
        </Button>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="flex-grow"
            disabled={isConnected}
          />
          <Button onClick={joinRoom} disabled={isConnected}>
            <UserPlus className="mr-2 h-4 w-4" /> Join
          </Button>
        </div>
        {isConnected && (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
            <p className="text-sm text-gray-600 dark:text-gray-300">Connected to room:</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{roomCode}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {isHost ? "You are the host. Your friends can join using this code!" : "You've joined the room successfully!"}
            </p>
          </div>
        )}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Currently Playing</h3>
          <div className="flex items-center space-x-2">
            <Music className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300">
              {currentTrack ? `${currentTrack.title} - ${currentTrack.artist}` : 'No song playing'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListenWithFriends;

