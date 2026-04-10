const API_BASE_URL = window.__QUALITRACK_CONFIG__?.apiUrl || "http://127.0.0.1:5000/api";

async function readResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const message =
      data?.errors?.join(" ") ||
      data?.message ||
      "The request failed. Please check the backend service.";
    throw new Error(message);
  }

  return data;
}

async function request(path, options) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, options);
    return readResponse(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Cannot reach the backend at ${API_BASE_URL}. Make sure the API server is running.`);
    }

    throw error;
  }
}

export async function fetchIncomingSummary() {
  return request("/qc/incoming/summary");
}


export async function createIncomingQC(payload) {
  return request("/qc/incoming", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
