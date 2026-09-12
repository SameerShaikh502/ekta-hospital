export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const normalized = path.replace(/^\/+/, "");

  const response = await fetch(`/api/backend/${normalized}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body
        ? { "Content-Type": "application/json" }
        : {}),
      ...(options.headers || {}),
    },
  });

  const contentType =
    response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  // =========================================
  // HTTP SESSION EXPIRED
  // =========================================
  if (response.status === 401 || response.status === 403) {
    logoutAndRedirect();
    throw new Error("SESSION_EXPIRED");
  }

  // =========================================
  // NORMAL HTTP ERROR
  // =========================================
  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : `Request failed with status ${response.status}`
    );
  }

  // =========================================
  // BACKEND SESSION / USER ID ERROR
  // =========================================
  if (typeof data === "object" && data !== null) {
    const result = data as {
      Data?: unknown;
      Message?: string;
    };

    const message =
      typeof result.Message === "string"
        ? result.Message.toLowerCase()
        : "";

    const isSessionError =
      result.Data === null &&
      (
        message.includes("sp_getusermenusubmenu") ||
        message.includes("expects parameter '@userid'")
      );

    if (isSessionError) {
      logoutAndRedirect();
      throw new Error("SESSION_EXPIRED");
    }
  }

  return data as T;
}


// =========================================
// LOGOUT + REDIRECT
// =========================================

export async function logoutAndRedirect() {
  if (typeof window === "undefined") return;

  try {
    await fetch("/api/backend/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout error:", error);
  }

  sessionStorage.clear();
  localStorage.clear();

  window.location.replace("/login");
}