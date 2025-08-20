import axios from 'axios';
import { useEffect, useState } from 'react';

const Settings = () => {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [budget,setBudget] = useState();
  const [warningLimit,setWarningLimit] = useState();
  const [settings, setSettings] = useState({
    // Preferences
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    theme: 'light',
    
    // Notifications
    emailNotifications: true,
    reminderNotifications: true,
    weeklyReports: false,
    
    // Privacy
    dataSharing: false,
    analytics: true
  });

  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("jwtToken");

        const response = await axios.get("http://localhost:8080/user/getProfile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data);
        setName(response.data.username);
        setEmail(response.data.email);
        setBudget(response.data.monthlyLimit);
        setWarningLimit(80);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Handle settings save here
    console.log('Settings saved:', settings);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'budget', name: 'Budget', icon: '💰' },
    { id: 'privacy', name: 'Privacy', icon: '🔒' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        <div className="bg-white shadow rounded-lg">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <form onSubmit={handleSave} className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 hover:cursor-not-allowed"
                      value={name}
                      readOnly
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 hover:cursor-not-allowed"
                      value={email}
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Application Preferences</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={settings.currency}
                      onChange={handleChange}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD (C$)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-2">
                      Date Format
                    </label>
                    <select
                      id="dateFormat"
                      name="dateFormat"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={settings.dateFormat}
                      onChange={handleChange}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <select
                      id="theme"
                      name="theme"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={settings.theme}
                      onChange={handleChange}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">
                        Email Notifications
                      </label>
                      <p className="text-sm text-gray-500">Receive email updates about your expenses</p>
                    </div>
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      name="emailNotifications"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={settings.emailNotifications}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="reminderNotifications" className="text-sm font-medium text-gray-700">
                        Reminder Notifications
                      </label>
                      <p className="text-sm text-gray-500">Get reminders for recurring expenses</p>
                    </div>
                    <input
                      type="checkbox"
                      id="reminderNotifications"
                      name="reminderNotifications"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={settings.reminderNotifications}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="weeklyReports" className="text-sm font-medium text-gray-700">
                        Weekly Reports
                      </label>
                      <p className="text-sm text-gray-500">Receive weekly expense summaries</p>
                    </div>
                    <input
                      type="checkbox"
                      id="weeklyReports"
                      name="weeklyReports"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={settings.weeklyReports}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Budget Tab */}
            {activeTab === 'budget' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Budget Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="monthlyBudget" className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Budget
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        id="monthlyBudget"
                        name="monthlyBudget"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={budget}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="budgetWarningThreshold" className="block text-sm font-medium text-gray-700 mb-2">
                      Warning Threshold (%)
                    </label>
                    <input
                      type="number"
                      id="budgetWarningThreshold"
                      name="budgetWarningThreshold"
                      min="1"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 hover:cursor-not-allowed"
                      value={warningLimit}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Privacy Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="dataSharing" className="text-sm font-medium text-gray-700">
                        Data Sharing
                      </label>
                      <p className="text-sm text-gray-500">Allow sharing anonymized data for improvements</p>
                    </div>
                    <input
                      type="checkbox"
                      id="dataSharing"
                      name="dataSharing"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={settings.dataSharing}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="analytics" className="text-sm font-medium text-gray-700">
                        Analytics
                      </label>
                      <p className="text-sm text-gray-500">Help improve the app with usage analytics</p>
                    </div>
                    <input
                      type="checkbox"
                      id="analytics"
                      name="analytics"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={settings.analytics}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
