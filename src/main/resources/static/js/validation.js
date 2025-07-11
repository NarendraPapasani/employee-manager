// Validation utility functions
const Validation = {
  // Email validation regex
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Required field validation
  isRequired(value) {
    return value && value.trim().length > 0;
  },

  // Email format validation
  isValidEmail(email) {
    return this.emailRegex.test(email);
  },

  // Name validation (no numbers or special characters)
  isValidName(name) {
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    return nameRegex.test(name) && name.trim().length >= 2;
  },

  // Clear error message
  clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + "-error");

    if (field) {
      field.classList.remove("error");
    }

    if (errorElement) {
      errorElement.textContent = "";
    }
  },

  // Show error message
  showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + "-error");

    if (field) {
      field.classList.add("error");
    }

    if (errorElement) {
      errorElement.textContent = message;
    }
  },

  // Clear all errors
  clearAllErrors() {
    const fields = ["first-name", "last-name", "email", "department", "role"];
    fields.forEach((fieldId) => this.clearError(fieldId));
  },

  // Validate individual field
  validateField(fieldId, value) {
    this.clearError(fieldId);

    switch (fieldId) {
      case "first-name":
        if (!this.isRequired(value)) {
          this.showError(fieldId, "First name is required");
          return false;
        }
        if (!this.isValidName(value)) {
          this.showError(fieldId, "Please enter a valid first name");
          return false;
        }
        break;

      case "last-name":
        if (!this.isRequired(value)) {
          this.showError(fieldId, "Last name is required");
          return false;
        }
        if (!this.isValidName(value)) {
          this.showError(fieldId, "Please enter a valid last name");
          return false;
        }
        break;

      case "email":
        if (!this.isRequired(value)) {
          this.showError(fieldId, "Email is required");
          return false;
        }
        if (!this.isValidEmail(value)) {
          this.showError(fieldId, "Please enter a valid email address");
          return false;
        }
        break;

      case "department":
        if (!this.isRequired(value)) {
          this.showError(fieldId, "Department is required");
          return false;
        }
        break;

      case "role":
        if (!this.isRequired(value)) {
          this.showError(fieldId, "Role is required");
          return false;
        }
        break;
    }

    return true;
  },

  // Validate entire form
  validateForm(formData) {
    this.clearAllErrors();

    let isValid = true;

    // Validate each field
    const fields = [
      { id: "first-name", value: formData.firstName },
      { id: "last-name", value: formData.lastName },
      { id: "email", value: formData.email },
      { id: "department", value: formData.department },
      { id: "role", value: formData.role },
    ];

    fields.forEach((field) => {
      if (!this.validateField(field.id, field.value)) {
        isValid = false;
      }
    });

    // Check for duplicate email (excluding current employee when editing)
    if (isValid && formData.email) {
      const existingEmployee = window.mockEmployees.find(
        (emp) =>
          emp.email.toLowerCase() === formData.email.toLowerCase() &&
          emp.id !== formData.id
      );

      if (existingEmployee) {
        this.showError("email", "Email address already exists");
        isValid = false;
      }
    }

    return isValid;
  },

  // Setup real-time validation
  setupRealTimeValidation() {
    const fields = ["first-name", "last-name", "email", "department", "role"];

    fields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (field) {
        // Validate on blur
        field.addEventListener("blur", () => {
          this.validateField(fieldId, field.value);
        });

        // Clear error on input
        field.addEventListener("input", () => {
          if (field.classList.contains("error")) {
            this.clearError(fieldId);
          }
        });
      }
    });
  },
};

// Make validation available globally
window.Validation = Validation;
