import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, User, Brain, Zap, Network, ArrowRight, CheckCircle, AlertTriangle, Database, Key } from 'lucide-react';



interface LoginSplashProps {
  onLogin: () => void;
}

const LoginSplash: React.FC<LoginSplashProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showAzureSuccess, setShowAzureSuccess] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [showUserTable, setShowUserTable] = useState(false);
  const [users, setUsers] = useState<Array<{ email: string, hashed_password: string }>>([]);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<Record<string, boolean | null>>({});
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [addUserStatus, setAddUserStatus] = useState<'idle' | 'success' | 'error' | 'duplicate'>('idle');

  const deleteUser = async (email: string) => {
    if (!confirm(`Are you sure you want to delete ${email}? This action cannot be undone.`)) {
      return;
    }

    try {
      setUpdatingUser(email);
      const response = await fetch(`/api/admin/users/delete/${encodeURIComponent(email)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Failed to delete user');
      }

      showToastMessage(`✅ User ${email} deleted successfully`, 'success');
      fetchUsers(); // Refresh the user list
    } catch (err: any) {
      showToastMessage('❌ ' + (err.message || 'Failed to delete user'), 'error');
    } finally {
      setUpdatingUser(null);
    }
  };

  const addNewUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      showToastMessage('❌ Please fill in all fields', 'error');
      return;
    }

    try {
      setAddUserStatus('idle');
      const response = await fetch('/api/admin/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUserEmail,
          password: newUserPassword
        })
      });

      if (response.status === 409) {
        setAddUserStatus('duplicate');
        showToastMessage('❌ User already exists', 'error');
      } else if (response.ok) {
        setAddUserStatus('success');
        setNewUserEmail('');
        setNewUserPassword('');
        showToastMessage('✅ User added successfully', 'success');
        fetchUsers(); // Refresh the user list
      } else {
        throw new Error('Failed to add user');
      }
    } catch (err: any) {
      setAddUserStatus('error');
      showToastMessage('❌ ' + (err.message || 'Failed to add user'), 'error');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users);
    } catch (err: any) {
      showToastMessage('❌ ' + (err.message || 'Failed to fetch users'), 'error');
    }
  };

  const handleUpdatePassword = async (email: string, newPassword: string) => {
    if (!newPassword) {
      showToastMessage('❌ Password cannot be empty', 'error');
      return;
    }

    setUpdatingUser(email);
    setUpdateStatus(prev => ({ ...prev, [email]: null }));

    try {
      const response = await fetch('/api/admin/users/update-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, new_password: newPassword })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Failed to update password');
      }

      setUpdateStatus(prev => ({ ...prev, [email]: true }));
      showToastMessage(`✅ Password updated for ${email}`, 'success');
    } catch (err: any) {
      setUpdateStatus(prev => ({ ...prev, [email]: false }));
      showToastMessage('❌ ' + (err.message || 'Failed to update password'), 'error');
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setIsAdminLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: adminPassword,
          is_admin: true
        })
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('agentbridge_session', 'authenticated');
        localStorage.setItem(
          'agentbridge_user',
          JSON.stringify({
            email: result.user.email,
            name: result.user.name,
            isAdmin: true,
            loginTime: new Date().toISOString()
          })
        );

        // Show success message and redirect
        showToastMessage('✅ Admin login successful!');
        setTimeout(() => {
          setShowAdminLogin(false);
          setShowUserTable(true);
          fetchUsers();
        }, 1500);
      } else {
        throw new Error(result.detail || 'Invalid admin credentials');
      }
    } catch (err: any) {
      setAdminError(err.message);
      showToastMessage('❌ ' + (err.message || 'Admin login failed'), 'error');
    } finally {
      setIsAdminLoading(false);
    }
  };

  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: password,
        })
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('agentbridge_session', 'authenticated');
        localStorage.setItem(
          'agentbridge_user',
          JSON.stringify(
            result.user || {
              email,
              name: 'Admin User',
              loginTime: new Date().toISOString()
            }
          )
        );

        setShowAzureSuccess(true);
        showToastMessage('✅ Login successful!');
        setTimeout(() => onLogin(), 2500);
      } else {
        throw new Error(result.detail || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message);
      showToastMessage('❌ ' + err.message, 'error');
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError('');
  };
  return (

    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated Background Elements */}
      <AnimatePresence>
        {showUserTable && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">User Management</h2>
                <button
                  onClick={() => {
                    setShowUserTable(false);
                    // Add a small delay for the modal close animation
                    setTimeout(() => {
                      onLogin();
                    }, 300);
                  }}
                  className="text-white/70 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="overflow-auto max-h-[70vh]">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-white/20">
                      <th className="p-3 text-blue-200">Email</th>
                      <th className="p-3 text-blue-200">New Password</th>
                      <th className="p-3 text-blue-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.email} className="border-b border-white/10 hover:bg-white/5 group">
                        <td className="p-3 text-white">{user.email}</td>
                        <td className="p-3">
                          <input
                            type="password"
                            id={`password-${user.email}`}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                            placeholder="New password"
                          />
                        </td>
                        <td className="p-3 space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => {
                              const input = document.getElementById(`password-${user.email}`) as HTMLInputElement;
                              handleUpdatePassword(user.email, input.value);
                            }}
                            disabled={updatingUser === user.email}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            {updatingUser === user.email ? 'Updating...' : 'Update'}
                          </button>
                          <button
                            onClick={() => deleteUser(user.email)}
                            disabled={updatingUser === user.email}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                          >
                            Delete
                          </button>
                          {updateStatus[user.email] === true && (
                            <span className="ml-2 text-green-400">✓</span>
                          )}
                          {updateStatus[user.email] === false && (
                            <span className="ml-2 text-red-400">✗</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Add New User Form */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">➕ Add New User</h3>
                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="relative flex-1">
                    <input
                      type="password"
                      placeholder="Password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={addNewUser}
                    disabled={!newUserEmail || !newUserPassword}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add User
                  </button>
                </div>

                {/* Status Messages */}
                {addUserStatus === 'success' && (
                  <p className="mt-2 text-sm text-green-400">✅ User added successfully</p>
                )}
                {addUserStatus === 'duplicate' && (
                  <p className="mt-2 text-sm text-yellow-400">⚠️ User already exists</p>
                )}
                {addUserStatus === 'error' && (
                  <p className="mt-2 text-sm text-red-400">❌ Failed to add user</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0">
        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              scale: 0
            }}
            animate={{
              y: [null, -100, (typeof window !== 'undefined' ? window.innerHeight : 1080) + 100],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}

        {/* Neural Network Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.line
              key={i}
              x1={`${Math.random() * 100}%`}
              y1={`${Math.random() * 100}%`}
              x2={`${Math.random() * 100}%`}
              y2={`${Math.random() * 100}%`}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, repeatType: "reverse" }}
            />
          ))}
        </svg>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className={`fixed top-6 left-1/2 transform z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${toastType === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
              }`}
          >
            {toastType === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span className="font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Azure Connectivity Success Message */}
      <AnimatePresence>
        {showAzureSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-8 right-8 z-50 bg-white dark:bg-card-bg rounded-xl shadow-2xl border border-green-200 dark:border-green-800 p-6 max-w-sm"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative">
                <Database className="w-8 h-8 text-green-600 dark:text-green-400" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-text-primary">
                  Login successful
                </h3>
                <p className="text-sm text-green-600 dark:text-green-400">
                  You are now connected to Azure
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-text-muted">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Database connectivity established</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Login Popup */}
      <AnimatePresence>
        {showAdminLogin && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 relative"
            >
              <button
                onClick={() => setShowAdminLogin(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                aria-label="Close"
              >
                ✕
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                  <Key className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Admin Login</h3>
                <p className="text-blue-200">Enter admin credentials to continue</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Admin Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="Enter admin email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Admin Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="Enter admin password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                    >
                      {showAdminPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {adminError && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm">
                    {adminError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAdminLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isAdminLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Login as Admin</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="flex-1 flex items-center justify-center p-12">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="max-w-2xl text-center"
          >
            {/* Sonata Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-32 h-32 mx-auto mb-8 bg-white rounded-2xl shadow-2xl flex items-center justify-center p-4"
            >
              <img
                src="/Sonata_logo.png"
                alt="Sonata Software"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to text if image fails to load
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    e.currentTarget.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'text-2xl font-bold text-orange-500';
                    fallback.textContent = 'Sonata';
                    parent.appendChild(fallback);
                  }
                }}
              />
            </motion.div>

            {/* Animated Brain Icon */}
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-5xl font-bold text-white mb-4 leading-tight"
            >
              AgentBridge - Lite
            </motion.h1>

            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="text-2xl text-blue-100 mb-6 font-light"
            >
              A Blueprint for Agent Network Orchestration & Optimization
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="text-lg text-blue-200 mb-8"
            >
              <span className="font-semibold text-orange-300">Sonata Software</span>
            </motion.p>

            {/* Feature Icons */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="flex justify-center space-x-8"
            >
              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-2">
                  <Network className="w-6 h-6 text-blue-300" />
                </div>
                <span className="text-sm text-blue-200">Orchestration</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-2">
                  <Zap className="w-6 h-6 text-purple-300" />
                </div>
                <span className="text-sm text-purple-200">Optimization</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-2">
                  <Brain className="w-6 h-6 text-orange-300" />
                </div>
                <span className="text-sm text-orange-200">Intelligence</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-12">
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="w-full max-w-md relative"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 relative">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="text-center mb-8"
              >
                <h3 className="text-2xl font-bold text-white mb-2">Welcome Back</h3>
                <p className="text-blue-200">Sign in to access AgentBridge</p>
              </motion.div>

              <form onSubmit={handleLogin} className="space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="Enter email"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to AgentBridge</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAdminLogin(true)}
                  className="text-sm text-blue-300 hover:text-white transition-colors flex items-center justify-center space-x-1 mx-auto"
                >
                  <Key className="w-4 h-4" />
                  <span>Users Management (only admin)</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="text-center mt-6"
            >
              <p className="text-sm text-blue-300">
                Powered by{' '}
                <span className="font-semibold text-orange-300">Sonata Software</span>
              </p>
              <p className="text-xs text-blue-400 mt-2">
                Enterprise AI • Secure • Scalable
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginSplash;