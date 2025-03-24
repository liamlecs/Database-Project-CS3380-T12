import React, { useState } from "react";

interface ConfirmEmailProps {
  // optional props if needed
}

export default function ConfirmEmail({}: ConfirmEmailProps) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/customer/confirm`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, confirmationCode: code }),
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
      setMessage("An error occurred while confirming your email.");
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Confirm Your Email</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ display: "block", width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Confirmation Code:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            style={{ display: "block", width: "100%" }}
          />
        </div>

        <button type="submit">Confirm Email</button>
      </form>

      {message && (
        <div style={{ marginTop: "1rem", fontWeight: "bold" }}>
          {message}
        </div>
      )}
    </div>
  );
}
