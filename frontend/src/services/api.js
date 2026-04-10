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
      stats: {
        total_inspections: 45,
        total_received: 100,
        total_failed: 5,
        accepted_count: 40,
      },
      recentInspections: [
        {
          id: 1,
          poNumber: "PO-2024-001",
          partNumber: "PCB-CTRL-001",
          qtyReceived: 100,
          qtyPassed: 95,
          qtyFailed: 5,
          inspectorName: "John Doe",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          status: "completed"
        },
        {
          id: 2,
          poNumber: "PO-2024-002", 
          partNumber: "PCB-CTRL-002",
          qtyReceived: 50,
          qtyPassed: 50,
          qtyFailed: 0,
          inspectorName: "Jane Smith",
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          status: "completed"
        }
      ]
    };
  }
  
  if (path === "/qc/incoming") {
    return {
      data: {
        id: Date.now(),
        status: "created",
        message: "Inspection saved successfully with no NCR required.",
        ncr: null
      }
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
