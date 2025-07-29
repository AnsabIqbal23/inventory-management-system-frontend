import React, { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 font-sans">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 text-white p-8 rounded-2xl shadow-2xl animate-fade-in">
        <h1 className="text-4xl font-extrabold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
          Trackventory
        </h1>
        <p className="text-center text-sm text-gray-300 mb-6 font-medium">
          Keep your stock smartly tracked 🚀
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition duration-200 rounded-md font-semibold text-white shadow-lg"
          >
            Sign In
          </button>
        </form>
        <div className="mt-6 text-sm text-center text-gray-400 font-light">
          Don’t have an account?{" "}
          <span className="text-blue-400 hover:underline cursor-pointer font-medium">
            Register
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
