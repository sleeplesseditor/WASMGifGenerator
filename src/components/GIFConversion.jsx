import React, { useState, useEffect} from 'react';
import './GIFConversion.scss';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

const GIFConversion = () => {
    const [ready, setReady] = useState(false);
    const [video, setVideo] = useState();
    const [gif, setGif] = useState();
    const [time, setTime] = useState();
  
    const load = async () => {
      await ffmpeg.load();
      setReady(true);
    }

    const handleSlideChange = (e) => {
        setTime(e.target.value)
    }
  
    useEffect(() => {
      load();
    }, [])
  
    const convertToGif = async () => {
      // Write the file to memory 
      ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
  
      // Run the FFMpeg command
      await ffmpeg.run('-i', 'test.mp4', '-t', time, '-ss', '2.0', '-f', 'gif', 'out.gif');
  
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
            {time}
            <input aria-label="time-slider" type="range" className="convertor-controls-slider" min={0} max={10} onChange={handleSlideChange} />
            <button className="convertor-controls-btn" onClick={convertToGif}>Convert</button>
        </div>
        <div className="convertor-gif">
            <h3>Result</h3>
            {gif && <img src={gif} alt="" width="250" />}
        </div>
      </div>
    ) : (<p>Loading...</p>);
};

export default GIFConversion;