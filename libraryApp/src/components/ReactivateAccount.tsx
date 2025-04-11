import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReactivateAccount() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Customer/ReactivateAccount`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, reactivationCode: code }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.message || "Reactivation failed.");
        return;
      }
      setMessage("Account reactivated successfully.");
      // Redirect to login or home after a short delay.
      setTimeout(() => navigate("/customer-login"), 2000);
    } catch (error) {
      setMessage("Error reactivating account. Please try again.");
    }
  };

  return (
    <div className="reactivate-account">
      <h2>Reactivate Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Reactivation Code:</label>
          <input 
            type="text" 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Reactivate Account</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
