import React from "react";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";

export interface PasswordInputProps {
  id: string;
  label: string;
  fullWidth?: boolean;
  required?: boolean;
  autoFocus?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  fullWidth,
  ...rest
}) => {
  const [ShowPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((_) => !_);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <FormControl fullWidth={fullWidth} variant="outlined">
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput
        id={id}
        label={label}
        type={ShowPassword ? "text" : "password"}
        autoComplete={id}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {ShowPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        {...rest}
      />
    </FormControl>
  );
};
