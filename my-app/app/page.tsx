"use client";

import React, { useState, useEffect } from "react";
import EmployeeForm from "../components/EmployeeForm";
//comment
interface Employee {
  id?: number;
  employeeName: string;
  dateOfBirth: string;
  image: string;
  email: string;
}
//comment

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const response = await fetch("/api/employees");
    const data = await response.json();
    setEmployees(data);
  };

  const handleAddEmployee = async (employee: Employee) => {
    const response = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });
    if (response.ok) {
      fetchEmployees();
      setIsModalOpen(false);
    } else {
      alert("Error adding employee");
    }
  };

  const handleUpdateEmployee = async (employee: Employee) => {
    const response = await fetch(`/api/employees/${employee.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });
    if (response.ok) {
      fetchEmployees();
      setSelectedEmployee(null);
      setIsModalOpen(false);
    } else {
      alert("Error updating employee");
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      const response = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchEmployees();
      } else {
        alert("Error deleting employee");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý nhân viên</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md"
      >
        Thêm nhân viên
      </button>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              STT
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Tên nhân viên
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Ngày sinh
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Hình ảnh
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Chức năng
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee.id}>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {index + 1}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {employee.employeeName}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {employee.dateOfBirth}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <img
                  src={employee.image}
                  alt={employee.employeeName}
                  className="h-10 w-10 rounded-full"
                />
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {employee.email}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <button
                  onClick={() => {
                    setSelectedEmployee(employee);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteEmployee(employee.id!)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {selectedEmployee ? "Cập nhật nhân viên" : "Thêm mới nhân viên"}
            </h3>
            <EmployeeForm
              employee={selectedEmployee || undefined}
              onSubmit={(employee) => {
                if (selectedEmployee) {
                  handleUpdateEmployee(employee);
                } else {
                  handleAddEmployee(employee);
                }
              }}
              onCancel={() => {
                setSelectedEmployee(null);
                setIsModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
