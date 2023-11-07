import { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import FlagPlaceholder from "../../assets/flag-placeholder.png";

export interface FlagProps
  extends Omit<
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    "src"
  > {
  iso2Code: string;
}

export const Flag = (props: FlagProps) => {
  const { iso2Code, onError, ...rest } = props;

  return (
    <img
      {...rest}
      src={new URL(
        `${import.meta.env.BASE_URL}flags/${props.iso2Code}.svg`,
        window.location.origin
      ).toString()}
      onError={(e) => {
        e.currentTarget.src = FlagPlaceholder;
        onError?.(e);
      }}
    />
  );
};
