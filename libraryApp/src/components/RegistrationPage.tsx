import React, { useState } from "react";
import "./RegistrationPage.css";

export default function RegistrationPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Simple function to check if email ends in @uh.edu or @cougarnet.uh.edu
  function isValidEmailDomain(inputEmail: string) {
    const lowerEmail = inputEmail.toLowerCase();
    return (
      lowerEmail.endsWith("@uh.edu") ||
      lowerEmail.endsWith("@cougarnet.uh.edu")
    );
  }

  // Updated handleSubmit to check empty fields and send data to the server
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for blank fields
    if (!firstName || !lastName || !email || !password) {
      alert("Please fill out all required fields.");
      return;
    }

    // Validate email domain
    if (!isValidEmailDomain(email)) {
      alert("Email must end in @uh.edu or @cougarnet.uh.edu");
      return;
    }

    if (!agreed) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }

    // Prepare payload for the backend
    const payload = { firstName, lastName, email, password };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/customer/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert("Registration failed: " + errorText);
        return;
      }

      alert("Registration successful! A confirmation email has been sent.");
      // Optionally, redirect the user to the login page, e.g.:
      // window.location.href = "/login";
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again later.");
    }
  };

  const validEmail = isValidEmailDomain(email);

  return (
    <div className="register-container">
      {/* Left half: library background */}
      <div className="register-left">
        <div className="branding">E-Library</div>
      </div>

      {/* Right half: form */}
      <div className="register-right">
        <div className="form-box">
          <h2>Create An Account</h2>
          <p>
            Already have an account?{" "}
            <a href="/LoginPage">Log in</a>
          </p>

          <form onSubmit={handleSubmit}>
            {/* First/Last name */}
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

            {/* Email */}
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

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Terms & Conditions */}
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

            {/* Submit button */}
            <button
              type="submit"
              disabled={!validEmail || !agreed}
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
