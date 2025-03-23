import { useEffect, useRef, useState } from "react";

const useAudioAnalyzer = () => {
    const [audioData, setAudioData] = useState({ volume: 0, frequency: 0 });
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const sourceRef = useRef(null);
    const rafIdRef = useRef(null);
  
    useEffect(() => {
      const initAudio = async () => {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          
          if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
          }
          
          await audioContextRef.current.resume();  
          
          if (!analyserRef.current) {
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
          }
          
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          if (!sourceRef.current) {
            sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
            sourceRef.current.connect(analyserRef.current);
          }
  
          const analyzeAudio = () => {
            if (!analyserRef.current) return;
            
            analyserRef.current.getByteFrequencyData(dataArrayRef.current);
            console.log("Audio Data:", dataArrayRef.current); 
            let sum = dataArrayRef.current.reduce((acc, val) => acc + val, 0);
            const avgVolume = sum / dataArrayRef.current.length / 255;
  
            let maxIndex = dataArrayRef.current.indexOf(Math.max(...dataArrayRef.current));
            const dominantFrequency = maxIndex * (audioContextRef.current.sampleRate / analyserRef.current.fftSize);
  
            setAudioData({ volume: avgVolume, frequency: dominantFrequency });
  
            rafIdRef.current = requestAnimationFrame(analyzeAudio);
          };
  
          analyzeAudio();
        } catch (error) {
          console.error("Error accessing microphone:", error);
        }
      };
  
      initAudio();
  
      return () => {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        if (sourceRef.current) sourceRef.current.disconnect();
      };
    }, []);
  
    return audioData;
  };

  export function voiceTracking(){
    const voice = useAudioAnalyzer();
  }