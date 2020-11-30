import React from 'react';

const Slider = ({
    aria, className, id, label, max, onChange, value
}) => {
    return (
        <>
            <span><label htmlFor={id}>{label}: </label>{value + ' secs'}</span>
            <input 
                aria-label={aria}
                id={id}
                type="range" 
                className={className}
                min={0} 
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