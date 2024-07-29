import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdPerson, MdEmail, MdLock } from 'react-icons/md';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">Create Account</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200">Name</label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-2">
              <MdPerson className="text-gray-500 dark:text-gray-400" size={20} />
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                className="w-full p-2 bg-transparent focus:outline-none dark:text-white"
                placeholder="Enter your name"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200">Email</label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-2">
              <MdEmail className="text-gray-500 dark:text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                className="w-full p-2 bg-transparent focus:outline-none dark:text-white"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200">Password</label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-2">
              <MdLock className="text-gray-500 dark:text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                className="w-full p-2 bg-transparent focus:outline-none dark:text-white"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-3 rounded-lg text-center"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
