import { useEffect, useRef, useCallback } from 'react';

export function useAudio(heartRate: number, breathingRate: number, isPaused: boolean) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const heartbeatIntervalRef = useRef<number>(0);
  const breathIntervalRef = useRef<number>(0);
  const heartbeatGainRef = useRef<GainNode | null>(null);
  const breathGainRef = useRef<GainNode | null>(null);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
      
      // Heartbeat gain
      heartbeatGainRef.current = audioCtxRef.current.createGain();
      heartbeatGainRef.current.gain.value = 0.15;
      heartbeatGainRef.current.connect(audioCtxRef.current.destination);
      
      // Breath gain
      breathGainRef.current = audioCtxRef.current.createGain();
      breathGainRef.current.gain.value = 0.05;
      breathGainRef.current.connect(audioCtxRef.current.destination);
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const playHeartbeat = useCallback(() => {
    if (!audioCtxRef.current || !heartbeatGainRef.current) return;
    const ctx = audioCtxRef.current;
    const gain = heartbeatGainRef.current;
    
    // Two thumps (lub-dub)
    const now = ctx.currentTime;
    
    // Lub
    const osc1 = ctx.createOscillator();
    const env1 = ctx.createGain();
    osc1.frequency.value = 60;
    osc1.type = 'sine';
    env1.gain.setValueAtTime(0.3, now);
    env1.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc1.connect(env1);
    env1.connect(gain);
    osc1.start(now);
    osc1.stop(now + 0.1);
    
    // Dub
    const osc2 = ctx.createOscillator();
    const env2 = ctx.createGain();
    osc2.frequency.value = 45;
    osc2.type = 'sine';
    env2.gain.setValueAtTime(0.2, now + 0.12);
    env2.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
    osc2.connect(env2);
    env2.connect(gain);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.22);
  }, []);

  const playBreath = useCallback(() => {
    if (!audioCtxRef.current || !breathGainRef.current) return;
    const ctx = audioCtxRef.current;
    const gain = breathGainRef.current;
    
    // White noise breath
    const bufferSize = ctx.sampleRate * 0.8;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    
    const env = ctx.createGain();
    const now = ctx.currentTime;
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(0.15, now + 0.3);
    env.gain.linearRampToValueAtTime(0, now + 0.8);
    
    source.connect(filter);
    filter.connect(env);
    env.connect(gain);
    source.start(now);
    source.stop(now + 0.8);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    
    // Heartbeat interval
    const hbInterval = (60 / heartRate) * 1000;
    if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
    heartbeatIntervalRef.current = window.setInterval(() => {
      playHeartbeat();
    }, hbInterval);

    // Breathing interval
    const brInterval = (60 / breathingRate) * 1000;
    if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
    breathIntervalRef.current = window.setInterval(() => {
      playBreath();
    }, brInterval);

    return () => {
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
    };
  }, [heartRate, breathingRate, isPaused, playHeartbeat, playBreath]);

  return { initAudio };
}
