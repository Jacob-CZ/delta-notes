"use client"
import React, { useState } from 'react';

interface AISwitchProps {
  onToggle: (value: boolean) => void;
  className?: string;
}

const AISwitch: React.FC<AISwitchProps> = ({ onToggle, className }) => {
  const [isAIChatbot, setIsAIChatbot] = useState(true);

  const handleClick = () => {
    const newValue = !isAIChatbot;
    setIsAIChatbot(newValue);
    onToggle(newValue);
  };

  return (
    <div className={"w-24 h-7 bg-neutral-600 rounded-full relative" + className}>
      <div 
        className="absolute w-12 h-6 bg-sky-500 rounded-full m-[0.125rem] text-center transition-transform duration-200 ease-in-out text-xs flex items-center justify-center" 
        style={{transform: isAIChatbot ? 'translateX(44px)' : 'translateX(0px)', userSelect: 'none'}} 
        onClick={handleClick}
      >
        {isAIChatbot ? 'AI' : 'Search'}
      </div>
    </div>
  );
};

export default AISwitch;