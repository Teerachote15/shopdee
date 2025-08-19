// 1. Importing Dependencies
"use client"; // ต้องใช้เพราะใช้ useState และ window, localStorage
import { useState, FormEvent } from "react";
import axios from "axios";

// 2. Creating and Exporting a Component
export default function Register() {
  // 2.1 Defining Variables, States, and Handlers  

  // สร้างตัวแปร state สำหรับเก็บ username, password, firstName และ lastName
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  // สร้างฟังก์ชันสำหรับจัดการการ submit form ไปยัง API
  // โดยใช้ async/await เพื่อจัดการกับการเรียก API แบบ asynchronous  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ป้องกัน reload หน้า

    try {
      // ใช้ axios เพื่อส่ง POST request ไปยัง API
      const response = await axios.post("http://localhost:4000/api/register", {
        username,
        password,
        firstName,
        lastName,
      });

      const result = response.data;// รับข้อมูลจาก API      
      alert(result.message);// แสดงข้อความจาก API

      // ถ้าสมัครสมาชิกสำเร็จจะ redirect ไปหน้าแรก
      if (result.status === true) {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Registration error:", err);// แสดงข้อผิดพลาดใน console
      alert("Registration failed.");// แสดงข้อความเมื่อสมัครสมาชิกไม่สำเร็จ
    }
  };

  // 2.2 Returning UI Output  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          ระบบซื้อขายออนไลน์
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
        >
          สมัครสมาชิก
        </button>
      </form>
    </div>
  );
}

