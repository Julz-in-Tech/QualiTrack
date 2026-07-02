import jsPDF from 'jspdf';

/**
 * Generates a PDF of the inspection form
 * @param {Object} form - Form data containing all inspection details
 * @param {Array} items - Array of inspected items
 * @returns {Promise<void>}
 */
export const generateInspectionPDF = async (form, items) => {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxWidth = pageWidth - 2 * margin;
  
  // Helper function to add text with word wrapping
  const addWrappedText = (text, x, y, width, fontSize = 10, options = {}) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, width);
    doc.text(lines, x, y, options);
    return y + (lines.length * fontSize * 0.35);
  };
  
  // Helper function to check if we need a new page
  const checkPageBreak = (minSpace) => {
    if (yPosition + minSpace > pageHeight - 10) {
      doc.addPage();
      yPosition = 20;
    }
  };
  
  // Title
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('INCOMING GOODS RECEIVING INSPECTION', margin, yPosition);
  yPosition += 12;
  
  // Date and Reference
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  const now = new Date().toLocaleDateString();
  doc.text(`Generated: ${now}`, margin, yPosition);
  yPosition += 6;
  
  checkPageBreak(100);
  
  // Basic Information Section
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('BASIC INFORMATION', margin, yPosition);
  yPosition += 8;
  
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  
  const basicInfo = [
    { label: 'PO Number:', value: form.poNumber || 'N/A' },
    { label: 'Supplier ID:', value: form.supplierId || 'N/A' },
    { label: 'Delivery Date:', value: form.deliveryDate || 'N/A' },
    { label: 'Inspector ID:', value: form.inspectorId || 'N/A' }
  ];
  
  basicInfo.forEach(item => {
    doc.text(`${item.label} ${item.value}`, margin + 5, yPosition);
    yPosition += 5;
  });
  
  yPosition += 5;
  checkPageBreak(80);
  
  // Items List
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('RECEIVED ITEMS', margin, yPosition);
  yPosition += 8;
  
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  
  items.forEach((item, index) => {
    checkPageBreak(30);
    doc.setFont(undefined, 'bold');
    doc.text(`Item ${index + 1}: ${item.partNumber}`, margin + 5, yPosition);
    yPosition += 5;
    
    doc.setFont(undefined, 'normal');
    const itemInfo = [
      `Description: ${item.description || 'N/A'}`,
      `Qty Ordered: ${item.qtyOrdered || '0'} | Qty Received: ${item.qtyReceived || '0'} | Qty Good: ${item.qtyGood || '0'}`,
      `Batch: ${item.batchNumber || 'N/A'} | Location: ${item.location || 'N/A'}`
    ];
    
    itemInfo.forEach(info => {
      yPosition = addWrappedText(info, margin + 10, yPosition, maxWidth - 10, 8);
    });
    
    yPosition += 3;
  });
  
  yPosition += 5;
  checkPageBreak(120);
  
  // Inspection Checklist
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('INSPECTION CHECKLIST', margin, yPosition);
  yPosition += 8;
  
  doc.setFontSize(9);
  
  const checklistSections = [
    {
      title: 'Documentation & Verification',
      items: [
        { label: 'PO Received', value: form.documentation_po },
        { label: 'CoC Present', value: form.documentation_coc },
        { label: 'Test Reports', value: form.documentation_test },
        { label: 'Revision Verified', value: form.documentation_revision }
      ]
    },
    {
      title: 'Quantity Verification',
      items: [
        { label: 'Qty Matches Order', value: form.quantity_matches },
        { label: 'No Shortage', value: form.quantity_no_shortage }
      ]
    },
    {
      title: 'Identification & Traceability',
      items: [
        { label: 'Part Number Verified', value: form.identification_part },
        { label: 'UID Present', value: form.identification_uid },
        { label: 'Batch Traceability', value: form.identification_batch }
      ]
    },
    {
      title: 'Packaging Condition',
      items: [
        { label: 'Packaging Intact', value: form.packaging_intact },
        { label: 'No Visible Damage', value: form.packaging_no_damage }
      ]
    },
    {
      title: 'Physical Condition',
      items: [
        { label: 'Appearance OK', value: form.physical_appearance },
        { label: 'Material Correct', value: form.physical_material },
        { label: 'No Contamination', value: form.physical_no_contamination }
      ]
    },
    {
      title: 'Dimensions',
      items: [
        { label: 'Meets Specifications', value: form.dimensions_met }
      ]
    },
    {
      title: 'PCB-Specific Inspection',
      items: [
        { label: 'Revision Correct', value: form.pcb_revision },
        { label: 'ECO Stickers Present', value: form.pcb_eco },
        { label: 'ESD Protection', value: form.pcb_esd }
      ]
    },
    {
      title: 'Warranty/Repairs',
      items: [
        { label: 'Warranty Claim Match', value: form.warranty_claim },
        { label: 'Supporting Docs', value: form.warranty_docs },
        { label: 'Fault Description', value: form.warranty_fault },
        { label: 'Match Specification', value: form.warranty_match }
      ]
    }
  ];
  
  checklistSections.forEach(section => {
    checkPageBreak(40);
    doc.setFont(undefined, 'bold');
    doc.text(section.title, margin + 5, yPosition);
    yPosition += 5;
    
    doc.setFont(undefined, 'normal');
    section.items.forEach(item => {
      const status = item.value ? '✓' : '✗';
      doc.text(`  ${status} ${item.label}`, margin + 10, yPosition);
      yPosition += 4;
    });
    
    yPosition += 2;
  });
  
  checkPageBreak(50);
  
  // Disposition
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('DISPOSITION', margin, yPosition);
  yPosition += 6;
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  const dispositionText = `Status: ${form.disposition || 'ACCEPTED'}`;
  doc.text(dispositionText, margin + 5, yPosition);
  yPosition += 8;
  
  // Comments
  if (form.comments) {
    checkPageBreak(30);
    doc.setFont(undefined, 'bold');
    doc.text('COMMENTS/NOTES', margin, yPosition);
    yPosition += 5;
    
    doc.setFont(undefined, 'normal');
    yPosition = addWrappedText(form.comments, margin + 5, yPosition, maxWidth - 10, 9);
    yPosition += 5;
  }
  
  checkPageBreak(50);
  
  // Sign-off Section
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('FINAL SIGN-OFF', margin, yPosition);
  yPosition += 7;
  
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text(`Inspector Name: ${form.inspectorName || '________________'}`, margin + 5, yPosition);
  yPosition += 5;
  
  doc.text(`Date: ${form.inspectionDate || new Date().toISOString().split('T')[0]}`, margin + 5, yPosition);
  yPosition += 5;
  
  doc.text(`Signature: ${form.inspectorSignature ? '[Signed]' : '________________'}`, margin + 5, yPosition);
  
  // Save PDF
  const filename = `Inspection_${form.poNumber}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};

/**
 * Generates a summary report of inspection results
 * @param {Object} form - Form data
 * @param {Array} items - Array of inspected items
 * @returns {Promise<void>}
 */
export const generateSummaryPDF = async (form, items) => {
  const doc = new jsPDF();
  const margin = 15;
  let yPosition = 20;
  
  // Title
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('INSPECTION SUMMARY REPORT', margin, yPosition);
  yPosition += 10;
  
  // Overview
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`PO #: ${form.poNumber}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Inspector: ${form.inspectorName}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Disposition: ${form.disposition}`, margin, yPosition);
  yPosition += 10;
  
  // Items Summary
  doc.setFont(undefined, 'bold');
  doc.text(`Items Inspected: ${items.length}`, margin, yPosition);
  yPosition += 5;
  
  const totalOrdered = items.reduce((sum, item) => sum + (parseInt(item.qtyOrdered) || 0), 0);
  const totalReceived = items.reduce((sum, item) => sum + (parseInt(item.qtyReceived) || 0), 0);
  const totalGood = items.reduce((sum, item) => sum + (parseInt(item.qtyGood) || 0), 0);
  
  doc.setFont(undefined, 'normal');
  doc.text(`Total Qty Ordered: ${totalOrdered}`, margin + 5, yPosition);
  yPosition += 4;
  doc.text(`Total Qty Received: ${totalReceived}`, margin + 5, yPosition);
  yPosition += 4;
  doc.text(`Total Qty Good: ${totalGood}`, margin + 5, yPosition);
  yPosition += 4;
  
  const failureRate = totalReceived > 0 
    ? (((totalReceived - totalGood) / totalReceived) * 100).toFixed(2)
    : 0;
  
  doc.text(`Failure Rate: ${failureRate}%`, margin + 5, yPosition);
  
  const filename = `Summary_${form.poNumber}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};
