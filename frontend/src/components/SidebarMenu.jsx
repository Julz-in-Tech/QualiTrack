import { useState, useEffect } from "react";

function formatDate(value) {
  if (!value) {
    return "Just now";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function SidebarMenu({ isOpen, onClose, currentPage, setCurrentPage }) {
  const [activeTab, setActiveTab] = useState("receiving");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: ""
  });
  const [receivingInspections, setReceivingInspections] = useState([]);
  const [internalInspections, setInternalInspections] = useState([]);
  const [monthlyData, setMonthlyData] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadInspectionData();
    }
  }, [isOpen]);

  function loadInspectionData() {
    // Load from localStorage
    const stored = JSON.parse(localStorage.getItem('qualitrack_inspections') || '[]');
    const ncrs = JSON.parse(localStorage.getItem('qualitrack_ncrs') || '[]');
    
    // Separate by inspection type
    const receiving = stored.filter(inspection => 
      inspection.items && inspection.items.some(item => item.inspectionType === "receiving")
    );
    const internal = stored.filter(inspection => 
      inspection.items && inspection.items.some(item => item.inspectionType === "internal")
    );
    
    setReceivingInspections(receiving);
    setInternalInspections(internal);
    
    // Calculate monthly data
    calculateMonthlyData(receiving, internal, ncrs);
  }

  function calculateMonthlyData(receiving, internal, ncrs) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyReceiving = receiving.filter(inspection => {
      const date = new Date(inspection.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    const monthlyInternal = internal.filter(inspection => {
      const date = new Date(inspection.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    const monthlyNCRs = ncrs.filter(ncr => {
      const date = new Date(ncr.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    setMonthlyData({
      receiving: {
        total: monthlyReceiving.length,
        completed: monthlyReceiving.length
      },
      internal: {
        total: monthlyInternal.length,
        completed: monthlyInternal.length
      },
      ncrs: {
        total: monthlyNCRs.length,
        completed: monthlyNCRs.filter(ncr => ncr.status === "COMPLETED").length
      }
    });
  }

  function updateDateRange(event) {
    const { name, value } = event.target;
    setDateRange((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function getFilteredInspections(inspections) {
    if (!dateRange.startDate && !dateRange.endDate) {
      return inspections;
    }
    
    return inspections.filter(inspection => {
      const inspectionDate = new Date(inspection.createdAt);
      const start = dateRange.startDate ? new Date(dateRange.startDate) : new Date(0);
      const end = dateRange.endDate ? new Date(dateRange.endDate) : new Date();
      return inspectionDate >= start && inspectionDate <= end;
    });
  }

  function handleNavigation(page) {
    setCurrentPage(page);
    onClose();
  }

  const filteredReceiving = getFilteredInspections(receivingInspections);
  const filteredInternal = getFilteredInspections(internalInspections);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? "0" : "-400px",
          width: "400px",
          height: "100%",
          background: "white",
          boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.1)",
          transition: "right 0.3s ease",
          zIndex: 1000,
          overflow: "auto"
        }}
      >
        <div style={{ padding: "20px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: "0" }}>Menu & History</h3>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#666"
              }}
            >
              ×
            </button>
          </div>

          {/* Navigation */}
          <div style={{ marginBottom: "30px" }}>
            <h4 style={{ marginBottom: "10px" }}>Navigation</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                onClick={() => handleNavigation("receiving")}
                style={{
                  padding: "10px 15px",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  background: currentPage === "receiving" ? "#007bff" : "#fff",
                  color: currentPage === "receiving" ? "#fff" : "#495057",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                Receiving Inspection
              </button>
              <button
                onClick={() => handleNavigation("internal")}
                style={{
                  padding: "10px 15px",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  background: currentPage === "internal" ? "#007bff" : "#fff",
                  color: currentPage === "internal" ? "#fff" : "#495057",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                Internal Inspection
              </button>
              <button
                onClick={() => handleNavigation("ncr")}
                style={{
                  padding: "10px 15px",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  background: currentPage === "ncr" ? "#007bff" : "#fff",
                  color: currentPage === "ncr" ? "#fff" : "#495057",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                NCR Form
              </button>
            </div>
          </div>

          {/* Monthly Summary */}
          <div style={{
            background: "#f8f9fa",
            padding: "15px",
            borderRadius: "4px",
            marginBottom: "20px"
          }}>
            <h4 style={{ marginTop: "0", marginBottom: "15px" }}>Monthly Summary</h4>
            <div style={{display: "grid", gridTemplateColumns: "1fr", gap: "10px"}}>
              <div>
                <strong>Receiving Inspections</strong>
                <div>{monthlyData.receiving?.completed || 0} completed this month</div>
              </div>
              <div>
                <strong>Internal Inspections</strong>
                <div>{monthlyData.internal?.completed || 0} completed this month</div>
              </div>
              <div>
                <strong>NCR Reports</strong>
                <div>{monthlyData.ncrs?.total || 0} created this month</div>
              </div>
            </div>
          </div>

          {/* Date Range Filter */}
          <div style={{
            background: "#f8f9fa",
            padding: "15px",
            borderRadius: "4px",
            marginBottom: "20px"
          }}>
            <h4 style={{ marginTop: "0", marginBottom: "15px" }}>Filter by Date Range</h4>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px"}}>
              <div>
                <label style={{fontSize: "12px", color: "#666"}}>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={updateDateRange}
                  style={{width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px"}}
                />
              </div>
              <div>
                <label style={{fontSize: "12px", color: "#666"}}>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={updateDateRange}
                  style={{width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px"}}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDateRange({startDate: "", endDate: ""})}
              style={{
                padding: "6px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                background: "#f5f5f5",
                cursor: "pointer",
                fontSize: "12px"
              }}
            >
              Clear Filter
            </button>
          </div>

          {/* History Tabs */}
          <div>
            <h4 style={{ marginBottom: "10px" }}>Inspection History</h4>
            <div style={{display: "flex", gap: "8px", marginBottom: "15px"}}>
              <button
                onClick={() => setActiveTab("receiving")}
                style={{
                  padding: "6px 12px",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  background: activeTab === "receiving" ? "#007bff" : "#fff",
                  color: activeTab === "receiving" ? "#fff" : "#495057",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                Receiving ({filteredReceiving.length})
              </button>
              <button
                onClick={() => setActiveTab("internal")}
                style={{
                  padding: "6px 12px",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  background: activeTab === "internal" ? "#007bff" : "#fff",
                  color: activeTab === "internal" ? "#fff" : "#495057",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                Internal ({filteredInternal.length})
              </button>
            </div>

            {/* History Content */}
            <div style={{maxHeight: "300px", overflow: "auto"}}>
              {activeTab === "receiving" && (
                <div>
                  {filteredReceiving.length === 0 ? (
                    <div style={{textAlign: "center", color: "#666", padding: "20px"}}>
                      No receiving inspections found
                    </div>
                  ) : (
                    filteredReceiving.map(inspection => (
                      <div key={inspection.id} style={{
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        padding: "10px",
                        marginBottom: "8px"
                      }}>
                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                          <div>
                            <strong style={{fontSize: "14px"}}>{inspection.poNumber}</strong>
                            <div style={{fontSize: "11px", color: "#666"}}>
                              {formatDate(inspection.createdAt)}
                            </div>
                            <div style={{fontSize: "11px", color: "#666"}}>
                              Items: {inspection.items?.length || 0}
                            </div>
                          </div>
                          <div style={{textAlign: "right"}}>
                            <div style={{fontSize: "11px", color: "#666"}}>
                              Received: {inspection.qtyReceived || 0}
                            </div>
                            <div style={{fontSize: "11px", color: "#28a745"}}>
                              Passed: {inspection.qtyPassed || 0}
                            </div>
                            <div style={{fontSize: "11px", color: "#dc3545"}}>
                              Failed: {inspection.qtyFailed || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "internal" && (
                <div>
                  {filteredInternal.length === 0 ? (
                    <div style={{textAlign: "center", color: "#666", padding: "20px"}}>
                      No internal inspections found
                    </div>
                  ) : (
                    filteredInternal.map(inspection => (
                      <div key={inspection.id} style={{
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        padding: "10px",
                        marginBottom: "8px"
                      }}>
                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                          <div>
                            <strong style={{fontSize: "14px"}}>{inspection.partNumber}</strong>
                            <div style={{fontSize: "11px", color: "#666"}}>
                              {formatDate(inspection.createdAt)}
                            </div>
                            <div style={{fontSize: "11px", color: "#666"}}>
                              Test Type: {inspection.testType}
                            </div>
                          </div>
                          <div style={{textAlign: "right"}}>
                            <div style={{fontSize: "11px", color: "#666"}}>
                              Tests: {inspection.items?.length || 0}
                            </div>
                            <div style={{fontSize: "11px", color: "#dc3545"}}>
                              Failures: {inspection.items?.filter(item => item.testResult === "FAIL").length || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SidebarMenu;
