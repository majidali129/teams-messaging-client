import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { ComponentProps } from "react";

interface SubmitButtonProps extends ComponentProps<typeof Button> {
  loading?: boolean;
  label: string;
  loadingLabel?: string;
}

export function SubmitButton({
  loading = false,
  label,
  loadingLabel,
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={disabled || loading} {...props}>
      {loading && <Spinner />}
      {loading ? (loadingLabel ?? label) : label}
    </Button>
  );
}
