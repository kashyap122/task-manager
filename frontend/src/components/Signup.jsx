import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      console.log("User registered successfully", data);
      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">

      <div className="mb-8 text-center">
        <div className="flex justify-center mb-2">
          <svg
            className="w-16 h-16 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 2a1 1 0 00-.894.553l-7 14A1 1 0 003 18h14a1 1 0 00.894-1.447l-7-14A1 1 0 0010 2z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
        <p className="text-lg text-gray-600">
          Create, Manage, and Assign Tasks
        </p>
      </div>

      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstname" className="block text-gray-700 mb-1">
                First Name
              </label>
              <InputText
                id="firstname"
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="First Name"
              />
            </div>
            <div>
              <label htmlFor="lastname" className="block text-gray-700 mb-1">
                Last Name
              </label>
              <InputText
                id="lastname"
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Last Name"
              />
            </div>
          </div>
          <div>
            <label htmlFor="username" className="block text-gray-700 mb-1">
              Username
            </label>
            <InputText
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Username"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <InputText
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Email Address"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Password
            </label>
            <Password
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              feedback={false}
              toggleMask
              placeholder="Enter Password"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">
              Confirm Password
            </label>
            <Password
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              feedback={false}
              toggleMask
              placeholder="Confirm Password"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <Button type="submit" label="Sign Up" className="w-full p-button-primary" />
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-700">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
