"use client";

import { Toaster } from "sonner";

type Props = {
  /** Desktop placement; mobile is always viewport center via globals.css */
  position?: "top-right" | "top-center";
};

export default function AppToaster({ position = "top-right" }: Props) {
  return (
    <Toaster
      position={position}
      richColors
      duration={3000}
      expand
      className="uriz-toaster"
      toastOptions={{
        classNames: {
          toast: "uriz-toast",
        },
      }}
    />
  );
}
