import React, { useState } from "react";

interface CustomButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  width?: string;
  type?: "button" | "submit" | "reset";
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onClick,
  className = "",
  width = "w-80",
  type = "button",
}) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const handleClick = async () => {
    if (onClick) {
      const result = onClick(); 
  
      //@ts-ignore
      if (result instanceof Promise) {
        await result;  
      }
    }
  
    setIsDisabled(true); 
  
    await new Promise(resolve => setTimeout(resolve, 1500));  
    setIsDisabled(false);  
  };  
  return (
    <button
      onClick={handleClick}
      type={type}
      className={`px-4 py-2 h-12 bg-primary font-montserrat_regular text-border rounded-xl ${width} ${className} ${
        isDisabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={isDisabled}
    >
      {text}
    </button>
  );
};

export default CustomButton;
