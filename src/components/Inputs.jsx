import React from 'react';
import './Inputs.scss';

const Slider = ({
    aria, className, id, label, max, min, onChange, value
}) => {
    return (
        <>
            <span><label htmlFor={id}>{label}: </label>{value + ' secs'}</span>
            <input 
                aria-label={aria}
                id={id}
                type="range" 
                className={className}
                min={min} 
                max={max}
                step={0.1}
                value={value}
                onChange={onChange} 
            />
        </>
    )
}

export {
    Slider
};