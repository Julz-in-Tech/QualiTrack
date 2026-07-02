import { formatStatus, formatDate } from "../utils/formatters";
import { generateInspectionPDF, generateSummaryPDF } from "../utils/pdfGenerator";

export function ReceivingInspectionForm({ 
  form, 
  updateField, 
  isSubmitting, 
  handleSubmit, 
  items,
  calculateFailureRate,
  setShowItemForm
}) {
  const handleDownloadPDF = async () => {
    try {
      await generateInspectionPDF(form, items);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleDownloadSummary = async () => {
    try {
      await generateSummaryPDF(form, items);
    } catch (error) {
      console.error("Error generating summary PDF:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e5e7eb"
      }}>
        <h2 style={{
          fontSize: "24px",
          fontWeight: "600",
          marginBottom: "25px",
          color: "#1f2937",
          borderBottom: "2px solid #3b82f6",
          paddingBottom: "10px"
        }}>
          Receiving Inspection
        </h2>

        {/* Basic Information */}
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{
            fontSize: "18px",
            fontWeight: "500",
            marginBottom: "15px",
            color: "#374151"
          }}>
            Basic Information
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px"
          }}>
            <div>
              <label style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
                color: "#374151"
              }}>
                Purchase Order Number *
              </label>
              <input
                type="text"
                name="poNumber"
                value={form.poNumber}
                onChange={updateField}
                placeholder="PO-2026-0042"
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
                color: "#374151"
              }}>
                Supplier ID *
              </label>
              <input
                type="number"
                name="supplierId"
                min="1"
                value={form.supplierId}
                onChange={updateField}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
                color: "#374151"
              }}>
                Delivery Date *
              </label>
              <input
                type="date"
                name="deliveryDate"
                value={form.deliveryDate}
                onChange={updateField}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
                color: "#374151"
              }}>
                Inspector ID *
              </label>
              <input
                type="number"
                name="inspectorId"
                min="1"
                value={form.inspectorId}
                onChange={updateField}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div style={{ marginBottom: "30px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px"
          }}>
            <h3 style={{
              fontSize: "18px",
              fontWeight: "500",
              color: "#374151",
              margin: 0
            }}>
              Items ({items.length})
            </h3>
            <button
              type="button"
              onClick={() => setShowItemForm(true)}
              style={{
                padding: "8px 16px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500"
              }}
            >
              Add Item
            </button>
          </div>

          {/* Items List */}
          <div style={{
            display: "grid",
            gap: "15px",
            maxHeight: "400px",
            overflowY: "auto"
          }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "15px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  background: "#f9fafb"
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start"
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "#1f2937",
                      marginBottom: "5px"
                    }}>
                      {item.partNumber}
                    </div>
                    {item.description && (
                      <div style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        marginBottom: "8px"
                      }}>
                        {item.description}
                      </div>
                    )}
                    {item.barcode && (
                      <div style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        marginBottom: "8px"
                      }}>
                        Barcode: {item.barcode}
                      </div>
                    )}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                      gap: "10px",
                      fontSize: "13px"
                    }}>
                      <div>
                        <span style={{ color: "#6b7280" }}>Ordered: </span>
                        <span style={{ fontWeight: "500" }}>{item.qtyOrdered || "N/A"}</span>
                      </div>
                      <div>
                        <span style={{ color: "#6b7280" }}>Received: </span>
                        <span style={{ fontWeight: "500" }}>{item.qtyReceived}</span>
                      </div>
                      <div>
                        <span style={{ color: "#6b7280" }}>Good: </span>
                        <span style={{ color: "#059669", fontWeight: "500" }}>{item.qtyGood}</span>
                      </div>
                      <div>
                        <span style={{ color: "#6b7280" }}>Bad: </span>
                        <span style={{ color: "#dc2626", fontWeight: "500" }}>{item.qtyBad}</span>
                      </div>
                    </div>
                    {item.serialNumbers && (
                      <div style={{ marginTop: "8px" }}>
                        <span style={{ color: "#6b7280", fontSize: "12px" }}>Serial: </span>
                        <span style={{ fontSize: "12px" }}>{item.serialNumbers}</span>
                      </div>
                    )}
                    {item.batchNumber && (
                      <div style={{ marginTop: "5px" }}>
                        <span style={{ color: "#6b7280", fontSize: "12px" }}>Batch: </span>
                        <span style={{ fontSize: "12px" }}>{item.batchNumber}</span>
                      </div>
                    )}
                    {item.expiryDate && (
                      <div style={{ marginTop: "5px" }}>
                        <span style={{ color: "#6b7280", fontSize: "12px" }}>Expiry: </span>
                        <span style={{ fontSize: "12px" }}>{item.expiryDate}</span>
                      </div>
                    )}
                    {item.location && (
                      <div style={{ marginTop: "5px" }}>
                        <span style={{ color: "#6b7280", fontSize: "12px" }}>Location: </span>
                        <span style={{ fontSize: "12px" }}>{item.location}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => editItem(item)}
                      style={{
                        padding: "4px 8px",
                        background: "#10b981",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
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
                        padding: "4px 8px",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div style={{ marginBottom: "30px" }}>
          <label style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "500",
            color: "#374151"
          }}>
            Comments
          </label>
          <textarea
            name="comments"
            value={form.comments}
            onChange={updateField}
            placeholder="Enter any additional comments about this inspection..."
            rows={4}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px",
              resize: "vertical"
            }}
          />
        </div>

        {/* INSPECTION CHECKLIST */}
        <div style={{ marginBottom: "30px", paddingTop: "20px", borderTop: "2px solid #e5e7eb" }}>
          <h3 style={{
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "20px",
            color: "#1f2937",
            background: "#eff6ff",
            padding: "12px",
            borderLeft: "4px solid #3b82f6",
            borderRadius: "4px"
          }}>
            Incoming Goods Receiving Inspection Checklist
          </h3>

          {/* Documentation & Verification */}
          <div style={{ marginBottom: "25px" }}>
            <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>
              1. Documentation & Verification
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="documentation_po"
                  checked={form.documentation_po}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>PO, DN, CoC, Test Reports present and verified</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="documentation_coc"
                  checked={form.documentation_coc}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>Documentation matches delivered items part no., qty, revision</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="documentation_test"
                  checked={form.documentation_test}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>Test reports & NCR/rework documentation reviewed</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="documentation_revision"
                  checked={form.documentation_revision}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>Revision info matches documentation</span>
              </label>
            </div>
          </div>

          {/* Quantity Verification */}
          <div style={{ marginBottom: "25px" }}>
            <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>
              2. Quantity Verification
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="quantity_matches"
                  checked={form.quantity_matches}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>Delivered quantity matches PO and DN</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="quantity_no_shortage"
                  checked={form.quantity_no_shortage}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>No shortages / over-delivery without approval</span>
              </label>
            </div>
          </div>

          {/* Identification & Traceability */}
          <div style={{ marginBottom: "25px" }}>
            <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>
              3. Identification & Traceability
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="identification_part"
                  checked={form.identification_part}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>Part numbers, UDI, item description readable/correct</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="identification_uid"
                  checked={form.identification_uid}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>Batch / serial numbers UDI, item description traceable</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="identification_batch"
                  checked={form.identification_batch}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>Batch numbers traceable to documentation</span>
              </label>
            </div>
          </div>

          {/* Packaging Condition */}
          <div style={{ marginBottom: "25px" }}>
            <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>
              4. Packaging Condition
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="packaging_intact"
                  checked={form.packaging_intact}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>Packaging intact, appropriate, and undamaged</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="packaging_no_damage"
                  checked={form.packaging_no_damage}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>No signs of mishandling (opened, tampered, labeled)</span>
              </label>
            </div>
          </div>

          {/* Physical Condition */}
          <div style={{ marginBottom: "25px" }}>
            <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>
              5. Physical Condition
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="physical_appearance"
                  checked={form.physical_appearance}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>Acceptable physical appearance, correct material</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="physical_material"
                  checked={form.physical_material}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>Color, cleanliness, finish and no physical contamination</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="physical_no_contamination"
                  checked={form.physical_no_contamination}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>No corrosion or contamination</span>
              </label>
            </div>
          </div>

          {/* Dimensions */}
          <div style={{ marginBottom: "25px" }}>
            <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>
              6. Dimensions
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="dimensions_met"
                  checked={form.dimensions_met}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>Dimensions meet drawing specifications</span>
              </label>
            </div>
          </div>

          {/* PCB-Specific Inspection */}
          <div style={{ marginBottom: "25px" }}>
            <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>
              7. PCB-Specific Inspection (if applicable)
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="pcb_revision"
                  checked={form.pcb_revision}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>PCB revision matches BOM / ECO</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="pcb_eco"
                  checked={form.pcb_eco}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>ECO sticker present and correct</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="pcb_esd"
                  checked={form.pcb_esd}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>ESD protection (ESD bags, labels) present</span>
              </label>
            </div>
          </div>

          {/* Warranty / Repairs */}
          <div style={{ marginBottom: "25px" }}>
            <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>
              8. Warranty / Repairs
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="warranty_claim"
                  checked={form.warranty_claim}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>Warranty Claim No., Serial No match customer/internal records</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="warranty_docs"
                  checked={form.warranty_docs}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>Supporting documents & traceability provided</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="warranty_fault"
                  checked={form.warranty_fault}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>Fault Description provided</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="warranty_match"
                  checked={form.warranty_match}
                  onChange={updateField}
                  style={{ cursor: "pointer" }}
                />
                <span>Warranty Match customer/internal records</span>
              </label>
            </div>
          </div>

          {/* Disposition & Follow-up Actions */}
          <div style={{ marginBottom: "25px" }}>
            <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>
              9. Disposition & Follow-up Actions
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
              {["ACCEPTED", "CONDITIONALLY_ACCEPTED", "REJECTED", "QUARANTINED", "REWORK_REQUIRED"].map(option => (
                <label key={option} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="disposition"
                    value={option}
                    checked={form.disposition === option}
                    onChange={updateField}
                    style={{ cursor: "pointer" }}
                  />
                  <span>{option.replace(/_/g, " ")}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Final Sign-off */}
          <div style={{ marginBottom: "25px", padding: "15px", background: "#f9fafb", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
            <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "15px" }}>
              10. Final Sign-off
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "500",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Inspector Name
                </label>
                <input
                  type="text"
                  name="inspectorName"
                  value={form.inspectorName}
                  onChange={updateField}
                  placeholder="Full name"
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "14px"
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "500",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Signature
                </label>
                <input
                  type="text"
                  name="inspectorSignature"
                  value={form.inspectorSignature}
                  onChange={updateField}
                  placeholder="Digital signature or initials"
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "14px"
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "500",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Inspection Date
                </label>
                <input
                  type="date"
                  name="inspectionDate"
                  value={form.inspectionDate}
                  onChange={updateField}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "14px"
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit and Download Buttons */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "20px",
          borderTop: "1px solid #e5e7eb",
          flexWrap: "wrap",
          gap: "10px"
        }}>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            {items.length > 0 && (
              <span>Failure Rate: <strong>{calculateFailureRate()}%</strong></span>
            )}
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {/* Download Full Report Button */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={items.length === 0}
              style={{
                padding: "12px 20px",
                background: items.length === 0 ? "#9ca3af" : "#10b981",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: items.length === 0 ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "500"
              }}
            >
              📄 Download Report
            </button>
            
            {/* Download Summary Button */}
            <button
              type="button"
              onClick={handleDownloadSummary}
              disabled={items.length === 0}
              style={{
                padding: "12px 20px",
                background: items.length === 0 ? "#9ca3af" : "#f59e0b",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: items.length === 0 ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "500"
              }}
            >
              📊 Download Summary
            </button>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              style={{
                padding: "12px 24px",
                background: isSubmitting || items.length === 0 ? "#9ca3af" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isSubmitting || items.length === 0 ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "500"
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit Inspection"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
