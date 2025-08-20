import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AddExpense = () => {
  const navigate= useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    type: '',
    date: new Date().toISOString().split('T')[0],
    paymentType: '',
  });

  const categories = [
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

  const paymentTypes = [
    "Cash",
    "CreditCard",
    "DebitCard",
    "BankTransfer",
    "DigitalWallet",
    "Other"
  ];

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("✅ handleSubmit called");
    try {
      const token = localStorage.getItem("jwtToken");
      console.log("Sending expense:", formData);

      const response = await axios.post(
        "http://localhost:8081/expense",
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Expense added:", response.data);

      setFormData({
        name: '',
        description: '',
        amount: '',
        type: '',
        date: new Date().toISOString().split('T')[0],
        paymentType: '',
      });
      setError("");

      Swal.fire({
              title: "Created!",
              text: "Expense Created Success ✅",
              icon: "success",
              timer: 1000,
              timerProgressBar: true,
              showConfirmButton: false
            }).then(() => {
              navigate("/expenses");
            });
    } catch (err) {
      console.error("Error adding expense:", err);
      setError("Failed, please try again.");
    }
  };

  const handleCancle = () =>{
    setFormData({
      name: '',
        description: '',
        amount: '',
        type: '',
        date: new Date().toISOString().split('T')[0],
        paymentType: '',
    });
    navigate("/expenses");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Add New Expense</h1>
          </div>

          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter expense name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <input
                type="text"
                id="description"
                name="description"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter expense description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  required
                  step="1"
                  min="0"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Category and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label htmlFor="paymentType" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>
              <select
                id="paymentType"
                name="paymentType"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.paymentType}
                onChange={handleChange}
              >
                <option value="">Select payment method</option>
                {paymentTypes.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancle}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >              
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
