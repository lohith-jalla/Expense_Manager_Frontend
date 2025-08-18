import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError("Invalid credentials or server error");
        return;
      }

      const data = await response.json();

      // Store JWT and userId
      localStorage.setItem("jwtToken", data.jwt);
      localStorage.setItem("userId", data.userId);
      console.log(localStorage.getItem("jwtToken"));

      setError("");
      setTimeout(()=>{
        navigate("/expenses")
      },1000);
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed: " + err.message);
    }
  };

  return (
    <>
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5", // your previous background color
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          backgroundColor: "#fff", // your previous form color
        }}
      >
        <h2 style={{ textAlign: "center", color: "#333", marginBottom: "25px" }}>
          Login
        </h2>
        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
          <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Sign up
            </button>
        </form>
        {error && (
          <p style={{ color: "red", marginTop: "15px", textAlign: "center" }}>
            {error}
          </p>
        )}
      </div>
    </div>
    </>
  );
}
