export class UserService {
  constructor() {
    this.currentUser = null
    this.loadUser()
  }

  // Load user data
  loadUser() {
    // In a real app, this would load from a JSON file
    // For this demo, we'll use mock data
    this.currentUser = {
      username: "Rangrez",
      password: "hashed_password", // In a real app, this would be hashed
      avatar: "images/avatar1.png",
    }
  }

  // Get current user
  getCurrentUser() {
    return { ...this.currentUser }
  }

  // Update user
  async updateUser(username, currentPassword, newPassword, avatarUrl) {
    try {
      // In a real app, this would validate the current password
      // and update the user data in the JSON file

      // Update user data
      this.currentUser.username = username

      if (newPassword) {
        // In a real app, this would hash the password
        this.currentUser.password = newPassword
      }

      if (avatarUrl) {
        this.currentUser.avatar = avatarUrl
      }

      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Check password strength
  checkPasswordStrength(password) {
    if (!password) return ""

    // Simple password strength check
    const hasLowerCase = /[a-z]/.test(password)
    const hasUpperCase = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const isLongEnough = password.length >= 8

    const score = [hasLowerCase, hasUpperCase, hasNumber, hasSpecialChar, isLongEnough].filter(Boolean).length

    if (score <= 2) return "weak"
    if (score <= 4) return "medium"
    return "strong"
  }
}

