// Main application entry point
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the application
  initializeApp();
});

function initializeApp() {
  console.log("Initializing Employee Directory Application...");

  try {
    // Initialize Employee Manager with mock data
    EmployeeManager.init();
    console.log(
      "Employee Manager initialized with",
      EmployeeManager.getAllEmployees().length,
      "employees"
    );

    // Initialize UI Controller
    UIController.init();
    console.log("UI Controller initialized");

    // Setup additional features
    setupKeyboardShortcuts();
    setupServiceWorker();

    console.log("Employee Directory Application initialized successfully");

    // Log application statistics
    logApplicationStats();
  } catch (error) {
    console.error("Error initializing application:", error);
    showErrorFallback();
  }
}

function setupKeyboardShortcuts() {
  document.addEventListener("keydown", function (e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      const searchInput = document.getElementById("search-input");
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }

    // Ctrl/Cmd + N to add new employee
    if ((e.ctrlKey || e.metaKey) && e.key === "n") {
      e.preventDefault();
      UIController.showAddEmployeeForm();
    }

    // Ctrl/Cmd + F to toggle filter panel
    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault();
      UIController.toggleFilterPanel();
    }
  });
}

function setupServiceWorker() {
  // Register service worker for offline support (optional)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registered successfully");
      })
      .catch((error) => {
        console.log("Service Worker registration failed");
      });
  }
}

function logApplicationStats() {
  const stats = EmployeeManager.getStatistics();
  console.log("Application Statistics:", {
    totalEmployees: stats.total,
    departments: Object.keys(stats.byDepartment).length,
    roles: Object.keys(stats.byRole).length,
    departmentBreakdown: stats.byDepartment,
    roleBreakdown: stats.byRole,
  });
}

function showErrorFallback() {
  const container = document.querySelector(".container");
  if (container) {
    container.innerHTML = `
            <div class="error-fallback">
                <div class="error-content">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h2>Application Error</h2>
                    <p>Sorry, there was an error loading the Employee Directory application.</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        <i class="fas fa-refresh"></i> Reload Page
                    </button>
                </div>
            </div>
        `;
  }
}

// Global error handler
window.addEventListener("error", function (e) {
  console.error("Global error:", e.error);
  // You could send this to a logging service in a real application
});

// Unhandled promise rejection handler
window.addEventListener("unhandledrejection", function (e) {
  console.error("Unhandled promise rejection:", e.reason);
  // You could send this to a logging service in a real application
});

// Export for testing purposes
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initializeApp,
    setupKeyboardShortcuts,
    logApplicationStats,
  };
}

// Performance monitoring (optional)
window.addEventListener("load", function () {
  setTimeout(() => {
    const perfData = performance.getEntriesByType("navigation")[0];
    console.log("Page Load Performance:", {
      loadTime: perfData.loadEventEnd - perfData.loadEventStart,
      domContentLoaded:
        perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
      totalTime: perfData.loadEventEnd - perfData.fetchStart,
    });
  }, 0);
});

// Add CSS for error fallback
const errorStyles = document.createElement("style");
errorStyles.textContent = `
    .error-fallback {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8f9fa;
    }
    
    .error-content {
        text-align: center;
        padding: 3rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        max-width: 400px;
        width: 90%;
    }
    
    .error-content i {
        font-size: 4rem;
        color: #dc3545;
        margin-bottom: 1rem;
    }
    
    .error-content h2 {
        color: #495057;
        margin-bottom: 1rem;
    }
    
    .error-content p {
        color: #6c757d;
        margin-bottom: 2rem;
    }
`;
document.head.appendChild(errorStyles);
