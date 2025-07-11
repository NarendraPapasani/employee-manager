<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Directory</title>
    <link rel="stylesheet" href="/static/css/style.css">
    <link rel="stylesheet" href="/static/css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <header class="header">
            <h1><i class="fas fa-users"></i> Employee Directory</h1>
            <div class="header-actions">
                <button class="btn btn-primary" id="add-employee-btn">
                    <i class="fas fa-plus"></i> Add Employee
                </button>
            </div>
        </header>

        <div class="main-content">
            <!-- Dashboard Section -->
            <div id="dashboard" class="dashboard">
                <div class="controls">
                    <div class="search-container">
                        <input type="text" id="search-input" placeholder="Search employees..." class="search-input">
                        <i class="fas fa-search search-icon"></i>
                    </div>
                    
                    <div class="filter-sort-container">
                        <button class="btn btn-secondary" id="filter-btn">
                            <i class="fas fa-filter"></i> Filter
                        </button>
                        <select id="sort-select" class="sort-select">
                            <option value="">Sort by...</option>
                            <option value="firstName">First Name</option>
                            <option value="lastName">Last Name</option>
                            <option value="department">Department</option>
                            <option value="role">Role</option>
                        </select>
                    </div>
                </div>

                <!-- Filter Panel -->
                <div id="filter-panel" class="filter-panel hidden">
                    <div class="filter-content">
                        <h3><i class="fas fa-filter"></i> Filter Employees</h3>
                        <div class="filter-form">
                            <div class="form-group">
                                <label for="filter-first-name">First Name:</label>
                                <input type="text" id="filter-first-name" placeholder="Enter first name">
                            </div>
                            <div class="form-group">
                                <label for="filter-department">Department:</label>
                                <select id="filter-department">
                                    <option value="">All Departments</option>
                                    <option value="HR">HR</option>
                                    <option value="IT">IT</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Sales">Sales</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="filter-role">Role:</label>
                                <select id="filter-role">
                                    <option value="">All Roles</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Developer">Developer</option>
                                    <option value="Analyst">Analyst</option>
                                    <option value="Designer">Designer</option>
                                    <option value="Intern">Intern</option>
                                </select>
                            </div>
                            <div class="filter-actions">
                                <button class="btn btn-primary" id="apply-filter-btn">Apply Filter</button>
                                <button class="btn btn-secondary" id="clear-filter-btn">Clear</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Employee List Container -->
                <div class="employee-list-container">
                    <div id="employee-list" class="employee-list">
                        <#assign employees = mockEmployeeList>
                        <#list employees as employee>
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
                        </#list>
                    </div>
                </div>

                <!-- Pagination -->
                <div class="pagination-container">
                    <div class="pagination-info">
                        <span id="pagination-info">Showing 1-10 of 20 employees</span>
                    </div>
                    <div class="pagination-controls">
                        <select id="items-per-page" class="items-per-page">
                            <option value="10">10 per page</option>
                            <option value="25">25 per page</option>
                            <option value="50">50 per page</option>
                            <option value="100">100 per page</option>
                        </select>
                        <div class="pagination-buttons">
                            <button class="btn btn-secondary" id="prev-page-btn" disabled>
                                <i class="fas fa-chevron-left"></i> Previous
                            </button>
                            <span id="page-numbers" class="page-numbers"></span>
                            <button class="btn btn-secondary" id="next-page-btn">
                                Next <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add/Edit Form Section -->
            <div id="employee-form" class="employee-form hidden">
                <div class="form-container">
                    <div class="form-header">
                        <h2 id="form-title">
                            <i class="fas fa-user-plus"></i> Add Employee
                        </h2>
                        <button class="btn btn-close" id="close-form-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <form id="employee-form-element" class="form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="first-name">First Name <span class="required">*</span></label>
                                <input type="text" id="first-name" name="firstName" required>
                                <span class="error-message" id="first-name-error"></span>
                            </div>
                            <div class="form-group">
                                <label for="last-name">Last Name <span class="required">*</span></label>
                                <input type="text" id="last-name" name="lastName" required>
                                <span class="error-message" id="last-name-error"></span>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="email">Email <span class="required">*</span></label>
                            <input type="email" id="email" name="email" required>
                            <span class="error-message" id="email-error"></span>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="department">Department <span class="required">*</span></label>
                                <select id="department" name="department" required>
                                    <option value="">Select Department</option>
                                    <option value="HR">HR</option>
                                    <option value="IT">IT</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Sales">Sales</option>
                                </select>
                                <span class="error-message" id="department-error"></span>
                            </div>
                            <div class="form-group">
                                <label for="role">Role <span class="required">*</span></label>
                                <select id="role" name="role" required>
                                    <option value="">Select Role</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Developer">Developer</option>
                                    <option value="Analyst">Analyst</option>
                                    <option value="Designer">Designer</option>
                                    <option value="Intern">Intern</option>
                                </select>
                                <span class="error-message" id="role-error"></span>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Save Employee
                            </button>
                            <button type="button" class="btn btn-secondary" id="cancel-form-btn">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Loading Indicator -->
    <div id="loading-indicator" class="loading-indicator hidden">
        <div class="spinner"></div>
        <p>Loading...</p>
    </div>

    <!-- Confirmation Modal -->
    <div id="confirmation-modal" class="modal hidden">
        <div class="modal-content">
            <h3><i class="fas fa-exclamation-triangle"></i> Confirm Delete</h3>
            <p>Are you sure you want to delete this employee? This action cannot be undone.</p>
            <div class="modal-actions">
                <button class="btn btn-danger" id="confirm-delete-btn">
                    <i class="fas fa-trash"></i> Delete
                </button>
                <button class="btn btn-secondary" id="cancel-delete-btn">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </div>
    </div>

    <script src="/static/js/data.js"></script>
    <script src="/static/js/validation.js"></script>
    <script src="/static/js/employee-manager.js"></script>
    <script src="/static/js/ui-controller.js"></script>
    <script src="/static/js/app.js"></script>
</body>
</html>
