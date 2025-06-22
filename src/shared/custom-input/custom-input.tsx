import React, { useState, useRef } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { Upload } from "../../assets/svg";

interface CustomInputProps {
  label?: string;
  placeholder?: string;
  inputType?:
    | "text"
    | "password"
    | "email"
    | "number"
    | "tel"
    | "url"
    | "date"
    | "file";
  iconPrefix?: React.ReactNode;
  CustomStyle?: string;
  value?: string | number;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorMessage?: string;
  labelClasses?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  inputType = "text",
  iconPrefix,
  CustomStyle = "",
  value,
  name,
  onChange,
  onBlur,
  error = false,
  errorMessage,
  labelClasses,
}) => {
  const [isTouched, setIsTouched] = useState(false);
  const [type, setType] = useState(inputType);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePasswordVisibility = () => {
    if (inputType === "password") {
      setType(type === "password" ? "text" : "password");
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${CustomStyle} h-22`}>
      {label && (
        <label
          className={`${labelClasses ? labelClasses : "block text-xs font-montserrat_regular "} mb-2 text-title `}
        >
          {label}
        </label>
      )}
      <div className="relative my-2">
        {iconPrefix && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {iconPrefix}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsTouched(true);
            if (onBlur) onBlur(e); // Notify parent about blur
          }}
          className={`border text-xs font-montserrat_regular border-border h-12 rounded-lg  w-full pr-8 ${
            iconPrefix ? "ps-12" : "ps-3"
          } bg-transparent ${error ? "border-red-500" : ""}`}
        />
        {inputType === "password" && (
          <button
            type="button"
            className="absolute inset-y-0 end-0 flex items-center px-3 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {type === "password" ? (
              <VisibilityOutlinedIcon
                className="text-placeholder "
                style={{ fontSize: 20 }}
              />
            ) : (
              <VisibilityOffOutlinedIcon
                className="text-placeholder"
                style={{ fontSize: 20 }}
              />
            )}
          </button>
        )}
        {inputType === "file" && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={onChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 end-0 flex items-center px-3 cursor-pointer"
              onClick={handleFileClick}
            >
              <img src={Upload} alt={"Upload"} className={"w-8 h-8"} />
            </button>
          </>
        )}
      </div>
      {error && isTouched && errorMessage && (
        <p className="text-red text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default CustomInput;
