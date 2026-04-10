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
    return getMockData(path, options);
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

function getMockData(path, options = {}) {
  // Mock data for production when backend isn't available
  if (path === "/qc/incoming/summary") {
    // Get stored inspections from localStorage
    const storedInspections = JSON.parse(localStorage.getItem('qualitrack_inspections') || '[]');
    
    // Add sample data if no inspections exist
    if (storedInspections.length === 0) {
      const sampleInspections = [
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
      ];
      localStorage.setItem('qualitrack_inspections', JSON.stringify(sampleInspections));
    }
    
    const inspections = JSON.parse(localStorage.getItem('qualitrack_inspections') || '[]');
    
    // Calculate stats from stored inspections
    const stats = inspections.reduce((acc, inspection) => {
      acc.total_inspections += 1;
      acc.total_received += inspection.qtyReceived || 0;
      acc.total_failed += inspection.qtyFailed || 0;
      acc.accepted_count += (inspection.qtyPassed || 0) > 0 ? 1 : 0;
      return acc;
    }, {
      total_inspections: 0,
      total_received: 0,
      total_failed: 0,
      accepted_count: 0,
    });

    return {
      stats,
      recentInspections: inspections.slice(-10).reverse() // Last 10 inspections, newest first
    };
  }
  
  if (path === "/qc/incoming" && options.method === 'POST') {
    // Parse the request body to get form data
    const formData = JSON.parse(options.body || '{}');
    
    // Create new inspection record
    const newInspection = {
      id: Date.now(),
      poNumber: formData.poNumber || "Unknown PO",
      partNumber: formData.partNumber || "Unknown Part",
      qtyReceived: formData.qtyReceived || 0,
      qtyPassed: formData.qtyPassed || 0,
      qtyFailed: formData.qtyFailed || 0,
      inspectorName: "Current User", // Would normally come from auth context
      createdAt: new Date().toISOString(),
      status: "completed"
    };
    
    // Get existing inspections and add new one
    const inspections = JSON.parse(localStorage.getItem('qualitrack_inspections') || '[]');
    inspections.push(newInspection);
    localStorage.setItem('qualitrack_inspections', JSON.stringify(inspections));
    
    return {
      data: {
        id: newInspection.id,
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
