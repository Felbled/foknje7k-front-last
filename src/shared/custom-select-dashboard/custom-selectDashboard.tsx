import React from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { SvgIconComponent } from "@mui/icons-material";

interface CustomSelectProps {
  options: { value: string; label: string }[];
  iconSuffix?: SvgIconComponent;
  value?: string;
  onChange: (event: React.ChangeEvent<any>) => void;
  placeholder?: string;
  label?: string;
  name?: string;
}

const CustomSelectDashboard: React.FC<CustomSelectProps> = ({
  options,
  iconSuffix: IconSuffix,
  value,
  onChange,
  placeholder,
  label,
  name,
}) => {
  return (
    <FormControl fullWidth variant="outlined">
      {label && (
        <div className="text-title font-montserrat_bold mb-3">{label}</div>
      )}
      <Select
        value={value}
        name={name}
        //@ts-ignore
        onChange={onChange}
        input={<OutlinedInput label={placeholder} />}
        IconComponent={() => (
          <ArrowDropDownIcon
            style={{ fontSize: 35 }}
            className={"text-primary_bg"}
          />
        )}
        className="ps-20 bg-white "
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {IconSuffix && (
        <div className="absolute bottom-4 left-4 pr-2 flex items-center pointer-events-none">
          <IconSuffix className="text-text" />
        </div>
      )}
    </FormControl>
  );
};

export default CustomSelectDashboard;
