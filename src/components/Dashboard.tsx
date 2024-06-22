import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Employee {
  employeeName: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const adminId = localStorage.getItem("adminId");

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/employees/${adminId}`);
        console.log(response);
        
        setEmployees(response.data.employees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    getEmployees();
  }, [adminId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to the Employee Management System</h1>
        <p className="text-gray-600 mb-8">Manage your employees easily and efficiently.</p>
        <Link to="/create-employee">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">
            Create Employees
          </button>
        </Link>
      </div>
      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {employees.map((employee, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{employee?.employeeName}</td>
                <td className="py-3 px-6 text-left">{employee?.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
