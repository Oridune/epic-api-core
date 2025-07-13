import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTranslation } from "react-i18next";
import {
  DialogContentText,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

export interface IChallengeRef {
  verify: (totpChallenge: string) => Promise<string>;
}

export interface IChallengeProps {
  setLoading: (loading: boolean) => void;
  onVerify: (challengeToken: string, code: string) => Promise<string>;
}

export const ChallengeVerifier = React.forwardRef<
  IChallengeRef,
  IChallengeProps
>(({ setLoading, onVerify }, ref) => {
  const { t } = useTranslation();

  const [challengeToken, setChallengeToken] = React.useState<string | null>(
    null
  );

  const [otp, setOTP] = React.useState("");

  const [internalLoading, setInternalLoading] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    verify(token) {
      setChallengeToken(token);

      return new Promise((resolve, reject) => {
        addEventListener(
          "__otpVerification",
          (event) => {
            const ev = event as CustomEvent<{
              success: boolean;
              message: string;
              token: string;
            }>;

            if (ev.detail.success) {
              resolve(ev.detail.token);

              return;
            }

            reject(new Error(ev.detail.message ?? "Something went wrong!"));
          },
          { once: true }
        );
      });
    },
  }));

  const handleClose = () => {
    setChallengeToken(null);
    setLoading(false);
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setInternalLoading(true);
    
    try {
      if (!challengeToken) throw new Error("No challenge token!");

      setLoading(true);

      const token = await onVerify(challengeToken, otp);

      dispatchEvent(
        new CustomEvent("__otpVerification", {
          detail: {
            success: true,
            token,
          },
        })
      );
    } catch (err) {
      dispatchEvent(
        new CustomEvent("__otpVerification", {
          detail: {
            success: false,
            message: err instanceof Error ? err.message : String(err),
          },
        })
      );
    } finally {
      handleClose();
    }

    setInternalLoading(false);
  };

  return (
    <Dialog open={!!challengeToken} onClose={handleClose}>
      <DialogTitle>{t("Verify OTP")}</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <DialogContentText>
          {t("Enter the OTP code from your configured authenticator device.")}
        </DialogContentText>
        <form onSubmit={handleVerify}>
          <FormControl fullWidth variant="outlined" sx={{ marginY: 2 }}>
            <InputLabel htmlFor="code">{t("OTP Code")}</InputLabel>
            <OutlinedInput
              id="code"
              label={t("OTP Code")}
              type="number"
              autoComplete="code"
              inputProps={{
                min: "100000",
                max: "999999",
              }}
              value={otp}
              onChange={(e) => {
                setOTP(e.target.value);
              }}
            />
          </FormControl>
          <DialogActions>
            <Button onClick={handleClose}>{t("Cancel")}</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={internalLoading}
            >
              {t("Verify")}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
});
