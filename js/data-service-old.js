export class DataService {
  constructor() {
    this.cashData = []
    this.gcashData = []
  }

  // Load data from JSON files
  async loadData() {
    try {
      // In a real app, this would fetch from actual JSON files
      // For this demo, we'll use mock data
      this.cashData = [
        {
          date: "2025-04-26",
          amount: 5000,
          note: "New phone",
        },
        {
          date: "2025-04-25",
          amount: 1250,
          note: "Dinner",
        },
        {
          date: "2025-04-24",
          amount: 200,
          note: "Snacks",
        },
      ]

      this.gcashData = [
        {
          date: "2025-04-23",
          amount: 8500,
          note: "Laptop repair",
        },
        {
          date: "2025-04-22",
          amount: 3500,
          note: "Groceries",
        },
        {
          date: "2025-04-21",
          amount: 4500,
          note: "Utility bills",
        },
      ]

      // Sort data by date (newest first)
      this.cashData.sort((a, b) => new Date(b.date) - new Date(a.date))
      this.gcashData.sort((a, b) => new Date(b.date) - new Date(a.date))

      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Get cash data
  getCashData() {
    return [...this.cashData]
  }

  // Get GCash data
  getGCashData() {
    return [...this.gcashData]
  }

  // Get all data combined
  getAllData() {
    return [
      ...this.cashData.map((item) => ({ ...item, source: "cash" })),
      ...this.gcashData.map((item) => ({ ...item, source: "gcash" })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  // Get cash total
  getCashTotal() {
    return this.cashData.reduce((total, item) => total + item.amount, 0)
  }

  // Get GCash total
  getGCashTotal() {
    return this.gcashData.reduce((total, item) => total + item.amount, 0)
  }

  // Get total of all expenses
  getTotal() {
    return this.getCashTotal() + this.getGCashTotal()
  }

  // Add a new expense
  async addExpense(date, amount, note, source) {
    try {
      const newExpense = {
        date,
        amount,
        note,
      }

      if (source === "cash") {
        // this.cashData.unshift(newExpense)

        localStorage.setItem('expenses', JSON.stringify(expenses));
      } else {
        this.gcashData.unshift(newExpense)
      }

      // In a real app, this would save to JSON files
      // For this demo, we'll just return success
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Format date for display (DD-MM-YY)
  formatDate(dateString) {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear().toString().slice(2)
    return `${day}-${month}-${year}`
  }

  // Format amount for display (with ₱ symbol)
  formatAmount(amount) {
    return `₱${amount.toLocaleString()}`
  }
}

