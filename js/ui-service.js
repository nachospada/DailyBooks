export class UIService {
  constructor() {
    this.currentView = "dashboard-view"
    this.activeSource = "cash"    
  }

  // Initialize UI with data
  initializeUI(cashData, gcashData, user) {
    // Set user info
    document.getElementById("username").textContent = user.username
    document.getElementById("username-input").value = user.username
    document.getElementById("user-avatar").src = user.avatar
    document.getElementById("settings-avatar").src = user.avatar

    // Set initial source to cash
    this.setActiveSource("cash")
    this.updateTotalAmount(this.calculateTotal(cashData))
    this.updateExpensesList(cashData)

    // Initialize table view
    this.updateTable([
      ...cashData.map((item) => ({ ...item, source: "cash" })),
      ...gcashData.map((item) => ({ ...item, source: "gcash" })),
    ])

    // Set current date as default for expense form
    const today = new Date().toISOString().split("T")[0]
    document.getElementById("expense-date").value = today
  }

  // Show a specific view
  showView(viewId) {
    // Hide all views
    document.querySelectorAll(".view").forEach((view) => {
      view.classList.add("hidden")
    })

    // Show the selected view
    document.getElementById(viewId).classList.remove("hidden")
    this.currentView = viewId
  }

  // Set active source (cash or gcash)
  setActiveSource(source) {
    this.activeSource = source

    // Update toggle buttons
    const cashToggle = document.getElementById("cash-toggle")
    const gcashToggle = document.getElementById("gcash-toggle")

    if (source === "cash") {
      cashToggle.classList.add("active")
      gcashToggle.classList.remove("active")
    } else {
      gcashToggle.classList.add("active")
      cashToggle.classList.remove("active")
    }
  }

  // Update total amount display
  updateTotalAmount(amount) {
    document.getElementById("total-amount").textContent = amount.toLocaleString()
  }

  // Update expenses list
  updateExpensesList(expenses) {
    const expensesList = document.getElementById("expenses-list")
    expensesList.innerHTML = ""

    if (expenses.length === 0) {
      expensesList.innerHTML = '<p class="no-expenses">No expenses found.</p>'
      return
    }

    expenses.forEach((expense, index) => {
      const expenseItem = document.createElement("div")
      expenseItem.className = "expense-item swipe-item"
      expenseItem.setAttribute("data-index", index)

      const formattedDate = this.formatDate(expense.date)
      const formattedAmount = this.formatAmount(expense.amount)

      expenseItem.innerHTML = `
        <div class="swipe-content">
          <div class="expense-header">
            <div class="expense-date">${formattedDate}</div>
            <div class="expense-amount">${formattedAmount}</div>
          </div>
          <div class="expense-note">${expense.note}</div>
        </div>
        <div class="swipe-action">
          <button class="delete-btn" aria-label="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20" fill="white">
              <path d="M135.2 17.7C140.3 7.4 150.9 0 162.8 0h122.3c11.9 0 22.5 7.4 27.6 17.7L328 32H432c8.8 0 16 7.2 16 16s-7.2 16-16 16h-16.7l-20.2 372.6c-1.7 31.1-27.5 55.4-58.7 55.4H111.6c-31.2 0-57-24.3-58.7-55.4L32.7 64H16C7.2 64 0 56.8 0 48s7.2-16 16-16H120l15.2-14.3z"/>
              <rect x="144" y="128" width="16" height="256" fill="#e53935"/>
              <rect x="216" y="128" width="16" height="256" fill="#e53935"/>
              <rect x="288" y="128" width="16" height="256" fill="#e53935"/>
            </svg>
          </button>
        </div>
      `

      expensesList.appendChild(expenseItem)
    })

    this.enableSwipeToDelete()
  }

  enableSwipeToDelete() {
    const items = document.querySelectorAll('.swipe-item')
    items.forEach(item => {
      let startX = 0
      let isDragging = false

      // Touch events
      item.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX
        isDragging = true
      })

      item.addEventListener('touchmove', e => {
        if (!isDragging) return
        const diff = e.touches[0].clientX - startX
        if (diff < -30) item.classList.add('swiped')
        if (diff > 30) item.classList.remove('swiped')
      })

      item.addEventListener('touchend', () => {
        isDragging = false
      })

      // Mouse/trackpad events
      item.addEventListener('mousedown', e => {
        startX = e.clientX
        isDragging = true
      })

      item.addEventListener('mousemove', e => {
        if (!isDragging) return
        const diff = e.clientX - startX
        if (diff < -30) item.classList.add('swiped')
        if (diff > 30) item.classList.remove('swiped')
      })

      item.addEventListener('mouseup', () => {
        isDragging = false
      })

      // Wheel event for Magic Mouse / horizontal scrolling
      item.addEventListener('wheel', (e) => {
        if (e.deltaX > 20) {
          item.classList.add('swiped')
        } else if (e.deltaX < -20) {
          item.classList.remove('swiped')
        }
      })      
    })
  }

  // Update table view
  updateTable(expenses, showSource = true) {
    const tableHead = document.getElementById("table-head")

    tableHead.innerHTML = `
      <tr>
        <th>Date</th>
        <th>Amount</th>
        <th>Note</th>   
        ${showSource ? '<th>Source</th><tr>' : '<tr>'}      
    `

    const tableBody = document.getElementById("table-body")
    tableBody.innerHTML = ""

    if (expenses.length === 0) {
      const row = document.createElement("tr")
      row.innerHTML = '<td colspan="4">No expenses found.</td>'
      tableBody.appendChild(row)
      return
    }

    expenses.forEach((expense) => {
      const row = document.createElement("tr")

      const formattedDate = this.formatDate(expense.date)
      const formattedAmount = this.formatAmount(expense.amount)
      const source = expense.source.charAt(0).toUpperCase() + expense.source.slice(1)

      row.innerHTML = `
        <td>${formattedDate}</td>
        <td>${formattedAmount}</td>
        <td>${expense.note}</td>        
      `

      if (showSource) {
        row.innerHTML += `<td>${source}</td>`
      }

      tableBody.appendChild(row)
    })
  }

  // Show modal
  showModal(modalId) {    
    const modal = document.getElementById(modalId)
    modal.style.opacity = 1
    modal.style.zIndex = 1000
  }

  // Hide modal
  hideModal(modalId) {
    const modal = document.getElementById(modalId)
    modal.style.opacity = 0
    modal.style.zIndex = -1000
  }

  // Calculate total from expenses
  calculateTotal(expenses) {
    return expenses.reduce((total, expense) => total + expense.amount, 0)
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