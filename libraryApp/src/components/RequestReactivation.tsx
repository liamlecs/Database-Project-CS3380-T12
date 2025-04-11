import React, { useState } from "react";

export default function RequestReactivation() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Customer/RequestReactivate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.message || "Request failed.");
        return;
      }
      setMessage("A reactivation code has been sent to your email.");
    } catch (error) {
      setMessage("Error sending reactivation code. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", textAlign: "center", paddingTop: "60px" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>Request Reactivation Code</h2>
      <form onSubmit={handleRequest} style={{ textAlign: "left" }}>
        {/* Email Field */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label 
            htmlFor="email"
            style={{ display: "block", fontWeight: "bold", marginBottom: "0.25rem" }}
          >
            Email:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "0.5rem",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            width: "100%",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "0.75rem",
            fontSize: "1rem",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Send Reactivation Code
        </button>
      </form>

      {/* Message */}
      {message && (
        <div
          style={{
            marginTop: "1rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
