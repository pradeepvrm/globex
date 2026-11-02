export const AUTH_TOKEN_KEY = "authToken";

export async function fetchApi(url, options) {
  const token = window.sessionStorage.getItem(AUTH_TOKEN_KEY);
  const headers = new Headers(options?.headers);
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const response = await fetch(url, { ...options, headers });
  const body = await response.json();

  if (body === null || typeof body !== "object") {
    throw new Error("The API returned an invalid response.");
  }

  if (!response.ok || body.success !== true) {
    throw new Error(body.msg || `Request failed with status ${response.status}`);
  }

  if (!Object.hasOwn(body, "data")) {
    throw new Error("The API response is missing its data field.");
  }

  return body.data;
}
