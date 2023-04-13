import React from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

export type TAsyncEventHandler = (
  this: HTMLButtonElement,
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  props: ICustomDialogProps
) => void | Promise<void>;

export type TCloseHandler = (
  event: {},
  reason: "backdropClick" | "escapeKeyDown" | "dismissClick"
) => void | Promise<void>;

export interface ICustomDialogRef {
  open: (
    props?: Omit<
      ICustomDialogProps,
      "id" | "open" | "onAgree" | "onDisagree" | "onClose" | "children"
    >
  ) => void;
  confirm: (
    props?: Omit<
      ICustomDialogProps,
      "id" | "open" | "onAgree" | "onDisagree" | "onClose" | "children"
    >
  ) => Promise<boolean>;
  close: () => void;
}

export interface ICustomDialogProps {
  id: string;
  title?: string;
  description?: string;
  open?: boolean;
  agreeLabel?: string;
  disagreeLabel?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onAgree?: TAsyncEventHandler;
  onDisagree?: TAsyncEventHandler;
  onClose?: TCloseHandler;
  children?: React.ReactNode;
}

export const CustomDialog = React.forwardRef<
  ICustomDialogRef,
  ICustomDialogProps
>((props, ref) => {
  const [Props, setProps] = React.useState(props);
  const {
    id,
    title,
    description,
    open,
    agreeLabel,
    disagreeLabel,
    confirmLabel,
    cancelLabel,
  } = Props;

  const [IsOpen, setIsOpen] = React.useState(open ?? false);

  const [OnConfirm, setOnConfirm] = React.useState<TAsyncEventHandler | null>(
    null
  );
  const [OnCancel, setOnCancel] = React.useState<TAsyncEventHandler | null>(
    null
  );

  const [AgreeLoading, setAgreeLoading] = React.useState(false);
  const [DisagreeLoading, setDisagreeLoading] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    open: (props) => {
      if (props) setProps({ ...Props, ...props });
      setIsOpen(true);
    },
    confirm: async (props) => {
      if (props) setProps({ ...Props, ...props });

      const Result = await new Promise<boolean>((resolve) => {
        setOnConfirm(() => () => resolve(true));
        setOnCancel(() => () => resolve(false));
        setIsOpen(true);
      });

      setIsOpen(false);
      return Result;
    },
    close: () => setIsOpen(false),
  }));

  return (
    <Dialog
      id={id}
      open={IsOpen}
      onClose={props.onClose}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
    >
      {title && <DialogTitle id={`${id}-title`}>{title}</DialogTitle>}
      <DialogContent>
        {description && (
          <DialogContentText id={`${id}-description`}>
            {description}
          </DialogContentText>
        )}
        {props.children}
      </DialogContent>
      <DialogActions>
        {(typeof props.onDisagree === "function" ||
          typeof props.onClose === "function") && (
          <LoadingButton
            loading={DisagreeLoading}
            onClick={async function (this: any, e) {
              setDisagreeLoading(true);
              await props.onDisagree?.bind(this)(e, Props);
              await props.onClose?.bind(this)(e, "dismissClick");
              setDisagreeLoading(false);
            }}
          >
            {disagreeLabel ?? "Disagree"}
          </LoadingButton>
        )}
        {typeof props.onAgree === "function" && (
          <LoadingButton
            loading={AgreeLoading}
            onClick={async function (this: any, e) {
              setAgreeLoading(true);
              await props.onAgree!.bind(this)(e, Props);
              setAgreeLoading(false);
            }}
            autoFocus
          >
            {agreeLabel ?? "Agree"}
          </LoadingButton>
        )}
        {typeof OnCancel === "function" && (
          <LoadingButton
            loading={DisagreeLoading}
            onClick={async function (this: any, e) {
              await OnCancel?.bind(this)(e, Props);
            }}
          >
            {cancelLabel ?? "Cancel"}
          </LoadingButton>
        )}
        {typeof OnConfirm === "function" && (
          <LoadingButton
            loading={AgreeLoading}
            onClick={async function (this: any, e) {
              await OnConfirm?.bind(this)(e, Props);
            }}
            autoFocus
          >
            {confirmLabel ?? "Confirm"}
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  );
});
