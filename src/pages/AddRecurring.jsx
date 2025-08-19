import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AddRecurring = () => {
  const navigate = useNavigate();

  // match API body exactly
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    frequency: '',
    type: '',
    paymentType:'',
    status: '',
    startDate: new Date().toISOString().split('T')[0],
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

  const statusOptions = [
    "Active",
    "Paused",
    "Inactive"
  ];

  const frequencies = [
    'Weekly',
    'BiWeekly',
    'Monthly',
    'Quarterly',
    'SemiAnnually',
    'Annually'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(
        "http://localhost:8081/expense/RExpense",
        {
          ...formData,
          amount: parseFloat(formData.amount), // backend expects number not string
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`
          },
        }
      );

      Swal.fire({
        title: "Created!",
        text: "Expense Created Success ✅",
        icon: "success",
        timer: 2000, // 2 seconds
        timerProgressBar: true,
        showConfirmButton: false
      }).then(() => {
        navigate("/recurring");
      });


    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to create expense ❌", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Add Recurring Expense</h1>
            <p className="mt-1 text-sm text-gray-600">
              Set up an expense that repeats automatically at regular intervals.
            </p>
          </div>

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
                placeholder="e.g., Netflix Subscription"
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
                placeholder="Details about the expense"
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

            {/* Category (type) and Frequency */}
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
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency *
                </label>
                <select
                  name="frequency"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.frequency}
                  onChange={handleChange}
                >
                  <option value="">Select frequency</option>
                  {frequencies.map((freq) => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status and Start Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="">Select status</option>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/recurring')}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create Recurring Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRecurring;
