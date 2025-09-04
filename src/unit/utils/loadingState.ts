/**
 * Loading state management for better UX
 */
import { reactive, ref } from 'vue';

// Global loading state
export const globalLoading = ref(false);

// Component-specific loading states
export const loadingStates = reactive<Record<string, boolean>>({});

/**
 * Set loading state for a specific component or operation
 */
export function setLoading(key: string, loading: boolean): void {
  loadingStates[key] = loading;
}

/**
 * Get loading state for a specific component or operation
 */
export function getLoading(key: string): boolean {
  return loadingStates[key] || false;
}

/**
 * Wrapper for async operations with loading state
 */
export async function withLoading<T>(
  key: string,
  operation: () => Promise<T>
): Promise<T> {
  try {
    setLoading(key, true);
    const result = await operation();
    return result;
  } finally {
    setLoading(key, false);
  }
}

/**
 * Set global loading state
 */
export function setGlobalLoading(loading: boolean): void {
  globalLoading.value = loading;
}

/**
 * Clear all loading states
 */
export function clearAllLoading(): void {
  Object.keys(loadingStates).forEach(key => {
    delete loadingStates[key];
  });
  globalLoading.value = false;
}