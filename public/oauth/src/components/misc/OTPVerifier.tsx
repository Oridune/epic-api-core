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

export interface IOTPModelRef {
  verify: (totpChallenge: string) => Promise<string>;
}

export interface IOTPModelProps {
  onVerify: (challengeToken: string, code: string) => Promise<string>;
}

export const OTPVerifier = React.forwardRef<IOTPModelRef, IOTPModelProps>(
  ({ onVerify }, ref) => {
    const { t } = useTranslation();

    const [challengeToken, setChallengeToken] = React.useState<string | null>(
      null
    );

    const [otp, setOTP] = React.useState("");

    const [loading, setLoading] = React.useState(false);

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
    };

    const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setLoading(true);

      try {
        if (!challengeToken) throw new Error("No challenge token!");

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

      setLoading(false);
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
                type="text"
                autoComplete="code"
                inputProps={{
                  minLength: 6,
                  maxLength: 6,
                }}
                value={otp}
                onChange={(e) => {
                  setOTP(e.target.value);
                }}
                required
              />
            </FormControl>
            <DialogActions>
              <Button onClick={handleClose}>{t("Cancel")}</Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {t("Verify")}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
);
