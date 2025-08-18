import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';

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

      // If backend returns Page object with content
      const expenses = response.data.content || response.data; // fallback
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


// Handle Delete R-Expense 
const handleDelete = async (id) => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    setError("Unauthorized. Please login again.");
    return;
  }

  const enteredPassword = window.prompt("Please enter your password to confirm deletion:");

  // if user cancelled the prompt or left it empty
  if(!enteredPassword){
    return; 
  }

  try {
    await axios.delete(`http://localhost:8081/expense/RExpense/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-User-password": enteredPassword
      }
    });
    // Remove from frontend state after successful deletion
    setRecurringExpenses(expenses => expenses.filter(exp => exp.id !== id));
  } catch (err) {
    console.error(err);
    setError("Failed to delete expense. Try again.");
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
    if(status === 'Active')
      return 'bg-green-300 text-green-900'
    else if(status === "Inactive") 
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
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">#</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Recurring
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {recurringExpenses.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {recurringExpenses.filter(e => e.status === 'Active').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">$</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Monthly Total
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ${recurringExpenses
                        .filter(e => e.status === 'Active')
                        .reduce((sum, e) => sum + e.amount, 0)
                        .toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recurring Expenses Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Id
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Due
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recurringExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {expense.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {expense.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.frequency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.startDate}
                  </td>
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
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(expense.id)
                      }}
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


// import axios from 'axios';
// import { useState, useEffect } from 'react';
// import { useNavigate,Link } from 'react-router-dom';

// const RecurringList = () => {
//   const navigate = useNavigate();
//   const [recurringExpenses, setRecurringExpenses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchRExpenses = async () => {
//       const token = localStorage.getItem("jwtToken");

//       if (!token) {
//         setError("Unauthorized! Please login.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get("http://localhost:8081/expense/RExpense", {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         const expenses = response.data.content || response.data; 
//         setRecurringExpenses(expenses);
//       } catch (err) {
//         if (err.response?.status === 401) {
//           setError("Unauthorized. Please login again.");
//         } else if (err.response?.status === 403) {
//           setError("Forbidden. Your token is invalid or expired.");
//         } else {
//           setError("Failed to fetch expenses. Please try again later.");
//         }
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRExpenses();
//   }, []);

//   const handleDelete = async (id) => {
//     const token = localStorage.getItem("jwtToken");
//     if (!token) {
//       setError("Unauthorized. Please login again.");
//       return;
//     }

//     const enteredPassword = window.prompt("Please enter your password to confirm deletion:");
//     if(!enteredPassword){
//       return; 
//     }

//     try {
//       await axios.delete(`http://localhost:8081/expense/RExpense/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "X-User-password": enteredPassword
//         }
//       });
//       setRecurringExpenses(expenses => expenses.filter(exp => exp.id !== id));
//     } catch (err) {
//       console.error(err);
//       setError("Failed to delete expense. Try again.");
//     }
//   };

//   const toggleStatus = (id) => {
//     setRecurringExpenses(expenses =>
//       expenses.map(expense =>
//         expense.id === id
//           ? { ...expense, status: expense.status === 'Active' ? 'Paused' : 'Active' }
//           : expense
//       )
//     );
//   };

//   const getStatusColor = (status) => {
//     if(status === 'Active')
//       return 'bg-green-300 text-green-900'
//     else if(status === "Inactive") 
//       return 'bg-red-300 text-red-900';
//     else return 'bg-yellow-200 text-yellow-900'
//   };

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-600 font-medium">
//         {error}
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading recurring expenses...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-3">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Recurring Expenses</h1>
//           <Link 
//             to="/add-recurring"
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 text-sm"
//           >
//             Add Recurring Expense
//           </Link>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           {/* (same summary cards, unchanged) */}
//         </div>

//         {/* Recurring Expenses Table */}
//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   {['Id','Description','Amount','Category','Frequency','Next Due','Status','Actions']
//                     .map((h) => (
//                       <th
//                         key={h}
//                         className="px-4 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         {h}
//                       </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {recurringExpenses.map((expense) => (
//                   <tr key={expense.id} className="hover:bg-gray-50">
//                     <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-[11px] sm:text-sm">{expense.id}</td>
//                     <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-[11px] sm:text-sm">{expense.description}</td>
//                     <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-[11px] sm:text-sm">
//                       ${expense.amount.toFixed(2)}
//                     </td>
//                     <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-[11px] sm:text-sm">
//                       <span className="inline-flex px-2 py-1 text-[10px] sm:text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
//                         {expense.type}
//                       </span>
//                     </td>
//                     <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-[11px] sm:text-sm">{expense.frequency}</td>
//                     <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-[11px] sm:text-sm">{expense.startDate}</td>
//                     <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-[11px] sm:text-sm">
//                       <span className={`inline-flex px-2 py-1 text-[10px] sm:text-xs font-semibold rounded-full ${getStatusColor(expense.status)}`}>
//                         {expense.status}
//                       </span>
//                     </td>
//                     <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-[11px] sm:text-sm">
//                       <button
//                         onClick={() => toggleStatus(expense.id)}
//                         className="text-indigo-600 hover:text-indigo-900 mr-2 sm:mr-4"
//                       >
//                         {expense.status === 'Active' ? 'Pause' : 'Activate'}
//                       </button>
//                       <button className="text-indigo-600 hover:text-indigo-900 mr-2 sm:mr-4">
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(expense.id)}
//                         className="text-red-600 hover:text-red-900"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecurringList;
