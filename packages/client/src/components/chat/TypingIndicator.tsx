import React from 'react';

const TypingIndicator = () => {
   return (
      <div className="flex self-start gap-2 px-2 py-2 bg-gray-200  rounded-xl">
         <Dot />
         <Dot className="[animation-delay:0.25s]" />
         <Dot className="[animation-delay:0.5s]" />
      </div>
   );
};

type DotProps = {
   className?: string;
};

const Dot = ({ className }: DotProps) => (
   <div
      className={`w-1.75 h-1.75 bg-gray-800 rounded-full animate-bounce ${className}`}
   ></div>
);

export default TypingIndicator;
