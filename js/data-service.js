export class DataService {
  constructor() {
    this.cashData = []
    this.gcashData = []
  }

  // Load data from JSON files
  async loadData() {
    try {
      this.cashData = JSON.parse(localStorage.getItem('cash')) ?? [];
      this.gcashData = JSON.parse(localStorage.getItem('gcash')) ?? [];

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
    this.loadData();

    try {
      const newExpense = {
        date,
        amount,
        note,
      }

      if (source === "cash") {
        this.cashData.unshift(newExpense)
        localStorage.setItem(source, JSON.stringify(this.cashData)); 

      } else {
        this.gcashData.unshift(newExpense)
        localStorage.setItem(source, JSON.stringify(this.gcashData));  
      }

      // In a real app, this would save to JSON files
      // For this demo, we'll just return success
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  deleteExpense(source, index) {
    try {
      const key = `${source}`;
      const data = localStorage.getItem(key);
      let expenses = data ? JSON.parse(data) : [];
    
      // Remove the item by index
      expenses.splice(index, 1);
    
      // Save the updated list
      localStorage.setItem(key, JSON.stringify(expenses));

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

