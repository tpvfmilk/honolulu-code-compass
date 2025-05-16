
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

type LotAreaInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
};

export const LotAreaInput = ({ id, value, onChange }: LotAreaInputProps) => {
  const [isValid, setIsValid] = useState(true);
  const [displayValue, setDisplayValue] = useState("");
  
  // Format the number with commas when the component mounts or value changes
  useEffect(() => {
    if (value) {
      try {
        // Handle the case when value already has commas
        const numericValue = parseFloat(value.replace(/,/g, ''));
        if (!isNaN(numericValue) && numericValue > 0) {
          setDisplayValue(numericValue.toLocaleString());
          setIsValid(true);
        } else {
          setDisplayValue(value);
          setIsValid(false);
        }
      } catch (error) {
        setDisplayValue(value);
        setIsValid(false);
      }
    } else {
      setDisplayValue("");
      setIsValid(true);
    }
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Remove any non-numeric characters except for commas
    const numericString = inputValue.replace(/[^0-9,]/g, '');
    
    // Remove commas for validation and formatting
    const plainNumber = numericString.replace(/,/g, '');
    
    if (plainNumber === "" || (plainNumber.length > 0 && !isNaN(parseFloat(plainNumber)))) {
      onChange(numericString);
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="relative">
      <Input
        id={id}
        value={displayValue}
        onChange={handleChange}
        className={`pr-10 ${!isValid ? "border-red-500" : ""}`}
        placeholder="Enter lot area in square feet"
        aria-invalid={!isValid}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
        sf
      </span>
      {!isValid && (
        <p className="text-xs text-red-500 mt-1">
          Please enter a valid number greater than 0
        </p>
      )}
    </div>
  );
};
