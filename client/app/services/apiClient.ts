/**
 * API Client
 * Centralized HTTP client with automatic JWT injection and error handling
 */

import { getAccessToken } from "./authService";
import { API_BASE_URL } from "./runtimeConfig";

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

/**
 * Make HTTP request with automatic JWT injection
 */
async function request<T = any>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  // Inject JWT token if not skipped
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const requestUrl = `${API_BASE_URL}${url}`;

  const response = await fetch(requestUrl, {
    ...fetchOptions,
    headers,
    credentials: "include", // Include cookies for session-based auth if needed
  });

  // Handle response
  let data: any;
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  // Check for errors
  if (!response.ok) {
    // Handle 401 (token expired)
    if (response.status === 401) {
      // In production, could implement token refresh here
      // For now, user will need to re-login
      console.error("Unauthorized: token may be expired");
      // You could dispatch a logout action here
    }

    throw new Error(data?.message || data || `HTTP ${response.status}`);
  }

  return data;
}

/**
 * GET request
 */
export async function get<T = any>(
  url: string,
  options?: RequestOptions,
): Promise<T> {
  return request<T>(url, { ...options, method: "GET" });
}

/**
 * POST request
 */
export async function post<T = any>(
  url: string,
  data?: any,
  options?: RequestOptions,
): Promise<T> {
  return request<T>(url, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PATCH request
 */
export async function patch<T = any>(
  url: string,
  data?: any,
  options?: RequestOptions,
): Promise<T> {
  return request<T>(url, {
    ...options,
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request
 */
export async function del<T = any>(
  url: string,
  options?: RequestOptions,
): Promise<T> {
  return request<T>(url, { ...options, method: "DELETE" });
}

export default {
  get,
  post,
  patch,
  delete: del,
};
