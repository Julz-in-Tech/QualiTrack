import { useEffect, useState } from "react";
import { createIncomingQC, fetchIncomingSummary } from "../services/api";

const initialForm = {
  poNumber: "",
  supplierId: "1",
  partNumber: "PCB-CTRL-001",
  qtyReceived: "100",
  qtyPassed: "100",
  qtyFailed: "0",
  inspectorId: "2",
  comments: "",
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

function IncomingQC() {
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

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const data = await createIncomingQC({
        ...form,
        qtyReceived: Number(form.qtyReceived),
        qtyPassed: Number(form.qtyPassed),
        qtyFailed: Number(form.qtyFailed),
        supplierId: Number(form.supplierId),
        inspectorId: Number(form.inspectorId),
      });

      setMessage({
        type: "success",
        text: data.data.ncr
          ? `Inspection saved and NCR ${data.data.ncr.ncr_number} was opened.`
          : "Inspection saved successfully with no NCR required.",
      });

      setForm(initialForm);
      await loadSummary();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const totalInspections = summary.stats.total_inspections ?? 0;
  const totalReceived = summary.stats.total_received ?? 0;
  const totalFailed = summary.stats.total_failed ?? 0;

  return (
    <section className="content-grid">
      <article className="panel">
        <div className="panel-header">
          <div>
            <h2>Log Incoming Inspection</h2>
            <p className="subtle">Start with the first production-safe workflow in the system.</p>
          </div>
        </div>

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
        </div>

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
            <label htmlFor="partNumber">Part Number</label>
            <input
              id="partNumber"
              name="partNumber"
              value={form.partNumber}
              onChange={updateField}
              placeholder="PCB-CTRL-001"
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

          <div className="field">
            <label htmlFor="qtyReceived">Quantity Received</label>
            <input
              id="qtyReceived"
              name="qtyReceived"
              type="number"
              min="0"
              value={form.qtyReceived}
              onChange={updateField}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="qtyPassed">Quantity Passed</label>
            <input
              id="qtyPassed"
              name="qtyPassed"
              type="number"
              min="0"
              value={form.qtyPassed}
              onChange={updateField}
              required
            />
          </div>

          <div className="field full">
            <label htmlFor="qtyFailed">Quantity Failed</label>
            <input
              id="qtyFailed"
              name="qtyFailed"
              type="number"
              min="0"
              value={form.qtyFailed}
              onChange={updateField}
              required
            />
          </div>

          <div className="field full">
            <label htmlFor="comments">Inspection Notes</label>
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
              {isSubmitting ? "Saving inspection..." : "Submit Incoming QC"}
            </button>
            <span className="subtle">
              If the failed quantity is greater than 0, the backend automatically creates a linked NCR.
            </span>
          </div>
        </form>

        {message ? <div className={`message ${message.type}`}>{message.text}</div> : null}
      </article>

      <aside className="panel">
        <div className="panel-header">
          <div>
            <h3>Recent Inspections</h3>
            <p className="subtle">
              {summary.stats.accepted_count ?? 0} accepted inspections captured so far.
            </p>
          </div>
        </div>

        <div className="list-card">
          {isLoading ? (
            <div className="empty-state">Loading inspection history...</div>
          ) : summary.recentInspections.length === 0 ? (
            <div className="empty-state">
              No inspection data yet. Submit the first incoming QC record to populate the feed.
            </div>
          ) : (
            summary.recentInspections.map((inspection) => (
              <article className="inspection-item" key={inspection.id}>
                <header>
                  <div>
                    <h4>{inspection.po_number}</h4>
                    <p>{inspection.part_number}</p>
                  </div>
                  <span className={`status-pill ${formatStatus(inspection.status)}`}>
                    {inspection.status}
                  </span>
                </header>
                <p>Supplier: {inspection.supplier_name}</p>
                <p>Inspector: {inspection.inspector_name}</p>
                <p>
                  Received {inspection.qty_received} / Failed {inspection.qty_failed}
                </p>
                <p>{formatDate(inspection.created_at)}</p>
              </article>
            ))
          )}
        </div>
      </aside>
    </section>
  );
}

export default IncomingQC;
