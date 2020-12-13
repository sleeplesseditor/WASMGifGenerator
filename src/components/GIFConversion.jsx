import React, { useState, useEffect} from 'react';
import { Slider } from './Inputs';
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

    const clearSetup = () => {
        setStartingSeconds(0);
        setTime(0);
        setVideo(null);
    }
  
    useEffect(() => {
      load();
    }, [])
  
    const convertToGif = async () => {
      // Write the file to memory 
      ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
  
      // Run the FFMpeg command
      await ffmpeg.run('-i', 'test.mp4', '-pix_fmt', 'rgb24', '-r', '10', '-s', '320x240', '-t', time, '-ss', startingSeconds, '-f', 'gif', 'out.gif');
  
      // Read the result
      const data = ffmpeg.FS('readFile', 'out.gif');
  
      // Create a URL
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
      setGif(url)
    }
  
    return ready ? (
      <div className="convertor-container">
        <div className="convertor-video card">
            <div className="card-header">
                <h3>Video Input</h3>
            </div>
            {video ? video && <video
            controls
            width="250"
            src={URL.createObjectURL(video)}>
            </video> : <div className="convertor-video-empty">Select a video file</div>}
            <input aria-label="video file select" className="custom-file-input" type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
        </div>
        <div className="convertor-controls card">        
            <div className="card-header">
                <h3>Settings</h3>
            </div>
            <Slider 
                aria="starting-slider"
                className="convertor-controls-slider" 
                id="starting-slider"
                label="Start"
                max={10}
                min={0.1}
                onChange={handleStartChange} 
                value={startingSeconds}
            />
            <Slider 
                aria="time-slider"
                className="convertor-controls-slider" 
                id="time-slider"
                label="Time"
                max={30}
                min={0}
                onChange={handleSlideChange} 
                value={time}
            />
            <div className="convertor-controls-btns">
                <button className="convertor-controls-btn-create" onClick={convertToGif} disabled={time <= 0.05 && startingSeconds <= 0.01}>Convert</button>
                <button className="convertor-controls-btn-clear" onClick={clearSetup}>Clear Selection</button>
            </div>
        </div>
        <div className="convertor-gif card">
            <div className="card-header">
                <h3>GIFs</h3>
            </div>
            {gif ? gif && (
                <>
                    <img className="convertor-gif-output" src={gif} alt="" width="250" />
                    <a className="convertor-controls-btn-download" href={gif} download>Click to Download</a>
                </>
            ) : (
                <div className="convertor-gif-empty">Here be GIF...</div>
            )}
        </div>
      </div>
    ) : (<p>Loading...</p>);
};

export default GIFConversion;