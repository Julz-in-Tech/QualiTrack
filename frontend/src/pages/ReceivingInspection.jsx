import { useEffect, useState } from "react";
import { createIncomingQC, fetchIncomingSummary } from "../services/api";

const initialForm = {
  poNumber: "",
  supplierId: "1",
  deliveryDate: "",
  inspectorId: "2",
  comments: "",
  items: []
};

const initialItem = {
  partNumber: "",
  description: "",
  barcode: "",
  qtyOrdered: "",
  qtyReceived: "",
  qtyGood: "",
  qtyBad: "",
  serialNumbers: "",
  location: "",
  batchNumber: "",
  expiryDate: ""
};

function formatStatus(status) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

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

function ReceivingInspection() {
  const [form, setForm] = useState(initialForm);
  const [summary, setSummary] = useState({
    stats: {
      total_inspections: 0,
      total_received: 0,
      total_failed: 0,
      accepted_count: 0,
    },
    recentInspections: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [currentItem, setCurrentItem] = useState(initialItem);
  const [items, setItems] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: ""
  });
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

  async function loadSummary() {
    try {
      setIsLoading(true);
      const data = await fetchIncomingSummary();
      setSummary(data);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateDateRange(event) {
    const { name, value } = event.target;
    setDateRange((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateItemField(event) {
    const { name, value } = event.target;
    setCurrentItem((current) => ({
      ...current,
      [name]: value,
      // Auto-calculate good/bad quantities
      ...(name === "qtyReceived" && {
        qtyGood: value,
        qtyBad: "0",
      }),
      ...(name === "qtyBad" && {
        qtyGood: Math.max(
          0,
          (parseInt(current.qtyReceived, 10) || 0) - (parseInt(value, 10) || 0)
        ).toString(),
      }),
      ...(name === "qtyGood" && {
        qtyBad: Math.max(
          0,
          (parseInt(current.qtyReceived, 10) || 0) - (parseInt(value, 10) || 0)
        ).toString(),
      }),
    }));
  }

  function handleBarcodeScan(barcode) {
    setCurrentItem(prev => ({
      ...prev,
      barcode
    }));
    setShowBarcodeScanner(false);
  }

  function addItem() {
    const newItem = {
      ...currentItem,
      id: Date.now(),
      inspectionType: "receiving",
      inspectionDate: new Date().toISOString(),
    };
    
    setItems([...items, newItem]);
    setCurrentItem(initialItem);
    setShowItemForm(false);
    
    // Update form totals
    const newItems = [...items, newItem];
    const totalGood = newItems.reduce((sum, item) => sum + (parseInt(item.qtyGood) || 0), 0);
    const totalBad = newItems.reduce((sum, item) => sum + (parseInt(item.qtyBad) || 0), 0);
    
    setForm(prev => ({
      ...prev,
      qtyReceived: (totalGood + totalBad).toString(),
      qtyPassed: totalGood.toString(),
      qtyFailed: totalBad.toString(),
    }));
  }

  function removeItem(itemId) {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    
    // Recalculate totals
    const totalGood = updatedItems.reduce((sum, item) => sum + (parseInt(item.qtyGood) || 0), 0);
    const totalBad = updatedItems.reduce((sum, item) => sum + (parseInt(item.qtyBad) || 0), 0);
    
    setForm(prev => ({
      ...prev,
      qtyReceived: (totalGood + totalBad).toString(),
      qtyPassed: totalGood.toString(),
      qtyFailed: totalBad.toString(),
    }));
  }

  function calculateFailureRate() {
    const totalInspections = items.length;
    const failedItems = items.filter(item => parseInt(item.qtyBad) > 0).length;
    return totalInspections > 0 ? ((failedItems / totalInspections) * 100).toFixed(2) : 0;
  }

  function getProductTrends() {
    const productStats = {};
    items.forEach(item => {
      if (!productStats[item.partNumber]) {
        productStats[item.partNumber] = {
          totalInspections: 0,
          totalFailed: 0,
          failureRate: 0
        };
      }
      productStats[item.partNumber].totalInspections++;
      if (parseInt(item.qtyBad) > 0) {
        productStats[item.partNumber].totalFailed++;
      }
    });
    
    Object.keys(productStats).forEach(partNumber => {
      const stats = productStats[partNumber];
      stats.failureRate = ((stats.totalFailed / stats.totalInspections) * 100).toFixed(2);
    });
    
    return productStats;
  }

  function getFilteredInspections() {
    if (!dateRange.startDate && !dateRange.endDate) {
      return summary.recentInspections;
    }
    
    return summary.recentInspections.filter(inspection => {
      const inspectionDate = new Date(inspection.created_at);
      const start = dateRange.startDate ? new Date(dateRange.startDate) : new Date(0);
      const end = dateRange.endDate ? new Date(dateRange.endDate) : new Date();
      return inspectionDate >= start && inspectionDate <= end;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Save receiving inspection with enhanced traceability data
      const qcData = {
        ...form,
        items: items.map(item => ({
          ...item,
          inspectionType: "receiving",
          inspectionDate: new Date().toISOString(),
          failureRate: parseInt(item.qtyBad) > 0 ? ((parseInt(item.qtyBad) / parseInt(item.qtyReceived)) * 100).toFixed(2) : 0
        })),
        qtyReceived: Number(form.qtyReceived),
        qtyPassed: Number(form.qtyPassed),
        qtyFailed: Number(form.qtyFailed),
        supplierId: Number(form.supplierId),
        inspectorId: Number(form.inspectorId),
        overallFailureRate: calculateFailureRate(),
        productTrends: getProductTrends()
      };

      const data = await createIncomingQC(qcData);

      setMessage({
        type: "success",
        text: `Receiving inspection saved successfully. Overall failure rate: ${calculateFailureRate()}%`,
      });

      // Reset form
      setForm(initialForm);
      setItems([]);
      await loadSummary();
    } catch (error) {
      const serverMessage = error.response?.data?.message || error.message;
      const validationErrors = error.response?.data?.errors;

      setMessage({
        type: "error",
        text: validationErrors 
          ? `${serverMessage}: ${validationErrors.join(" ")}` 
          : serverMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const totalInspections = summary.stats.total_inspections ?? 0;
  const totalReceived = summary.stats.total_received ?? 0;
  const totalFailed = summary.stats.total_failed ?? 0;
  const filteredInspections = getFilteredInspections();
  const productTrends = getProductTrends();

  return (
    <section className="content-grid">
      <article className="panel">
        <div className="panel-header">
          <div>
            <h2>Receiving Inspection</h2>
            <p className="subtle">Incoming quality control with barcode tracking and traceability</p>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="quantity-grid">
          <div className="quantity-chip received">
            <strong>{totalInspections}</strong>
            <span>Total inspections</span>
          </div>
          <div className="quantity-chip passed">
            <strong>{totalReceived}</strong>
            <span>Total quantity received</span>
          </div>
          <div className="quantity-chip failed">
            <strong>{totalFailed}</strong>
            <span>Total failed quantity</span>
          </div>
          <div className="quantity-chip">
            <strong>{calculateFailureRate()}%</strong>
            <span>Failure rate</span>
          </div>
        </div>

        {/* Date Range Filter */}
        <div style={{
          background: "#f8f9fa",
          padding: "15px",
          borderRadius: "4px",
          marginBottom: "20px"
        }}>
          <h4>Filter by Date Range</h4>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "10px", alignItems: "end"}}>
            <div>
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={updateDateRange}
                style={{width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px"}}
              />
            </div>
            <div>
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={updateDateRange}
                style={{width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px"}}
              />
            </div>
            <button
              type="button"
              onClick={() => setDateRange({startDate: "", endDate: ""})}
              style={{
                padding: "8px 16px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                background: "#f5f5f5",
                cursor: "pointer"
              }}
            >
              Clear Filter
            </button>
          </div>
        </div>

        {/* Product Trends */}
        {Object.keys(productTrends).length > 0 && (
          <div style={{
            background: "#f8f9fa",
            padding: "15px",
            borderRadius: "4px",
            marginBottom: "20px"
          }}>
            <h4>Product Failure Trends</h4>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px"}}>
              {Object.entries(productTrends).map(([partNumber, stats]) => (
                <div key={partNumber} style={{
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "10px",
                  background: "white"
                }}>
                  <strong>{partNumber}</strong>
                  <div style={{fontSize: "12px", color: "#666"}}>
                    <div>Inspections: {stats.totalInspections}</div>
                    <div>Failed: {stats.totalFailed}</div>
                    <div style={{color: stats.failureRate > 10 ? "#dc3545" : "#28a745"}}>
                      Failure Rate: {stats.failureRate}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="poNumber">PO Number</label>
            <input
              id="poNumber"
              name="poNumber"
              value={form.poNumber}
              onChange={updateField}
              placeholder="PO-2026-0042"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="supplierId">Supplier ID</label>
            <input
              id="supplierId"
              name="supplierId"
              type="number"
              min="1"
              value={form.supplierId}
              onChange={updateField}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="deliveryDate">Delivery Date</label>
            <input
              id="deliveryDate"
              name="deliveryDate"
              type="date"
              value={form.deliveryDate}
              onChange={updateField}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="inspectorId">Inspector ID</label>
            <input
              id="inspectorId"
              name="inspectorId"
              type="number"
              min="1"
              value={form.inspectorId}
              onChange={updateField}
              required
            />
          </div>

          {/* Items Section with Barcode Tracking */}
          <div className="field" style={{gridColumn: "1 / -1"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px"}}>
              <h4>Items ({items.length})</h4>
              <button
                type="button"
                onClick={() => setShowItemForm(true)}
                style={{
                  padding: "5px 10px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                + Add Item
              </button>
            </div>

            {/* Items List */}
            {items.map((item, index) => (
              <div key={item.id} style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "10px",
                marginBottom: "10px",
                background: "#f9f9f9"
              }}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                  <div>
                    <strong>Item {index + 1}</strong>
                    <span style={{marginLeft: "10px", color: "#666"}}>{item.partNumber}</span>
                    {item.barcode && (
                      <span style={{marginLeft: "10px", color: "#007bff"}}>
                        <small>Barcode: {item.barcode}</small>
                      </span>
                    )}
                  </div>
                  <div style={{display: "flex", gap: "10px"}}>
                    <button
                      type="button"
                      onClick={() => setCurrentItem(item)}
                      style={{
                        padding: "2px 6px",
                        background: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      style={{
                        padding: "2px 6px",
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginTop: "10px"}}>
                  <div>
                    <small style={{color: "#666"}}>Ordered: {item.qtyOrdered || "N/A"}</small>
                  </div>
                  <div>
                    <small style={{color: "#666"}}>Received: {item.qtyReceived}</small>
                  </div>
                  <div>
                    <small style={{color: "#28a745"}}>Good: {item.qtyGood}</small>
                  </div>
                  <div>
                    <small style={{color: "#dc3545"}}>Bad: {item.qtyBad}</small>
                  </div>
                </div>
                <div style={{marginTop: "10px"}}>
                  <small style={{color: "#666"}}>{item.description}</small>
                </div>
                {item.batchNumber && (
                  <div style={{marginTop: "5px"}}>
                    <small style={{color: "#666"}}>Batch: {item.batchNumber}</small>
                  </div>
                )}
                {item.expiryDate && (
                  <div style={{marginTop: "5px"}}>
                    <small style={{color: "#666"}}>Expiry: {item.expiryDate}</small>
                  </div>
                )}
              </div>
            ))}

            {/* Item Form Modal */}
            {showItemForm && (
              <div style={{
                position: "fixed",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: "1000"
              }}>
                <div style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  width: "90%",
                  maxWidth: "600px"
                }}>
                  <h3 style={{marginTop: "0", marginBottom: "20px"}}>
                    {currentItem.id ? "Edit Item" : "Add New Item"}
                  </h3>
                  
                  <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px"}}>
                    <div>
                      <label>Part Number *</label>
                      <input
                        type="text"
                        name="partNumber"
                        value={currentItem.partNumber}
                        onChange={updateItemField}
                        placeholder="PCB-CTRL-001"
                        required
                        style={{width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px"}}
                      />
                    </div>
                    <div>
                      <label>Barcode</label>
                      <div style={{display: "flex", gap: "5px"}}>
                        <input
                          type="text"
                          name="barcode"
                          value={currentItem.barcode}
                          onChange={updateItemField}
                          placeholder="Scan or enter barcode"
                          style={{flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "4px"}}
                        />
                        <button
                          type="button"
                          onClick={() => setShowBarcodeScanner(true)}
                          style={{
                            padding: "8px",
                            background: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                          }}
                        >
                          Scan
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{marginTop: "10px"}}>
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={currentItem.description}
                      onChange={updateItemField}
                      placeholder="Item description..."
                      rows={2}
                      style={{width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px", resize: "vertical"}}
                    />
                  </div>

                  <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px"}}>
                    <div>
                      <label>Qty Ordered</label>
                      <input
                        type="number"
                        name="qtyOrdered"
                        value={currentItem.qtyOrdered}
                        onChange={updateItemField}
                        placeholder="100"
                        style={{width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px"}}
                      />
                    </div>
                    <div>
                      <label>Qty Received</label>
                      <input
                        type="number"
                        name="qtyReceived"
                        value={currentItem.qtyReceived}
                        onChange={updateItemField}
                        placeholder="100"
                        required
                        style={{width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px"}}
                      />
                    </div>
                    <div>
                      <label>Qty Good</label>
                      <input
                        type="number"
                        name="qtyGood"
                        value={currentItem.qtyGood}
                        onChange={updateItemField}
                        placeholder="100"
                        style={{width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px"}}
                      />
                    </div>
                  </div>

                  <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px"}}>
                    <div>
                      <label>Qty Bad</label>
                      <input
                        type="number"
                        name="qtyBad"
                        value={currentItem.qtyBad}
                        onChange={updateItemField}
                        placeholder="0"
                        style={{width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px"}}
                      />
                    </div>
                    <div>
                      <label>Batch Number</label>
                      <input
                        type="text"
                        name="batchNumber"
                        value={currentItem.batchNumber}
                        onChange={updateItemField}
                        placeholder="Batch #"
                        style={{width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px"}}
                      />
                    </div>
                    <div>
                      <label>Expiry Date</label>
                      <input
                        type="date"
                        name="expiryDate"
                        value={currentItem.expiryDate}
                        onChange={updateItemField}
                        style={{width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px"}}
                      />
                    </div>
                  </div>

                  <div style={{marginTop: "10px"}}>
                    <label>Serial Numbers</label>
                    <textarea
                      name="serialNumbers"
                      value={currentItem.serialNumbers}
                      onChange={updateItemField}
                      placeholder="Enter serial numbers (comma separated)..."
                      rows={2}
                      style={{width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px", resize: "vertical"}}
                    />
                  </div>

                  <div style={{marginTop: "10px"}}>
                    <label>Storage Location</label>
                    <input
                      type="text"
                      name="location"
                      value={currentItem.location}
                      onChange={updateItemField}
                      placeholder="Storage location..."
                      style={{width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px"}}
                    />
                  </div>

                  <div style={{display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px"}}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowItemForm(false);
                        setCurrentItem(initialItem);
                      }}
                      style={{
                        padding: "8px 16px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        background: "#f5f5f5",
                        cursor: "pointer"
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={addItem}
                      style={{
                        padding: "8px 16px",
                        border: "none",
                        borderRadius: "4px",
                        background: "#007bff",
                        color: "white",
                        cursor: "pointer"
                      }}
                    >
                      {currentItem.id ? "Update Item" : "Add Item"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Barcode Scanner Modal */}
            {showBarcodeScanner && (
              <div style={{
                position: "fixed",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: "1001"
              }}>
                <div style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  width: "90%",
                  maxWidth: "400px"
                }}>
                  <h3 style={{marginTop: "0", marginBottom: "20px"}}>Barcode Scanner</h3>
                  <div style={{
                    border: "2px dashed #007bff",
                    borderRadius: "4px",
                    padding: "40px",
                    textAlign: "center",
                    background: "#f8f9fa"
                  }}>
                    <div style={{fontSize: "48px", marginBottom: "10px"}}>Scan Barcode</div>
                    <p style={{color: "#666"}}>Position barcode in scanner area</p>
                    <input
                      type="text"
                      placeholder="Or enter barcode manually"
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        marginTop: "10px"
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleBarcodeScan(e.target.value);
                        }
                      }}
                    />
                  </div>
                  <div style={{display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px"}}>
                    <button
                      type="button"
                      onClick={() => setShowBarcodeScanner(false)}
                      style={{
                        padding: "8px 16px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        background: "#f5f5f5",
                        cursor: "pointer"
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="field full">
            <label htmlFor="comments">Comments</label>
            <textarea
              id="comments"
              name="comments"
              rows="5"
              value={form.comments}
              onChange={updateField}
              placeholder="Capture defects, lot condition, missing documents, or supplier concerns."
            />
          </div>

          <div className="actions field full">
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving receiving inspection..." : "Submit Receiving Inspection"}
            </button>
            <span className="subtle">
              All items are tracked with barcode and traceability data for future reference.
            </span>
          </div>
        </form>

        {message && <div className={`message ${message.type}`}>{message.text}</div>}
      </article>

      {/* Recent Inspections with Filtering */}
      <aside className="panel">
        <div className="panel-header">
          <div>
            <h3>Recent Receiving Inspections</h3>
            <p className="subtle">
              {filteredInspections.length} inspections found in selected date range.
            </p>
          </div>
        </div>

        <div className="list-card">
          {isLoading ? (
            <div className="empty-state">Loading inspection history...</div>
          ) : filteredInspections.length === 0 ? (
            <div className="empty-state">
              No inspection data found. Submit the first receiving inspection to populate the feed.
            </div>
          ) : (
            filteredInspections.map((inspection) => (
              <article className="inspection-item" key={inspection.id}>
                <header>
                  <div>
                    <h4>{inspection.po_number}</h4>
                    <p>{inspection.part_number}</p>
                    {inspection.barcode && (
                      <p><small>Barcode: {inspection.barcode}</small></p>
                    )}
                  </div>
                  <span className={`status-pill ${formatStatus(inspection.status)}`}>
                    {inspection.status}
                  </span>
                </header>
                <div className="inspection-details">
                  <p><strong>Quantity:</strong> {inspection.qty_received} received, {inspection.qty_passed} passed, {inspection.qty_failed} failed</p>
                  <p><strong>Inspector:</strong> {inspection.inspector_name}</p>
                  <p><strong>Date:</strong> {formatDate(inspection.created_at)}</p>
                  {inspection.failureRate && (
                    <p><strong>Failure Rate:</strong> {inspection.failureRate}%</p>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </aside>
    </section>
  );
}

export default ReceivingInspection;
