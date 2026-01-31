import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import * as cocossd from '@tensorflow-models/coco-ssd';
import * as fp from 'fingerpose';
import Webcam from 'react-webcam';
import './App.css';
import { drawHand, drawRect } from './utilities';
import { loveGesture, thumbsUpGesture, victoryGesture, helloGesture, okGesture } from './HandGestures';
import logo from './logo.png'; // Import the logo

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // State
  const [mode, setMode] = useState('none'); // 'none', 'handpose', 'cocossd'
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emoji, setEmoji] = useState(null);

  // References to stop loops
  const requestRef = useRef();

  // Load Model based on mode
  useEffect(() => {
    async function loadSelectedModel() {
      // Clear previous model/loop
      if (requestRef.current) {
        clearInterval(requestRef.current);
        requestRef.current = null;
      }
      setModel(null);
      setEmoji(null);

      // Clear canvas
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }

      if (mode === 'none') return;

      setLoading(true);
      try {
        console.log(`Loading ${mode} model...`);

        // Explicit backend set for stability
        await tf.setBackend('webgl');

        let loadedModel;
        if (mode === 'handpose') {
          loadedModel = await handpose.load();
        } else if (mode === 'cocossd') {
          loadedModel = await cocossd.load();
        }

        console.log(`${mode} model loaded.`);
        setModel(loadedModel);
        setLoading(false);

        // Start Loop
        requestRef.current = setInterval(() => {
          detect(loadedModel);
        }, 100);

      } catch (err) {
        console.error("Model load failed", err);
        setLoading(false);
        alert(`Failed to load ${mode} model: ${err.message}`);
      }
    }

    loadSelectedModel();

    return () => {
      if (requestRef.current) clearInterval(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);


  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const ctx = canvasRef.current.getContext("2d");

      if (mode === 'handpose') {
        const hand = await net.estimateHands(video);
        if (hand.length > 0) {
          const GE = new fp.GestureEstimator([
            thumbsUpGesture, victoryGesture, helloGesture, loveGesture, okGesture
          ]);
          const gesture = await GE.estimate(hand[0].landmarks, 7.5);
          if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
            const confidence = gesture.gestures.map((p) => p.score);
            const maxConfidence = confidence.indexOf(Math.max.apply(null, confidence));
            setEmoji(gesture.gestures[maxConfidence].name);
          } else {
            setEmoji(null);
          }
        }
        drawHand(hand, ctx);

      } else if (mode === 'cocossd') {
        const predictions = await net.detect(video);
        // Clear canvas for fresh draw
        ctx.clearRect(0, 0, videoWidth, videoHeight);
        drawRect(predictions, ctx);
        setEmoji(null);
      }
    }
  };

  return (
    <div className="App">
      {/* Brand Logo */}
      <img src={logo} alt="AiSign Logo" className="app-logo" />

      <header className="App-header">

        {/* Glassmorphism Control Panel */}
        <div className="control-panel">
          <button
            className={`mode-btn ${mode === 'cocossd' ? 'btn-active' : ''}`}
            onClick={() => setMode('cocossd')}
            disabled={loading}
            style={{
              backgroundColor: mode === 'cocossd' ? '#4ECDC4' : 'rgba(255,255,255,0.8)',
              color: mode === 'cocossd' ? 'white' : '#333'
            }}
          >
            🧩 Object Detection
          </button>

          <button
            className={`mode-btn ${mode === 'handpose' ? 'btn-active' : ''}`}
            onClick={() => setMode('handpose')}
            disabled={loading}
            style={{
              backgroundColor: mode === 'handpose' ? '#FFEAA7' : 'rgba(255,255,255,0.8)',
              color: mode === 'handpose' ? '#333' : '#333'
            }}
          >
            👋 Hand Gestures
          </button>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="loading-overlay">
            <div style={{ fontSize: '30px', marginBottom: '10px' }}>⚡</div>
            <h2 style={{ margin: 0, color: '#4ECDC4' }}>Loading AI...</h2>
            <p style={{ margin: '5px 0 0', opacity: 0.8, fontSize: '14px' }}>Downloading model weights</p>
          </div>
        )}

        {/* Main Content Area */}
        <div className="canvas-container">
          <Webcam
            ref={webcamRef}
            muted={true}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 9,
              width: 640,
              height: 480,
            }}
          />

          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 9,
              width: 640,
              height: 480,
            }}
          />
        </div>

        {/* Emoji Display */}
        {mode === 'handpose' && emoji !== null && (
          <div className="emoji-display">
            <span className="emoji-badge">
              {emoji === 'thumbs_up' ? '👍 YES' :
                emoji === 'victory' ? '✌️ VICTORY' :
                  emoji === 'hello' ? '👋 HELLO' :
                    emoji === 'iloveyou' ? '🤟 I LOVE YOU' :
                      emoji === 'ok' ? '👌 OK' : emoji}
            </span>
          </div>
        )}

        {/* Welcome Screen */}
        {mode === 'none' && !loading && (
          <div className="welcome-text">
            <h2>AI Vision Hub</h2>
            <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>Select a mode above to begin detection</p>
          </div>
        )}

      </header>
    </div>
  );
}

export default App;
