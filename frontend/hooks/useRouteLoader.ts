"use client";

import { useTransition } from "react";

const useRouteLoader = (): boolean => {
  const [isPending] = useTransition();
  console.log(">>isPending", isPending);
  return isPending;
};

export default useRouteLoader;
