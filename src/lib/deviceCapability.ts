import { useSyncExternalStore } from 'react';

export type DeviceCapability = 'high' | 'medium' | 'low';

let cachedCapability: DeviceCapability | null = null;

export function getDeviceCapability(): DeviceCapability {
  if (cachedCapability) return cachedCapability;

  const cores = navigator.hardwareConcurrency || 2;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  const memory = nav.deviceMemory;
  const connection = nav.connection;

  const saveData = connection?.saveData === true;
  const slowConnection =
    connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g';

  // Low tier
  if (cores < 4 || (memory !== undefined && memory < 4) || saveData || slowConnection) {
    cachedCapability = 'low';
    return 'low';
  }

  // Medium tier
  if (cores < 8 || (memory !== undefined && memory < 8)) {
    cachedCapability = 'medium';
    return 'medium';
  }

  // High tier
  cachedCapability = 'high';
  return 'high';
}

// Simple external store for React hook usage
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function subscribe(_onStoreChange: () => void) {
  // Capability is static after first detection; no subscription needed
  return () => {};
}

function getSnapshot(): DeviceCapability {
  return getDeviceCapability();
}

export function useDeviceCapability(): DeviceCapability {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
