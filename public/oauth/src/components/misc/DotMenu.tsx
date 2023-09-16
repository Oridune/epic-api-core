import React from "react";
import { IconButton, Menu, MenuItem, type PopoverOrigin } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

export type DotMenuOption = {
  label: string;
  onClick: () => any;
  disabled?: boolean;
};

export const DotMenu = (props: {
  id: string;
  options: DotMenuOption[];
  onOpen?: (event: React.MouseEvent<HTMLElement>) => any;
  onClose?: () => any;
  edge?: false | "end" | "start";
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
}) => {
  const [AnchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const Open = Boolean(AnchorEl);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    props.onOpen?.(event);
  };
  const handleClose = () => {
    setAnchorEl(null);
    props.onClose?.();
  };

  return (
    <>
      <IconButton
        id={`${props.id}-button`}
        aria-label="more"
        aria-controls={Open ? `${props.id}-menu` : undefined}
        aria-expanded={Open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleOpen}
        edge={props.edge}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id={`${props.id}-menu`}
        MenuListProps={{
          "aria-labelledby": `${props.id}-button`,
        }}
        anchorEl={AnchorEl}
        open={Open}
        onClose={handleClose}
        anchorOrigin={props.anchorOrigin}
        transformOrigin={props.transformOrigin}
        elevation={1}
      >
        {props.options.map(
          (option) =>
            !option.disabled && (
              <MenuItem
                key={option.label}
                onClick={() => {
                  option.onClick();
                  handleClose();
                }}
              >
                {option.label}
              </MenuItem>
            )
        )}
      </Menu>
    </>
  );
};
