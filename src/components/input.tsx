import { toCapitilize } from "@/utils/to-capitalize";
import type { InputHTMLAttributes, LabelHTMLAttributes } from "react";

type InputProps = {
  input: InputHTMLAttributes<HTMLInputElement>;
  label: LabelHTMLAttributes<HTMLLabelElement>;
};
export function Input(props: InputProps) {
  const text = toCapitilize(props.label.htmlFor as string);
  return (
    <>
      <label {...props.label}>{text}</label>
      <input {...props.input} />
    </>
  );
}
