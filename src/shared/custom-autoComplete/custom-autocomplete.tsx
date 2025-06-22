import React, { useEffect, useState } from "react";

interface CustomAutocompleteProps {
  options: Array<{ value: string | number; label: string }>;
  value?: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
}

const CustomAutocomplete: React.FC<CustomAutocompleteProps> = ({
  options,
  value,
  onChange,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Set the inputValue based on the selected value prop
  useEffect(() => {
    const selectedOption = options.find((option) => option.value === value);
    setInputValue(selectedOption ? selectedOption.label : "");
  }, [value, options]);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputValue(value);
    setIsOpen(value.length > 0); // Open dropdown if input has content
  };

  // Handle option selection
  const handleOptionSelect = (option: {
    value: string | number;
    label: string;
  }) => {
    onChange(option.value);
    setInputValue(option.label);
    setIsOpen(false);
  };

  // Filter options based on input value
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)} // Open on focus
        placeholder={placeholder}
        className="border text-xs font-montserrat_regular border-border h-12 rounded-lg  w-full pr-8 ps-3 bg-transparent"
      />
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => handleOptionSelect(option)}
              className="cursor-pointer p-2 hover:bg-gray-200"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomAutocomplete;
