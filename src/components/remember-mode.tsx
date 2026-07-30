"use client";

import { useEffect } from "react";
import { saveMode } from "@/lib/mode-storage";

/**
 * Renders nothing. Landing on a mode page is a strong enough signal of intent
 * to remember it, so /rhythm can pre-filter without asking again.
 */
export function RememberMode({ modeId }: { modeId: string }) {
  useEffect(() => {
    saveMode(modeId);
  }, [modeId]);

  return null;
}
