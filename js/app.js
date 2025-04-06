// Import modules
import { DataService } from "./data-service.js"
import { UIService } from "./ui-service.js"
import { PDFService } from "./pdf-service.js"
import { UserService } from "./user-service.js"

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  // Initialize services
  const dataService = new DataService()
  const uiService = new UIService()
  const pdfService = new PDFService()
  const userService = new UserService()

  // Load initial data
  dataService
    .loadData()
    .then(() => {
      // Load data
      dataService.loadData();
      
      // Initialize UI with data
      uiService.initializeUI(dataService.getCashData(), dataService.getGCashData(), userService.getCurrentUser())

      // Set up event listeners
      setupEventListeners()
    })
    .catch((error) => {
      console.error("Error loading data:", error)
      // Show error message to user
      alert("Failed to load data. Please try again.")
    })

  // Set up event listeners
  function setupEventListeners() {
    // Navigation
    const navButtons = document.querySelectorAll(".nav-btn")
    navButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const viewId = button.getAttribute("data-view")
        uiService.showView(viewId)

        // Update active button
        navButtons.forEach((btn) => btn.classList.remove("active"))
        button.classList.add("active")
      })
    })

    // Source toggle
    const cashToggle = document.getElementById("cash-toggle")
    const gcashToggle = document.getElementById("gcash-toggle")

    cashToggle.addEventListener("click", () => {
      uiService.setActiveSource("cash")
      uiService.updateTotalAmount(dataService.getCashTotal())
      uiService.updateExpensesList(dataService.getCashData())
      getDeleteBtns()
    })

    gcashToggle.addEventListener("click", () => {
      uiService.setActiveSource("gcash")
      uiService.updateTotalAmount(dataService.getGCashTotal())
      uiService.updateExpensesList(dataService.getGCashData())
      getDeleteBtns()
    })

    // Add expense buttons
    const addExpenseBtns = document.querySelectorAll("#add-expense-btn, #add-expense-btn-large")
    addExpenseBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        uiService.showModal("expense-modal")
      })
    })

    // Delete expense buttons
    getDeleteBtns();

    // Close modal
    const closeModal = document.querySelector(".close-modal")
    closeModal.addEventListener("click", () => {
      uiService.hideModal("expense-modal")
    })

    // Form source toggle
    const formCashToggle = document.getElementById("form-cash-toggle")
    const formGCashToggle = document.getElementById("form-gcash-toggle")

    formCashToggle.addEventListener("click", () => {
      formCashToggle.classList.add("active")
      formGCashToggle.classList.remove("active")
    })

    formGCashToggle.addEventListener("click", () => {
      formGCashToggle.classList.add("active")
      formCashToggle.classList.remove("active")
    })

    // Expense form submission
    const expenseForm = document.getElementById("expense-form")
    expenseForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const date = document.getElementById("expense-date").value
      const amount = Number.parseFloat(document.getElementById("expense-amount").value)
      const note = document.getElementById("expense-note").value
      const source = document.getElementById("form-cash-toggle").classList.contains("active") ? "cash" : "gcash"

      // Add expense
      dataService
        .addExpense(date, amount, note, source)
        .then(() => {
          // Update UI
          if (
            (source === "cash" && cashToggle.classList.contains("active")) ||
            (source === "gcash" && gcashToggle.classList.contains("active"))
          ) {
            uiService.updateTotalAmount(source === "cash" ? dataService.getCashTotal() : dataService.getGCashTotal())
            uiService.updateExpensesList(source === "cash" ? dataService.getCashData() : dataService.getGCashData())
          }

          // Update table view
          uiService.updateTable(dataService.getAllData())

          // Reset form and hide modal
          expenseForm.reset()
          uiService.hideModal("expense-modal")

          getDeleteBtns()
        })
        .catch((error) => {
          console.error("Error adding expense:", error)
          alert("Failed to add expense. Please try again.")
        })
    })

    // Export button
    const exportBtn = document.getElementById("export-btn")
    exportBtn.addEventListener("click", () => {
      alert('Coming Soon');
      // const activeSource = cashToggle.classList.contains("active") ? "cash" : "gcash"
      // const data = activeSource === "cash" ? dataService.getCashData() : dataService.getGCashData()
      // pdfService.exportToPDF(data, activeSource)
    })

    // Source toggle transactions table
    const TableAllFilter = document.getElementById("table-filter-all")
    const TableCashFilter = document.getElementById("table-filter-cash")
    const TableGcashFilter = document.getElementById("table-filter-gcash")

    TableAllFilter.addEventListener("click", () => {
      let filteredData

      filteredData = dataService.getAllData()

      uiService.updateTable(filteredData)
      
      TableAllFilter.classList.add("active")
      TableCashFilter.classList.remove("active")      
      TableGcashFilter.classList.remove("active")
    })

    TableCashFilter.addEventListener("click", () => {
      let filteredData

      filteredData = dataService.getCashData().map((item) => ({ ...item, source: "cash" }))

      uiService.updateTable(filteredData, false)
      
      TableCashFilter.classList.add("active")
      TableAllFilter.classList.remove("active")
      TableGcashFilter.classList.remove("active")
    })

    TableGcashFilter.addEventListener("click", () => {
      let filteredData

      filteredData = dataService.getGCashData().map((item) => ({ ...item, source: "gcash" }))

      uiService.updateTable(filteredData, false)  

      TableGcashFilter.classList.add("active")
      TableAllFilter.classList.remove("active")
      TableCashFilter.classList.remove("active")      
    })

    // Profile settings
    const avatarInput = document.getElementById("avatar-input")
    avatarInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader()

        reader.onload = (event) => {
          const avatarUrl = event.target.result
          document.getElementById("settings-avatar").src = avatarUrl
          document.getElementById("user-avatar").src = avatarUrl
        }

        reader.readAsDataURL(e.target.files[0])
      }
    })

    // Save profile changes
    const saveProfileBtn = document.getElementById("save-profile")
    saveProfileBtn.addEventListener("click", () => {
      const username = document.getElementById("username-input").value
      const currentPassword = document.getElementById("current-password").value
      const newPassword = document.getElementById("new-password").value
      const avatarUrl = document.getElementById("settings-avatar").src

      userService
        .updateUser(username, currentPassword, newPassword, avatarUrl)
        .then(() => {
          // Update UI
          document.getElementById("username").textContent = username

          // Clear password fields
          document.getElementById("current-password").value = ""
          document.getElementById("new-password").value = ""

          alert("Profile updated successfully!")
        })
        .catch((error) => {
          console.error("Error updating profile:", error)
          alert("Failed to update profile. Please try again.")
        })
    })

    // Password strength
    const newPasswordInput = document.getElementById("new-password")
    const passwordStrength = document.getElementById("password-strength")

    newPasswordInput.addEventListener("input", () => {
      const password = newPasswordInput.value
      const strength = userService.checkPasswordStrength(password)

      passwordStrength.className = "password-strength"
      if (password) {
        passwordStrength.classList.add(strength)
      }
    })
  }

  function getDeleteBtns() {
    const cashToggle = document.getElementById("cash-toggle")
    const gcashToggle = document.getElementById("gcash-toggle")
    const deleteBtns = document.querySelectorAll('.swipe-action')

    if (deleteBtns) {
      deleteBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
          if (confirm('Delete this expense?')) {
            dataService
              .deleteExpense(uiService.activeSource, index)
              .then(() => {
                dataService.loadData();

                // Update UI
                if (
                  (uiService.activeSource === "cash" && cashToggle.classList.contains("active")) ||
                  (uiService.activeSource === "gcash" && gcashToggle.classList.contains("active"))
                ) {
                  uiService.updateTotalAmount(uiService.activeSource === "cash" ? dataService.getCashTotal() : dataService.getGCashTotal())
                  uiService.updateExpensesList(uiService.activeSource === "cash" ? dataService.getCashData() : dataService.getGCashData())
                }
  
                // Update table view
                uiService.updateTable(dataService.getAllData())
              })
          }
        })
      })
    }
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('Service Worker registered'))
      .catch(err => console.error('SW registration failed:', err));
  }
  
})

