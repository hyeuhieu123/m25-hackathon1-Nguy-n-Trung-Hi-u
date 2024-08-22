"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Employee {
  id: number;
  employeeName: string;
  dateOfBirth: string;
  image: string;
  email: string;
}

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: 0,
    employeeName: "",
    dateOfBirth: "",
    image: "",
    email: "",
  });

  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios
      .get("http://localhost:3000/api/employees")
      .then((response) => {
        setEmployees(response.data.employees);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingEmployee) {
      axios
        .put(
          `http://localhost:3000/api/employees/${editingEmployee.id}`,
          newEmployee
        )
        .then(() => {
          resetForm();
          fetchEmployees();
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      axios
        .post("http://localhost:3000/api/employees", newEmployee)
        .then(() => {
          resetForm();
          fetchEmployees();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const validateForm = () => {
    if (
      !newEmployee.employeeName ||
      !newEmployee.dateOfBirth ||
      !newEmployee.email
    ) {
      setError("Vui lòng nhập đủ thông tin.");
      return false;
    }

    if (
      !editingEmployee &&
      employees.some((emp) => emp.email === newEmployee.email)
    ) {
      setError("Email đã tồn tại.");
      return false;
    }

    setError("");
    return true;
  };

  const resetForm = () => {
    setEditingEmployee(null);
    setNewEmployee({
      id: 0,
      employeeName: "",
      dateOfBirth: "",
      image: "",
      email: "",
    });
    setError("");
  };

  const handleDelete = (id: number) => {
    setShowModal(true);
    setEditingEmployee(employees.find((emp) => emp.id === id) || null);
  };

  const confirmDelete = () => {
    if (editingEmployee) {
      axios
        .delete(`http://localhost:3000/api/employees/${editingEmployee.id}`)
        .then(() => {
          setShowModal(false);
          resetForm();
          fetchEmployees();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleEdit = (id: number) => {
    const employee = employees.find((emp) => emp.id === id);
    if (employee) {
      setEditingEmployee(employee);
      setNewEmployee(employee);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="flex justify-between">
      <table className="table-basic">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên nhân viên</th>
            <th>Ngày sinh</th>
            <th>Hình ảnh</th>
            <th>Email</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee.id}>
              <td>{index + 1}</td>
              <td>{employee.employeeName}</td>
              <td>{formatDate(employee.dateOfBirth)}</td>
              <td>
                <img src={employee.image} alt={employee.employeeName} />
              </td>
              <td>{employee.email}</td>
              <td>
                <button
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2"
                  onClick={() => handleEdit(employee.id)}
                >
                  Sửa
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleDelete(employee.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="form ">
        <h3 className="text-lg font-bold  ">
          {editingEmployee ? "Cập nhật nhân viên" : "Thêm mới nhân viên"}
        </h3>
        <form>
          <div className="mb-4">
            <label htmlFor="employeeName" className="block">
              Tên nhân viên
            </label>
            <input
              type="text"
              id="employeeName"
              className="w-full px-3 py-2 border rounded-md "
              placeholder="Nhập tên nhân viên"
              value={newEmployee.employeeName}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, employeeName: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <label htmlFor="dateOfBirth" className="block">
              Ngày sinh
            </label>
            <input
              type="date"
              id="dateOfBirth"
              className="w-full px-3 py-2 border rounded-md "
              value={newEmployee.dateOfBirth}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, dateOfBirth: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block ">
              Hình ảnh
            </label>
            <input
              type="text"
              id="image"
              className="w-full px-3 py-2 border rounded-md "
              placeholder="Nhập đường dẫn hình ảnh"
              value={newEmployee.image}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, image: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block ">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-md "
              placeholder="Nhập email"
              value={newEmployee.email}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, email: e.target.value })
              }
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-2 "
          >
            {editingEmployee ? "Cập nhật" : "Thêm"}
          </button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h2 className="text-lg font-semibold mb-4">Xác nhận xóa</h2>
            <p className="mb-6">Bạn có muốn xóa nhân viên này không?</p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={confirmDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
