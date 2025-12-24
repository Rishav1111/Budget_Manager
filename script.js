// Categories for income and expenses
const categories = {
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
    expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Other']
};

// Initialize data
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let budgets = JSON.parse(localStorage.getItem('budgets')) || [];
let expenseChart = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeDate();
    populateCategories();
    populateBudgetCategories();
    loadTransactions();
    updateStats();
    renderTransactions();
    renderBudgets();
    initializeChart();
    setupEventListeners();
});

// Set today's date as default
function initializeDate() {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
}

// Populate category dropdowns
function populateCategories() {
    const categorySelect = document.getElementById('category');
    const typeSelect = document.getElementById('type');
    
    function updateCategories() {
        const type = typeSelect.value;
        categorySelect.innerHTML = '<option value="">Select category</option>';
        categories[type].forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });
    }
    
    typeSelect.addEventListener('change', updateCategories);
    updateCategories();
}

// Populate budget category dropdown
function populateBudgetCategories() {
    const budgetCategorySelect = document.getElementById('budgetCategory');
    const filterCategorySelect = document.getElementById('filterCategory');
    
    const allCategories = [...categories.expense];
    allCategories.forEach(cat => {
        const option1 = document.createElement('option');
        option1.value = cat;
        option1.textContent = cat;
        budgetCategorySelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = cat;
        option2.textContent = cat;
        filterCategorySelect.appendChild(option2);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Transaction form
    document.getElementById('transactionForm').addEventListener('submit', handleAddTransaction);
    
    // Edit form
    document.getElementById('editForm').addEventListener('submit', handleEditTransaction);
    document.getElementById('deleteBtn').addEventListener('click', handleDeleteTransaction);
    
    // Budget form
    document.getElementById('budgetForm').addEventListener('submit', handleAddBudget);
    document.getElementById('addBudgetBtn').addEventListener('click', () => {
        document.getElementById('budgetModal').style.display = 'block';
    });
    
    // Filters
    document.getElementById('filterType').addEventListener('change', renderTransactions);
    document.getElementById('filterCategory').addEventListener('change', renderTransactions);
    document.getElementById('filterMonth').addEventListener('change', renderTransactions);
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Handle add transaction
function handleAddTransaction(e) {
    e.preventDefault();
    
    const transaction = {
        id: Date.now(),
        type: document.getElementById('type').value,
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        date: document.getElementById('date').value
    };
    
    transactions.push(transaction);
    saveTransactions();
    updateStats();
    renderTransactions();
    updateChart();
    e.target.reset();
    initializeDate();
}

// Handle edit transaction
function handleEditTransaction(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editId').value);
    const index = transactions.findIndex(t => t.id === id);
    
    if (index !== -1) {
        transactions[index] = {
            id: id,
            type: document.getElementById('editType').value,
            description: document.getElementById('editDescription').value,
            amount: parseFloat(document.getElementById('editAmount').value),
            category: document.getElementById('editCategory').value,
            date: document.getElementById('editDate').value
        };
        
        saveTransactions();
        updateStats();
        renderTransactions();
        updateChart();
        renderBudgets();
        document.getElementById('editModal').style.display = 'none';
    }
}

// Handle delete transaction
function handleDeleteTransaction() {
    const id = parseInt(document.getElementById('editId').value);
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    updateStats();
    renderTransactions();
    updateChart();
    renderBudgets();
    document.getElementById('editModal').style.display = 'none';
}

// Handle add budget
function handleAddBudget(e) {
    e.preventDefault();
    
    const category = document.getElementById('budgetCategory').value;
    const amount = parseFloat(document.getElementById('budgetAmount').value);
    
    const existingIndex = budgets.findIndex(b => b.category === category);
    
    if (existingIndex !== -1) {
        budgets[existingIndex].limit = amount;
    } else {
        budgets.push({ category, limit: amount });
    }
    
    saveBudgets();
    renderBudgets();
    document.getElementById('budgetModal').style.display = 'none';
    e.target.reset();
}

// Render transactions
function renderTransactions() {
    const list = document.getElementById('transactionsList');
    const filterType = document.getElementById('filterType').value;
    const filterCategory = document.getElementById('filterCategory').value;
    const filterMonth = document.getElementById('filterMonth').value;
    
    let filtered = transactions;
    
    if (filterType !== 'all') {
        filtered = filtered.filter(t => t.type === filterType);
    }
    
    if (filterCategory !== 'all') {
        filtered = filtered.filter(t => t.category === filterCategory);
    }
    
    if (filterMonth) {
        filtered = filtered.filter(t => {
            const transactionDate = new Date(t.date);
            const filterDate = new Date(filterMonth + '-01');
            return transactionDate.getFullYear() === filterDate.getFullYear() &&
                   transactionDate.getMonth() === filterDate.getMonth();
        });
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No transactions found</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = filtered.map(transaction => `
        <div class="transaction-item ${transaction.type}" onclick="openEditModal(${transaction.id})">
            <div class="transaction-info">
                <div class="transaction-description">${transaction.description}</div>
                <div class="transaction-meta">
                    <span>${transaction.category}</span>
                    <span>${formatDate(transaction.date)}</span>
                </div>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
            </div>
        </div>
    `).join('');
}

// Open edit modal
function openEditModal(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    
    document.getElementById('editId').value = transaction.id;
    document.getElementById('editType').value = transaction.type;
    document.getElementById('editDescription').value = transaction.description;
    document.getElementById('editAmount').value = transaction.amount;
    document.getElementById('editDate').value = transaction.date;
    
    // Populate edit category dropdown
    const editCategorySelect = document.getElementById('editCategory');
    editCategorySelect.innerHTML = '<option value="">Select category</option>';
    categories[transaction.type].forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        if (cat === transaction.category) option.selected = true;
        editCategorySelect.appendChild(option);
    });
    
    document.getElementById('editModal').style.display = 'block';
}

// Render budgets
function renderBudgets() {
    const container = document.getElementById('budgetLimits');
    
    if (budgets.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 1rem;">No budget limits set</p>';
        return;
    }
    
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthTransactions = transactions.filter(t => 
        t.type === 'expense' && t.date.startsWith(currentMonth)
    );
    
    container.innerHTML = budgets.map(budget => {
        const spent = monthTransactions
            .filter(t => t.category === budget.category)
            .reduce((sum, t) => sum + t.amount, 0);
        
        const percentage = (spent / budget.limit) * 100;
        const progressClass = percentage >= 100 ? 'danger' : percentage >= 80 ? 'warning' : '';
        
        return `
            <div class="budget-item">
                <div class="budget-info">
                    <div class="budget-category">${budget.category}</div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">
                        $${spent.toFixed(2)} / $${budget.limit.toFixed(2)}
                    </div>
                    <div class="budget-progress">
                        <div class="budget-progress-bar ${progressClass}" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                </div>
                <div class="budget-amount">${percentage.toFixed(0)}%</div>
            </div>
        `;
    }).join('');
}

// Update statistics
function updateStats() {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpense;
    
    document.getElementById('totalIncome').textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById('totalExpense').textContent = `$${totalExpense.toFixed(2)}`;
    document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;
    
    // Update balance color
    const balanceElement = document.getElementById('balance');
    balanceElement.style.color = balance >= 0 ? 'var(--success-color)' : 'var(--danger-color)';
}

// Initialize chart
function initializeChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    
    expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#ef4444',
                    '#f59e0b',
                    '#10b981',
                    '#3b82f6',
                    '#8b5cf6',
                    '#ec4899',
                    '#06b6d4',
                    '#84cc16'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
    
    updateChart();
}

// Update chart
function updateChart() {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthExpenses = transactions.filter(t => 
        t.type === 'expense' && t.date.startsWith(currentMonth)
    );
    
    const categoryTotals = {};
    monthExpenses.forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    
    expenseChart.data.labels = labels;
    expenseChart.data.datasets[0].data = data;
    expenseChart.update();
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Save transactions to localStorage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Save budgets to localStorage
function saveBudgets() {
    localStorage.setItem('budgets', JSON.stringify(budgets));
}

// Load transactions (for initialization)
function loadTransactions() {
    // Transactions are already loaded from localStorage
    // This function can be used for additional initialization if needed
}

