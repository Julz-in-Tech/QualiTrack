const API_BASE_URL = window.__QUALITRACK_CONFIG__?.apiUrl || "http://localhost:5000/api";

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

export async function fetchIncomingSummary() {
  const response = await fetch(`${API_BASE_URL}/qc/incoming/summary`);
  return readResponse(response);
}

export async function createIncomingQC(payload) {
  const response = await fetch(`${API_BASE_URL}/qc/incoming`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return readResponse(response);
}
