import React from "react";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";

export interface InputProps {
  id: string;
  label: string;
  fullWidth?: boolean;
  required?: boolean;
  autoFocus?: boolean;
}

export const Input: React.FC<InputProps> = ({
  id,
  label,
  fullWidth,
  ...rest
}) => {
  return (
    <FormControl fullWidth={fullWidth} variant="outlined">
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput
        id={id}
        label={label}
        type="text"
        autoComplete={id}
        {...rest}
      />
    </FormControl>
  );
};
