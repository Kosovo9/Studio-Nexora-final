/**
 * Fetch wrapper with retry logic and timeout
 * Handles network errors gracefully
 */

interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

interface FetchResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
}

export async function fetchWithRetry<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<FetchResponse<T>> {
  const {
    timeout = 30000, // 30 seconds default
    retries = 3,
    retryDelay = 1000, // 1 second initial delay
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        return {
          data: data as T,
          error: null,
          status: response.status,
        };
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error: any) {
      lastError = error;

      // Don't retry on abort (timeout) or 4xx errors
      if (error.name === 'AbortError' || (error.message?.includes('HTTP 4'))) {
        return {
          data: null,
          error: error.message || 'Request failed',
          status: 0,
        };
      }

      // If this was the last attempt, return error
      if (attempt === retries) {
        return {
          data: null,
          error: lastError?.message || 'Request failed after retries',
          status: 0,
        };
      }

      // Wait before retrying (exponential backoff)
      const delay = retryDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return {
    data: null,
    error: lastError?.message || 'Unknown error',
    status: 0,
  };
}

/**
 * Simple fetch with timeout (no retry)
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

