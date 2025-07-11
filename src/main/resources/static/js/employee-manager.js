// Employee Manager - Handles all employee data operations
const EmployeeManager = {
  employees: [],
  filteredEmployees: [],
  currentPage: 1,
  itemsPerPage: 10,
  currentFilters: {
    search: "",
    firstName: "",
    department: "",
    role: "",
  },
  currentSort: {
    field: "id", // Default sort by ID (newest first)
    order: "desc", // Descending order to show latest first
  },

  // Initialize with mock data
  init() {
    this.employees = [...window.mockEmployees];
    this.filteredEmployees = [...this.employees];
    this.generateIds();
    // Apply initial sort to show latest first
    this.applyFiltersAndSort();
  },

  // Generate unique IDs for new employees
  generateIds() {
    const maxId = Math.max(...this.employees.map((emp) => emp.id), 0);
    this.nextId = maxId + 1;
  },

  // Get all employees
  getAllEmployees() {
    return [...this.employees];
  },

  // Get filtered and paginated employees
  getDisplayEmployees() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEmployees.slice(startIndex, endIndex);
  },

  // Get employee by ID
  getEmployeeById(id) {
    return this.employees.find((emp) => emp.id === parseInt(id));
  },

  // Add new employee
  addEmployee(employeeData) {
    const newEmployee = {
      id: this.nextId++,
      firstName: employeeData.firstName.trim(),
      lastName: employeeData.lastName.trim(),
      email: employeeData.email.trim().toLowerCase(),
      department: employeeData.department,
      role: employeeData.role,
      createdAt: new Date().toISOString(), // Add timestamp for better sorting
    };

    // Add to the beginning of the array to ensure it appears first
    this.employees.unshift(newEmployee);

    // Reset to first page to show the new employee
    this.currentPage = 1;

    // If no custom sorting is applied, ensure we sort by ID desc to show latest first
    if (!this.currentSort.field || this.currentSort.field === "id") {
      this.currentSort = { field: "id", order: "desc" };
    }

    this.applyFiltersAndSort();
    return newEmployee;
  },

  // Update existing employee
  updateEmployee(id, employeeData) {
    const index = this.employees.findIndex((emp) => emp.id === parseInt(id));
    if (index !== -1) {
      this.employees[index] = {
        ...this.employees[index],
        firstName: employeeData.firstName.trim(),
        lastName: employeeData.lastName.trim(),
        email: employeeData.email.trim().toLowerCase(),
        department: employeeData.department,
        role: employeeData.role,
        updatedAt: new Date().toISOString(), // Add update timestamp
      };
      this.applyFiltersAndSort();
      return this.employees[index];
    }
    return null;
  },

  // Delete employee
  deleteEmployee(id) {
    const index = this.employees.findIndex((emp) => emp.id === parseInt(id));
    if (index !== -1) {
      const deletedEmployee = this.employees.splice(index, 1)[0];
      this.applyFiltersAndSort();

      // Adjust current page if necessary
      const totalPages = this.getTotalPages();
      if (this.currentPage > totalPages && totalPages > 0) {
        this.currentPage = totalPages;
      }

      return deletedEmployee;
    }
    return null;
  },

  // Search employees
  search(query) {
    this.currentFilters.search = query.toLowerCase();
    this.currentPage = 1;
    this.applyFiltersAndSort();
  },

  // Apply filters
  applyFilters(filters) {
    this.currentFilters = { ...this.currentFilters, ...filters };
    this.currentPage = 1;
    this.applyFiltersAndSort();
  },

  // Clear filters
  clearFilters() {
    this.currentFilters = {
      search: "",
      firstName: "",
      department: "",
      role: "",
    };
    this.currentPage = 1;
    this.applyFiltersAndSort();
  },

  // Sort employees
  sort(field, order = "asc") {
    this.currentSort = { field, order };
    this.applyFiltersAndSort();
  },

  // Apply all filters and sorting
  applyFiltersAndSort() {
    let result = [...this.employees];

    // Apply search filter
    if (this.currentFilters.search) {
      result = result.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(this.currentFilters.search) ||
          emp.lastName.toLowerCase().includes(this.currentFilters.search) ||
          emp.email.toLowerCase().includes(this.currentFilters.search)
      );
    }

    // Apply other filters
    if (this.currentFilters.firstName) {
      result = result.filter((emp) =>
        emp.firstName
          .toLowerCase()
          .includes(this.currentFilters.firstName.toLowerCase())
      );
    }

    if (this.currentFilters.department) {
      result = result.filter(
        (emp) => emp.department === this.currentFilters.department
      );
    }

    if (this.currentFilters.role) {
      result = result.filter((emp) => emp.role === this.currentFilters.role);
    }

    // Apply sorting
    if (this.currentSort.field) {
      result.sort((a, b) => {
        let aValue = a[this.currentSort.field];
        let bValue = b[this.currentSort.field];

        // Handle numeric comparison for ID
        if (this.currentSort.field === "id") {
          aValue = parseInt(aValue);
          bValue = parseInt(bValue);
        }
        // Handle string comparison
        else if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (this.currentSort.order === "desc") {
          return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
        } else {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        }
      });
    }

    this.filteredEmployees = result;
  },

  // Reset to default sorting (latest first)
  resetToDefaultSort() {
    this.currentSort = { field: "id", order: "desc" };
    this.applyFiltersAndSort();
  },

  // ...existing pagination methods...
  setPage(page) {
    const totalPages = this.getTotalPages();
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
      return true;
    }
    return false;
  },

  setItemsPerPage(itemsPerPage) {
    this.itemsPerPage = parseInt(itemsPerPage);
    this.currentPage = 1;
  },

  getCurrentPage() {
    return this.currentPage;
  },

  getTotalPages() {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  },

  getTotalEmployees() {
    return this.filteredEmployees.length;
  },

  getPaginationInfo() {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(
      this.currentPage * this.itemsPerPage,
      this.filteredEmployees.length
    );
    const total = this.filteredEmployees.length;

    return { start, end, total };
  },

  // Get unique departments
  getUniqueDepartments() {
    const departments = [
      ...new Set(this.employees.map((emp) => emp.department)),
    ];
    return departments.sort();
  },

  // Get unique roles
  getUniqueRoles() {
    const roles = [...new Set(this.employees.map((emp) => emp.role))];
    return roles.sort();
  },

  // Get statistics
  getStatistics() {
    const stats = {
      total: this.employees.length,
      byDepartment: {},
      byRole: {},
    };

    this.employees.forEach((emp) => {
      // Count by department
      if (!stats.byDepartment[emp.department]) {
        stats.byDepartment[emp.department] = 0;
      }
      stats.byDepartment[emp.department]++;

      // Count by role
      if (!stats.byRole[emp.role]) {
        stats.byRole[emp.role] = 0;
      }
      stats.byRole[emp.role]++;
    });

    return stats;
  },
};

// Make EmployeeManager available globally
window.EmployeeManager = EmployeeManager;
