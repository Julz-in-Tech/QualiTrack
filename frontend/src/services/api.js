// Detect if we're in production (Vercel) vs development
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_BASE_URL = isProduction ? null : (window.__QUALITRACK_CONFIG__?.apiUrl || "http://127.0.0.1:5000/api");

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
  // In production, return mock data since backend isn't deployed
  if (isProduction) {
    return getMockData(path);
  }

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

function getMockData(path) {
  // Mock data for production when backend isn't available
  if (path === "/qc/incoming/summary") {
    return {
      totalIncoming: 45,
      pendingReview: 12,
      completedToday: 8,
      averageProcessingTime: "2.5 hours"
    };
  }
  
  if (path === "/qc/incoming") {
    return {
      id: Date.now(),
      status: "created",
      message: "QC record created successfully (mock data)"
    };
  }

  return null;
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
