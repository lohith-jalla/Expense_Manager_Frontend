import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    type: '',
    date: new Date().toISOString().split('T')[0],
    paymentType: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    "FOOD", "GROCERY", "CLOTHS", "EDUCATION", "MEDICAL",
    "INVESTMENT", "COMMON_EXPENSE", "HOME_DECOR",
    "ACCESSORIES", "RENT", "TRAVEL", "BUSINESS", "OTHER"
  ];

  const paymentMethods = [
    "Cash", "CreditCard", "DebitCard", "BankTransfer", "DigitalWallet", "Other"
  ];

  // ✅ Fetch existing expense
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(`http://localhost:8081/expense/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });
        setFormData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch expense!", err);
        setError("Failed to fetch expense");
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  // ✅ Update on submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.put(`http://localhost:8081/expense/${id}`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      
      Swal.fire({
          title: "Updated!",
          text: "Expense Update Success ✅",
          icon: "success",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false
      }).then(() => {
            navigate("/expenses");
        });

    } catch (err) {
      console.error("Update failed", err);
      setError("Failed to update expense");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading expense...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Edit Expense</h1>
          </div>

          {error && <p className="text-red-500 p-4">{error}</p>}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter expense name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <input
                type="text"
                name="description"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter expense description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <input
                type="number"
                name="amount"
                required
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>

            {/* Category and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="type"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>
              <select
                name="paymentType"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.paymentType}
                onChange={handleChange}
              >
                <option value="">Select payment method</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/expenses")}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Update Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditExpense;
