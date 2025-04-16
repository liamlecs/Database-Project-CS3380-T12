import React, { useState } from "react";
import "./RegistrationPage.css";

export default function RegistrationPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  function isValidEmailDomain(inputEmail: string) {
    const lowerEmail = inputEmail.toLowerCase();
    return (
      lowerEmail.endsWith("@uh.edu") ||
      lowerEmail.endsWith("@cougarnet.uh.edu")
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      alert("Please fill out all required fields.");
      return;
    }
    if (!isValidEmailDomain(email)) {
      alert("Email must end in @uh.edu or @cougarnet.uh.edu");
      return;
    }
    if (!agreed) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }

    const payload = { firstName, lastName, email, password };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/customer/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        alert("Registration failed: " + errorText);
        return;
      }
      alert("Registration successful! A confirmation email has been sent.");
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again later.");
    }
  };

  const validEmail = isValidEmailDomain(email);

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="branding">E-Library @ UH</div>
      </div>

      <div className="register-right">
        <div className="form-box">
          <h2>Create An Account</h2>
          <p>
            Already have an account? <a href="/login">Log in</a>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="two-inputs">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <input
              type="email"
              placeholder="Email (@uh.edu or @cougarnet.uh.edu)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {!validEmail && email.length > 0 && (
              <p className="error-text">
                Email must end in @uh.edu or @cougarnet.uh.edu
              </p>
            )}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="checkbox-row">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label>
                I agree to the <a href="/terms">Terms &amp; Conditions</a>
              </label>
            </div>

            <button type="submit" disabled={!validEmail || !agreed}>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
