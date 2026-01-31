import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';
import Webcam from 'react-webcam';
import './App.css';
import { drawRect } from './utilities';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Main function
  const runCoco = async () => {
    try {
      console.log("Loading COCO-SSD model...");
      const net = await cocossd.load();
      console.log("COCO-SSD model loaded successfully!");
      setIsLoading(false);
      setModelLoaded(true);

      // Loop and detect
      setInterval(() => {
        detect(net);
      }, 100); // 10 FPS for smoother performance
    } catch (err) {
      console.error("Failed to load COCO-SSD model:", err);
      setIsLoading(false);
    }
  };

  const detect = async (net) => {
    // Check data is available
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

      // Make Detections using COCO-SSD
      const predictions = await net.detect(video);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      // Clear canvas before drawing new frame
      ctx.clearRect(0, 0, videoWidth, videoHeight);

      // Visualize detections
      drawRect(predictions, ctx);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { runCoco() }, []);

  return (
    <div className="App">
      <header className="App-header">
        {isLoading && (
          <div style={{
            position: 'absolute',
            zIndex: 20,
            color: 'white',
            fontSize: '24px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '20px',
            borderRadius: '10px'
          }}>
            Loading COCO-SSD Model...
          </div>
        )}

        {modelLoaded && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 20,
            color: 'lime',
            fontSize: '14px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: '5px 10px',
            borderRadius: '5px'
          }}>
            ✓ Model Loaded - Detecting Objects
          </div>
        )}

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
            zIndex: 9,
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
            zIndex: 10,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
