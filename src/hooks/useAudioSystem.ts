import { useEffect, useRef } from 'react';

interface AudioSystemProps {
  heartRate: number;
  breathingRate: number;
  heartbeatEnabled: boolean;
  breathingEnabled: boolean;
  masterVolume: number;
}

export default function useAudioSystem({
  heartRate,
  breathingRate,
  heartbeatEnabled,
  breathingEnabled,
  masterVolume,
}: AudioSystemProps) {
  const heartbeatAudioRef = useRef<HTMLAudioElement | null>(null);
  const breathingAudioRef = useRef<HTMLAudioElement | null>(null);
  const heartbeatIntervalRef = useRef<number | null>(null);
  const breathingIntervalRef = useRef<number | null>(null);

  // Initialize audio elements
  useEffect(() => {
    // Create heartbeat sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Heartbeat sound - low frequency thump
    const createHeartbeatSound = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 60; // Low frequency for heartbeat
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3 * masterVolume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    };

    // Breathing sound - white noise with envelope
    const createBreathingSound = () => {
      const bufferSize = audioContext.sampleRate * 0.5;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      // Generate white noise
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      source.buffer = buffer;
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      filter.type = 'lowpass';
      filter.frequency.value = 400; // Soft breathing sound
      
      // Breathing envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1 * masterVolume, audioContext.currentTime + 0.2);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
      
      source.start(audioContext.currentTime);
    };

    // Heartbeat interval
    if (heartbeatEnabled && heartRate > 0) {
      const interval = 60000 / heartRate; // Convert BPM to milliseconds
      
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      
      heartbeatIntervalRef.current = window.setInterval(() => {
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        createHeartbeatSound();
      }, interval);
    } else if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }

    // Breathing interval
    if (breathingEnabled && breathingRate > 0) {
      const interval = 60000 / breathingRate; // Convert BrPM to milliseconds
      
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
      }
      
      breathingIntervalRef.current = window.setInterval(() => {
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        createBreathingSound();
      }, interval);
    } else if (breathingIntervalRef.current) {
      clearInterval(breathingIntervalRef.current);
      breathingIntervalRef.current = null;
    }

    // Cleanup
    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
      }
    };
  }, [heartRate, breathingRate, heartbeatEnabled, breathingEnabled, masterVolume]);

  return null;
}
