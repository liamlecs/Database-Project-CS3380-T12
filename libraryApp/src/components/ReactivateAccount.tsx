import React, { useState } from "react";

export default function ReactivateAccount() {
  const [email, setEmail] = useState("");
  const [reactivationCode, setReactivationCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Customer/ReactivateAccount`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, reactivationCode }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        setMessage(`Error: ${errorText}`);
      } else {
        const successText = await response.text();
        setMessage(successText);
      }
    } catch (err: any) {
      console.error(err);
      setMessage("An error occurred while reactivating your account.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "2rem auto",
        textAlign: "center",
        paddingTop: "80px", // Adjust for fixed navbar, if needed
      }}
    >
      <h2 style={{ marginBottom: "1.5rem" }}>Reactivate Account</h2>

      <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
        {/* Email Field */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "0.25rem",
            }}
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

        {/* Reactivation Code Field */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            htmlFor="reactivationCode"
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "0.25rem",
            }}
          >
            Reactivation Code:
          </label>
          <input
            id="reactivationCode"
            type="text"
            value={reactivationCode}
            onChange={(e) => setReactivationCode(e.target.value)}
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
          Reactivate Account
        </button>
      </form>

      {/* Message */}
      {message && (
        <div
          style={{
            marginTop: "1rem",
            fontWeight: "bold",
            textAlign: "center",
            whiteSpace: "pre-wrap", // preserves line breaks if any
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
