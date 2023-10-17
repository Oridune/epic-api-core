import React from "react";
import {
  OutlinedInputProps,
  InputAdornment,
  MenuItem,
  Select,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import Flag from "react-world-flags";
import { DialingRules } from "../../data/dialingRules";

export interface PhoneFieldProps extends OutlinedInputProps {
  id: string;
  label: string;
  value?: string;
  defaultCountryCode?: string;
  allowedCountryCodes?: string[];
  helperText?: string;
  errorMessage?: string;
}

export const PhoneField = React.forwardRef<any, PhoneFieldProps>(
  (
    {
      id,
      label,
      defaultCountryCode,
      allowedCountryCodes,
      value,
      onChange,
      helperText,
      errorMessage,
      ...restProps
    },
    ref
  ) => {
    const AvailableDialingRules = React.useMemo(
      () =>
        Object.values(DialingRules).filter(
          (rule) =>
            !(allowedCountryCodes instanceof Array) ||
            allowedCountryCodes
              ?.map((code) => code.toLowerCase())
              ?.includes(rule.countryCode)
        ),
      allowedCountryCodes
    );

    const [CountryCode, setCountryCode] = React.useState(
      defaultCountryCode ?? "us"
    );

    const TargetDialingRule = DialingRules[CountryCode];

    const [PhoneNumber, setPhoneNumber] = React.useState(
      `+${TargetDialingRule?.dialingCode ?? "1"}`
    );

    return (
      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <OutlinedInput
          inputRef={ref}
          id={id}
          label={label}
          type="tel"
          value={(value ?? PhoneNumber).substring(
            0,
            1 +
              TargetDialingRule?.dialingCode.toString().length +
              ((TargetDialingRule?.mask?.split(".")?.length ?? 13) - 1 ?? 12)
          )}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
            onChange?.(e);
          }}
          error={!!errorMessage}
          startAdornment={
            <InputAdornment
              position="start"
              style={{ marginRight: "2px", marginLeft: "-8px" }}
            >
              <Select
                MenuProps={{
                  style: {
                    height: "300px",
                    width: "360px",
                    top: "10px",
                    left: "-34px",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                }}
                sx={{
                  // width: "max-content",
                  // Remove default outline (display only on focus)
                  fieldset: {
                    display: "none",
                  },
                  // '&.Mui-focused:has(div[aria-expanded="false"])': {
                  //   fieldset: {
                  //     display: "block",
                  //   },
                  // },
                  // Update default spacing
                  ".MuiSelect-select": {
                    padding: "8px",
                    paddingRight: "24px !important",
                  },
                  svg: {
                    right: 0,
                  },
                }}
                value={CountryCode}
                onChange={(e) => {
                  setCountryCode(e.target.value);
                  setPhoneNumber(
                    `+${DialingRules[e.target.value]?.dialingCode}`
                  );
                }}
                renderValue={(value) => (
                  <Flag code={value} style={{ marginTop: "4px" }} width={25} />
                )}
              >
                {AvailableDialingRules.map((rule) => {
                  return (
                    <MenuItem key={rule.countryCode} value={rule.countryCode}>
                      <Flag
                        code={rule.countryCode}
                        style={{ marginRight: "8px" }}
                        width={25}
                      />
                      <Typography marginRight="8px">{rule.name}</Typography>
                      <Typography color="gray">+{rule.dialingCode}</Typography>
                    </MenuItem>
                  );
                })}
              </Select>
            </InputAdornment>
          }
          {...restProps}
        />
        <FormHelperText error={!!errorMessage}>
          {errorMessage ?? helperText}
        </FormHelperText>
      </FormControl>
    );
  }
);
