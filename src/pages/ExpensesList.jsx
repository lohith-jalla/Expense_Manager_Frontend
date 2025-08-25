import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState('');

  const fixedCategories = [
    "all",
    "FOOD",
    "GROCERY",
    "CLOTHS",
    "EDUCATION",
    "MEDICAL",
    "INVESTMENT",
    "COMMON_EXPENSE",
    "HOME_DECOR",
    "ACCESSORIES",
    "RENT",
    "TRAVEL",
    "BUSINESS",
    "OTHER"
  ];

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          setError("Unauthorized. Please login first.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:8081/expense", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setExpenses(response.data.content); 
        console.log(response.data.content);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Unauthorized. Please login again.");
        } else {
          setError("Failed to fetch expenses. Please try again later.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("jwtToken");

      const response = await axios.delete(`http://localhost:8081/expense/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setExpenses(expenses.filter(exp => exp.id !== id));
      Swal.fire({
        title: "Deleted!",
        text: "Expense Deleted Success ✅",
        icon: "success",
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      console.log(response.data);
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError("Failed to delete expense. Please try again.");
    }
  };

  const handleExport = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get("http://localhost:8081/expense/export/excel", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: "blob"
      });

      const blob = new Blob([response.data], { type: "application/vnd.ms-excel" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expenses.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      setError(err.response?.data?.message || err.message || "Unknown error");

      Swal.fire({
        title: "Error Exporting!",
        text: "Please Try Again",
        icon: "error",
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Expenses List</h1>
          <Link
            to="/add-expense"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 w-full sm:w-auto text-center"
          >
            Add New Expense
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                id="search"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {fixedCategories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                className="w-full sm:w-auto px-4 py-2 rounded-md text-white hover:bg-indigo-700 bg-indigo-600"
                onClick={handleExport}
              >
                Export to Excel
              </button>
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Id", "Name", "Description", "Amount", "Category", "Date", "Payment Method", "Actions"].map((header) => (
                    <th
                      key={header}
                      className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs sm:text-sm"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-gray-900">{expense.id}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-gray-900">{expense.name}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-gray-900">{expense.description}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900">${expense.amount.toFixed(2)}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {expense.type}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900">{expense.date}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900">
                      {expense.paymentType == null ? "None" : expense.paymentType}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium">
                      <Link
                        to={`/edit-expense/${expense.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-2 sm:mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={(e) => handleDelete(e, expense.id)}
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
    </div>
  );
};

export default ExpensesList;
