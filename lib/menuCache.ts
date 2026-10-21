
import { apiFetch } from "@/lib/api";

const CACHE_DURATION = 5 * 60 * 1000;

let cachedResponse: unknown = null;
let expiresAt = 0;
let pendingRequest: Promise<unknown> | null = null;
let cacheGeneration = 0;

export function getCachedMenuInfo<T>(): Promise<T> {
  if (cachedResponse !== null && Date.now() < expiresAt) {
    return Promise.resolve(cachedResponse as T);
  }

  if (pendingRequest) {
    return pendingRequest as Promise<T>;
  }

  const requestGeneration = cacheGeneration;

  const request = apiFetch<T>("UserLogin/Getmenuinfobyuser")
    .then((response) => {
      // Logout ya cache clear hone ke baad purana response
      // cache mein dobara save nahi hona chahiye.
      if (cacheGeneration === requestGeneration) {
        cachedResponse = response;
        expiresAt = Date.now() + CACHE_DURATION;
      }

      return response;
    })
    .finally(() => {
      if (cacheGeneration === requestGeneration) {
        pendingRequest = null;
      }
    });

  pendingRequest = request;

  return request;
}

export function clearMenuInfoCache() {
  cacheGeneration++;
  cachedResponse = null;
  expiresAt = 0;
  pendingRequest = null;
}
