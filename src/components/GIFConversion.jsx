import React, { useState, useEffect} from 'react';
import './GIFConversion.scss';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

const GIFConversion = () => {
    const [ready, setReady] = useState(false);
    const [video, setVideo] = useState();
    const [gif, setGif] = useState();
    const [time, setTime] = useState(0);
    const [startingSeconds, setStartingSeconds] = useState(0);
  
    const load = async () => {
      await ffmpeg.load();
      setReady(true);
    }

    const handleSlideChange = (e) => {
        setTime(e.target.value)
    }

    const handleStartChange = (e) => {
        setStartingSeconds(e.target.value)
    }
  
    useEffect(() => {
      load();
    }, [])
  
    const convertToGif = async () => {
      // Write the file to memory 
      ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
  
      // Run the FFMpeg command
      await ffmpeg.run('-i', 'test.mp4', '-t', time, '-ss', startingSeconds, '-f', 'gif', 'out.gif');
  
      // Read the result
      const data = ffmpeg.FS('readFile', 'out.gif');
  
      // Create a URL
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
      setGif(url)
    }
  
    return ready ? (
      <div className="convertor-container">
        <div className="convertor-video">
            {video ? video && <video
            controls
            width="250"
            src={URL.createObjectURL(video)}>
            </video> : <div className="convertor-video-empty">Select a video file</div>}
            <input aria-label="video file select" type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
        </div>
        <div className="convertor-controls">
            <span><label htmlFor="starting-slider">Start: </label>{startingSeconds + ' secs'}</span>
            <input 
                aria-label="time-slider" 
                id="starting-slider"
                type="range" 
                className="convertor-controls-slider" 
                min={0} 
                max={10}
                step={0.1}
                value={startingSeconds}
                onChange={handleStartChange} 
            />
            <span><label htmlFor="time-slider">Time: </label>{time + ' secs'}</span>
            <input 
                aria-label="time-slider" 
                id="time-slider"
                type="range" 
                className="convertor-controls-slider" 
                min={0} 
                max={10}
                step={0.1}
                value={time}
                onChange={handleSlideChange} 
            />
            <button className="convertor-controls-btn" onClick={convertToGif}>Convert</button>
        </div>
        <div className="convertor-gif">
            <h3>Result</h3>
            {gif ? gif && <img src={gif} alt="" width="250" /> : <div className="convertor-gif-empty">Here be GIF...</div>}
        </div>
      </div>
    ) : (<p>Loading...</p>);
};

export default GIFConversion;