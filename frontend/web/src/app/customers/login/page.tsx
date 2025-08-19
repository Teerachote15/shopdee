// 1. Importing Dependencies
"use client"; // ต้องใช้เพราะใช้ useState และ window, localStorage
import { useState, FormEvent } from "react";
import axios from "axios";

// 2. Creating and Exporting a Component
export default function Login() {
  // 2.1 Defining Variables, States, and Handlers

  // สร้างตัวแปร state สำหรับเก็บ username และ password
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // สร้างฟังก์ชันสำหรับจัดการการ submit form ไปยัง API
  // โดยใช้ async/await เพื่อจัดการกับการเรียก API แบบ asynchronous
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ป้องกัน reload หน้า

    try {      
      // ใช้ axios เพื่อส่ง POST request ไปยัง API
      const response = await axios.post("http://localhost:4000/api/login", {
        username,
        password
      });

      const result = response.data;// รับข้อมูลจาก API      
      alert(result.message);// แสดงข้อความจาก API

      // ถ้าเข้าสู่ระบบสำเร็จ จะเก็บ token และ redirect ไปหน้าแรก
      if (result.status === true) {        
        localStorage.setItem("token", result.token);
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Login error:", err);// แสดงข้อผิดพลาดใน console
      alert("Login failed.");// แสดงข้อความเมื่อเข้าสู่ระบบไม่สำเร็จ
    }
  };

  // 2.2 Returning UI Output  
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">เข้าสู่ระบบ</h2>

      <input
        type="text"
        placeholder="ชื่อผู้ใช้"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />

      <input
        type="password"
        placeholder="รหัสผ่าน"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        เข้าสู่ระบบ
      </button>
    </form>
  );
}
