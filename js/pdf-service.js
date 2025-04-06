export class PDFService {
  constructor() {
    // Initialize jsPDF
    this.jsPDF = window.jspdf.jsPDF
    this.autoTable = window.jspdf.autoTable
  }

  // Export expenses to PDF
  exportToPDF(expenses, source) {
    // Create new PDF document
    const doc = new this.jsPDF()

    // Add title
    const title = `${source.toUpperCase()} Expenses Report`
    doc.setFontSize(18)
    doc.text(title, 14, 22)

    // Add date
    const today = new Date()
    const dateStr = today.toLocaleDateString()
    doc.setFontSize(11)
    doc.text(`Generated on: ${dateStr}`, 14, 30)

    // Calculate total
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    doc.text(`Total: ₱${total.toLocaleString()}`, 14, 38)

    // Prepare table data
    const tableColumn = ["Date", "Amount (₱)", "Note"]
    const tableRows = []

    expenses.forEach((expense) => {
      const formattedDate = this.formatDate(expense.date)
      const formattedAmount = expense.amount.toLocaleString()

      tableRows.push([formattedDate, formattedAmount, expense.note])
    })

    // Add table to document
    this.autoTable(doc, {
      startY: 45,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [200, 200, 200],
      },
      headStyles: {
        fillColor: [66, 97, 238],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    })

    // Save the PDF
    doc.save(`${source}_expenses_${this.formatDateForFilename(today)}.pdf`)
  }

  // Format date for display (DD-MM-YY)
  formatDate(dateString) {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear().toString().slice(2)
    return `${day}-${month}-${year}`
  }

  // Format date for filename (YYYYMMDD)
  formatDateForFilename(date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    return `${year}${month}${day}`
  }
}

