import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'

// Import all pages
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ExpensesList from './pages/ExpensesList'
import AddExpense from './pages/AddExpense'
import EditExpense from './pages/EditExpense'
import RecurringList from './pages/RecurringList'
import AddRecurring from './pages/AddRecurring'
import Settings from './pages/Settings'
import EditRExpense from './pages/EditRExpense'

// Welcome/Home component
const Home = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to ExpenseTracker</h1>
      <p className="text-lg text-gray-600 mb-8">
        Your personal expense management solution
      </p>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Getting Started</h2>
        <p className="text-gray-600 mb-4">
          Use the navigation above to explore different features:
        </p>
        <ul className="text-left text-gray-600 space-y-2">
          <li>• <strong>Dashboard</strong> - View your expense overview</li>
          <li>• <strong>Expenses</strong> - Manage your expense list</li>
          <li>• <strong>Add Expense</strong> - Record new expenses</li>
          <li>• <strong>Recurring</strong> - Manage recurring expenses</li>
          <li>• <strong>Settings</strong> - Customize your preferences</li>
        </ul>
      </div>
    </div>
  </div>
)

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/expenses" element={<ExpensesList />} />
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/edit-expense/:id" element={<EditExpense />} />
            <Route path="/recurring" element={<RecurringList />} />
            <Route path="/add-recurring" element={<AddRecurring />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/edit-Rexpense/:id" element={<EditRExpense />}/>
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
