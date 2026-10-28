export async function fetchApi(url, options) {
  const response = await fetch(url, options);
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
