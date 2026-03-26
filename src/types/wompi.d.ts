export type WompiInitializeData = {
  sessionId?: string;
  /** Wompi docs use deviceID; some builds may differ. */
  deviceData?: { deviceID?: string; deviceId?: string };
};

export type WompiInitializeCallback = (
  data: WompiInitializeData | null,
  error: unknown
) => void;

export type WompiGlobal = {
  initialize: (cb: WompiInitializeCallback) => void;
};

declare global {
  interface Window {
    $wompi?: WompiGlobal;
  }
}

export {};
