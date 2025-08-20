import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from "sweetalert2";

const RecurringList = () => {
  const navigate = useNavigate();
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRExpenses = async () => {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        setError("Unauthorized! Please login.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8081/expense/RExpense", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const expenses = response.data.content || response.data;
        setRecurringExpenses(expenses);
        console.log(expenses);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Unauthorized. Please login again.");
        } else if (err.response?.status === 403) {
          setError("Forbidden. Your token is invalid or expired.");
        } else {
          setError("Failed to fetch expenses. Please try again later.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRExpenses();
  }, []);

  // ✅ Handle Delete R-Expense with SweetAlert2 Password Prompt
  const handleDelete = async (id) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("Unauthorized. Please login again.");
      return;
    }

    const { value: password } = await Swal.fire({
      title: "Confirm Deletion",
      text: "Please enter your password to confirm deletion",
      input: "password",
      inputPlaceholder: "Enter your password",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      preConfirm: (pwd) => {
        if (!pwd) {
          Swal.showValidationMessage("Password is required ⚠️");
          return false;
        }
        return pwd;
      }
    });

    if (!password) return;

    try {
      await axios.delete(`http://localhost:8081/expense/RExpense/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-User-password": password
        }
      });

      setRecurringExpenses(expenses => expenses.filter(exp => exp.id !== id));
      Swal.fire("Deleted!", "Recurring expense removed ✅", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Invalid password or delete failed ❌", "error");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-medium">
        {error}
      </div>
    );
  }

  const toggleStatus = (id) => {
    setRecurringExpenses(expenses =>
      expenses.map(expense =>
        expense.id === id
          ? { ...expense, status: expense.status === 'Active' ? 'Paused' : 'Active' }
          : expense
      )
    );
  };

  const getStatusColor = (status) => {
    if (status === 'Active')
      return 'bg-green-300 text-green-900'
    else if (status === "Inactive")
      return 'bg-red-300 text-red-900';
    else return 'bg-yellow-200 text-yellow-900'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recurring expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recurring Expenses</h1>
          <Link
            to="/add-recurring"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
          >
            Add Recurring Expense
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5 flex items-center">
              <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-bold">#</span>
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Total Recurring</dt>
                <dd className="text-lg font-medium text-gray-900">{recurringExpenses.length}</dd>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5 flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Active</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {recurringExpenses.filter(e => e.status === 'Active').length}
                </dd>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5 flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-bold">$</span>
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Monthly Total</dt>
                <dd className="text-lg font-medium text-gray-900">
                  ${recurringExpenses
                    .filter(e => e.status === 'Active')
                    .reduce((sum, e) => sum + e.amount, 0)
                    .toFixed(2)}
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Recurring Expenses Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recurringExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expense.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expense.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${expense.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {expense.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.frequency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(expense.status)}`}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => toggleStatus(expense.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      {expense.status === 'Active' ? 'Pause' : 'Activate'}
                    </button>
                    <Link 
                      to={`/edit-Rexpense/${expense.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecurringList;
