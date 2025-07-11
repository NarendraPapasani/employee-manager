// UI Controller - Handles all UI interactions and DOM manipulation
const UIController = {
  currentEditingId: null,

  // Initialize UI
  init() {
    this.bindEvents();
    this.setupRealTimeValidation();
    this.renderEmployeeList();
    this.updatePagination();
  },

  // Bind all event listeners
  bindEvents() {
    // Header actions
    document
      .getElementById("add-employee-btn")
      .addEventListener("click", () => {
        this.showAddEmployeeForm();
      });

    // Search functionality
    document.getElementById("search-input").addEventListener("input", (e) => {
      this.handleSearch(e.target.value);
    });

    // Filter functionality
    document.getElementById("filter-btn").addEventListener("click", () => {
      this.toggleFilterPanel();
    });

    document
      .getElementById("apply-filter-btn")
      .addEventListener("click", () => {
        this.applyFilters();
      });

    document
      .getElementById("clear-filter-btn")
      .addEventListener("click", () => {
        this.clearFilters();
      });

    // Sort functionality
    document.getElementById("sort-select").addEventListener("change", (e) => {
      this.handleSort(e.target.value);
    });

    // Form handling
    document
      .getElementById("employee-form-element")
      .addEventListener("submit", (e) => {
        this.handleFormSubmit(e);
      });

    document.getElementById("close-form-btn").addEventListener("click", () => {
      this.hideEmployeeForm();
    });

    document.getElementById("cancel-form-btn").addEventListener("click", () => {
      this.hideEmployeeForm();
    });

    // Pagination
    document
      .getElementById("items-per-page")
      .addEventListener("change", (e) => {
        this.handleItemsPerPageChange(e.target.value);
      });

    document.getElementById("prev-page-btn").addEventListener("click", () => {
      this.handlePreviousPage();
    });

    document.getElementById("next-page-btn").addEventListener("click", () => {
      this.handleNextPage();
    });

    // Modal handling
    document
      .getElementById("confirm-delete-btn")
      .addEventListener("click", () => {
        this.confirmDelete();
      });

    document
      .getElementById("cancel-delete-btn")
      .addEventListener("click", () => {
        this.hideConfirmationModal();
      });

    // Close modal/form when clicking outside
    document.getElementById("employee-form").addEventListener("click", (e) => {
      if (e.target.id === "employee-form") {
        this.hideEmployeeForm();
      }
    });

    document
      .getElementById("confirmation-modal")
      .addEventListener("click", (e) => {
        if (e.target.id === "confirmation-modal") {
          this.hideConfirmationModal();
        }
      });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.hideEmployeeForm();
        this.hideConfirmationModal();
      }
    });
  },

  // Setup real-time validation
  setupRealTimeValidation() {
    if (window.Validation) {
      window.Validation.setupRealTimeValidation();
    }
  },

  // Render employee list
  renderEmployeeList() {
    const employeeList = document.getElementById("employee-list");
    const employees = EmployeeManager.getDisplayEmployees();

    if (employees.length === 0) {
      employeeList.innerHTML = this.getEmptyStateHTML();
      return;
    }

    employeeList.innerHTML = employees
      .map((employee) => this.getEmployeeCardHTML(employee))
      .join("");

    // Bind employee card events
    this.bindEmployeeCardEvents();
  },

  // Get employee card HTML
  getEmployeeCardHTML(employee) {
    return `
            <div class="employee-card" data-employee-id="${employee.id}">
                <div class="employee-info">
                    <div class="employee-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="employee-details">
                        <h3 class="employee-name">${employee.firstName} ${employee.lastName}</h3>
                        <p class="employee-id">ID: ${employee.id}</p>
                        <p class="employee-email">
                            <i class="fas fa-envelope"></i> ${employee.email}
                        </p>
                        <p class="employee-department">
                            <i class="fas fa-building"></i> ${employee.department}
                        </p>
                        <p class="employee-role">
                            <i class="fas fa-briefcase"></i> ${employee.role}
                        </p>
                    </div>
                </div>
                <div class="employee-actions">
                    <button class="btn btn-edit edit-btn" data-id="${employee.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-delete delete-btn" data-id="${employee.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
  },

  // Get empty state HTML
  getEmptyStateHTML() {
    return `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>No employees found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button class="btn btn-primary" onclick="UIController.showAddEmployeeForm()">
                    <i class="fas fa-plus"></i> Add First Employee
                </button>
            </div>
        `;
  },

  // Bind employee card events
  bindEmployeeCardEvents() {
    // Edit buttons
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const employeeId = e.target.closest(".edit-btn").dataset.id;
        this.showEditEmployeeForm(employeeId);
      });
    });

    // Delete buttons
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const employeeId = e.target.closest(".delete-btn").dataset.id;
        this.showDeleteConfirmation(employeeId);
      });
    });
  },

  // Search handling
  handleSearch(query) {
    EmployeeManager.search(query);
    this.renderEmployeeList();
    this.updatePagination();
  },

  // Filter panel
  toggleFilterPanel() {
    const filterPanel = document.getElementById("filter-panel");
    filterPanel.classList.toggle("hidden");
  },

  // Apply filters
  applyFilters() {
    const filters = {
      firstName: document.getElementById("filter-first-name").value,
      department: document.getElementById("filter-department").value,
      role: document.getElementById("filter-role").value,
    };

    EmployeeManager.applyFilters(filters);
    this.renderEmployeeList();
    this.updatePagination();
    this.toggleFilterPanel();
  },

  // Clear filters
  clearFilters() {
    document.getElementById("filter-first-name").value = "";
    document.getElementById("filter-department").value = "";
    document.getElementById("filter-role").value = "";
    document.getElementById("search-input").value = "";

    EmployeeManager.clearFilters();
    this.renderEmployeeList();
    this.updatePagination();
    this.toggleFilterPanel();
  },

  // Sort handling
  handleSort(field) {
    if (field) {
      EmployeeManager.sort(field);
      this.renderEmployeeList();
    }
  },

  // Form handling
  showAddEmployeeForm() {
    this.currentEditingId = null;
    document.getElementById("form-title").innerHTML =
      '<i class="fas fa-user-plus"></i> Add Employee';
    this.clearForm();
    this.showEmployeeForm();
  },

  showEditEmployeeForm(employeeId) {
    this.currentEditingId = employeeId;
    document.getElementById("form-title").innerHTML =
      '<i class="fas fa-user-edit"></i> Edit Employee';

    const employee = EmployeeManager.getEmployeeById(employeeId);
    if (employee) {
      this.populateForm(employee);
      this.showEmployeeForm();
    }
  },

  showEmployeeForm() {
    document.getElementById("employee-form").classList.remove("hidden");
    document.getElementById("first-name").focus();
  },

  hideEmployeeForm() {
    document.getElementById("employee-form").classList.add("hidden");
    this.clearForm();
    this.currentEditingId = null;
  },

  clearForm() {
    document.getElementById("employee-form-element").reset();
    if (window.Validation) {
      window.Validation.clearAllErrors();
    }
  },

  populateForm(employee) {
    document.getElementById("first-name").value = employee.firstName;
    document.getElementById("last-name").value = employee.lastName;
    document.getElementById("email").value = employee.email;
    document.getElementById("department").value = employee.department;
    document.getElementById("role").value = employee.role;
  },

  handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
      firstName: document.getElementById("first-name").value,
      lastName: document.getElementById("last-name").value,
      email: document.getElementById("email").value,
      department: document.getElementById("department").value,
      role: document.getElementById("role").value,
    };

    // Add current ID if editing
    if (this.currentEditingId) {
      formData.id = parseInt(this.currentEditingId);
    }

    // Validate form
    if (!window.Validation || !window.Validation.validateForm(formData)) {
      return;
    }

    // Show loading
    this.showLoading();

    // Simulate API delay
    setTimeout(() => {
      try {
        if (this.currentEditingId) {
          EmployeeManager.updateEmployee(this.currentEditingId, formData);
          this.showSuccessMessage("Employee updated successfully");
        } else {
          EmployeeManager.addEmployee(formData);
          this.showSuccessMessage("Employee added successfully");
        }

        this.hideEmployeeForm();
        this.renderEmployeeList();
        this.updatePagination();
      } catch (error) {
        this.showErrorMessage("An error occurred while saving the employee");
      } finally {
        this.hideLoading();
      }
    }, 500);
  },

  // Delete confirmation
  showDeleteConfirmation(employeeId) {
    this.currentEditingId = employeeId;
    document.getElementById("confirmation-modal").classList.remove("hidden");
  },

  hideConfirmationModal() {
    document.getElementById("confirmation-modal").classList.add("hidden");
    this.currentEditingId = null;
  },

  confirmDelete() {
    if (this.currentEditingId) {
      this.showLoading();

      setTimeout(() => {
        try {
          EmployeeManager.deleteEmployee(this.currentEditingId);
          this.showSuccessMessage("Employee deleted successfully");
          this.renderEmployeeList();
          this.updatePagination();
        } catch (error) {
          this.showErrorMessage(
            "An error occurred while deleting the employee"
          );
        } finally {
          this.hideLoading();
          this.hideConfirmationModal();
        }
      }, 300);
    }
  },

  // Pagination
  handleItemsPerPageChange(itemsPerPage) {
    EmployeeManager.setItemsPerPage(itemsPerPage);
    this.renderEmployeeList();
    this.updatePagination();
  },

  handlePreviousPage() {
    const currentPage = EmployeeManager.getCurrentPage();
    if (EmployeeManager.setPage(currentPage - 1)) {
      this.renderEmployeeList();
      this.updatePagination();
    }
  },

  handleNextPage() {
    const currentPage = EmployeeManager.getCurrentPage();
    if (EmployeeManager.setPage(currentPage + 1)) {
      this.renderEmployeeList();
      this.updatePagination();
    }
  },

  handlePageClick(page) {
    if (EmployeeManager.setPage(page)) {
      this.renderEmployeeList();
      this.updatePagination();
    }
  },

  updatePagination() {
    const { start, end, total } = EmployeeManager.getPaginationInfo();
    const currentPage = EmployeeManager.getCurrentPage();
    const totalPages = EmployeeManager.getTotalPages();

    // Update pagination info
    document.getElementById("pagination-info").textContent =
      total > 0
        ? `Showing ${start}-${end} of ${total} employees`
        : "No employees found";

    // Update pagination buttons
    document.getElementById("prev-page-btn").disabled = currentPage === 1;
    document.getElementById("next-page-btn").disabled =
      currentPage === totalPages || totalPages === 0;

    // Update page numbers
    this.updatePageNumbers(currentPage, totalPages);
  },

  updatePageNumbers(currentPage, totalPages) {
    const pageNumbers = document.getElementById("page-numbers");
    let html = "";

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      html += `<button class="page-number" onclick="UIController.handlePageClick(1)">1</button>`;
      if (startPage > 2) {
        html += `<span>...</span>`;
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      html += `<button class="page-number ${
        i === currentPage ? "active" : ""
      }" onclick="UIController.handlePageClick(${i})">${i}</button>`;
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        html += `<span>...</span>`;
      }
      html += `<button class="page-number" onclick="UIController.handlePageClick(${totalPages})">${totalPages}</button>`;
    }

    pageNumbers.innerHTML = html;
  },

  // Loading and messages
  showLoading() {
    document.getElementById("loading-indicator").classList.remove("hidden");
  },

  hideLoading() {
    document.getElementById("loading-indicator").classList.add("hidden");
  },

  showSuccessMessage(message) {
    this.showMessage(message, "success");
  },

  showErrorMessage(message) {
    this.showMessage(message, "error");
  },

  showMessage(message, type) {
    // Create message element
    const messageDiv = document.createElement("div");
    messageDiv.className = `message message-${type}`;
    messageDiv.innerHTML = `
            <i class="fas fa-${
              type === "success" ? "check-circle" : "exclamation-circle"
            }"></i>
            ${message}
        `;

    // Add styles
    messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === "success" ? "#d4edda" : "#f8d7da"};
            color: ${type === "success" ? "#155724" : "#721c24"};
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"};
            z-index: 2000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            animation: slideIn 0.3s ease;
        `;

    // Add to DOM
    document.body.appendChild(messageDiv);

    // Remove after 3 seconds
    setTimeout(() => {
      messageDiv.style.animation = "slideOut 0.3s ease";
      setTimeout(() => {
        document.body.removeChild(messageDiv);
      }, 300);
    }, 3000);
  },
};

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Make UIController available globally
window.UIController = UIController;
