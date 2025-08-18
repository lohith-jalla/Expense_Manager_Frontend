import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post("http://localhost:8080/auth/register", formData);
      if (response.status === 200) {
        setMessage(`✅ Registered successfully! Welcome ${response.data.username} (ID: ${response.data.id})`);

        setTimeout(()=>{
          setLoading(false);
          navigate("/login")
        },1000);
        
      }
    } catch (error) {
      if (error.response) {
        setMessage(`❌ Error: ${error.response.data.message || "Registration failed"}`);
      } else {
        setMessage("❌ Server unreachable. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Please Wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us and manage your expenses smarter ✨
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-lg text-sm font-medium ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              id="username"
              name="username"
              type="text"
              required
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />

            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
