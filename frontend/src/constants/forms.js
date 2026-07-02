/**
 * Constants for form initial states and validation rules
 */

export const INITIAL_FORM = {
  poNumber: "",
  supplierId: "1",
  deliveryDate: "",
  inspectorId: "2",
  comments: "",
  items: [],
  // Inspection checklist
  documentation_po: false,
  documentation_coc: false,
  documentation_test: false,
  documentation_revision: false,
  quantity_matches: false,
  quantity_no_shortage: false,
  identification_part: false,
  identification_uid: false,
  identification_batch: false,
  packaging_intact: false,
  packaging_no_damage: false,
  physical_appearance: false,
  physical_material: false,
  physical_no_contamination: false,
  dimensions_met: false,
  pcb_revision: false,
  pcb_eco: false,
  pcb_esd: false,
  warranty_claim: false,
  warranty_docs: false,
  warranty_fault: false,
  warranty_match: false,
  disposition: "ACCEPTED",
  inspectorName: "",
  inspectorSignature: "",
  inspectionDate: new Date().toISOString().split('T')[0]
};

export const INITIAL_ITEM = {
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

export const REQUIRED_FIELDS = {
  form: ['poNumber', 'supplierId', 'deliveryDate', 'inspectorId'],
  item: ['partNumber', 'qtyReceived']
};

export const VALIDATION_MESSAGES = {
  partNumberRequired: "Part number is required",
  qtyReceivedRequired: "Quantity received is required"
};
