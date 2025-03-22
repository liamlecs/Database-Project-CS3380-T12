//Not functional yet, have to link to the database.
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="container mt-5">
      {/* Header for the Login page */}
      <h2 className="text-center">Login</h2>

      {/* Login Form */}
      <form>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Email
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Enter your Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {/* Password Field */}
        <div className="mb-3">
          <label htmlFor="inputPassword5" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="inputPassword5"
            className="form-control"
            placeholder="Enter your password"
            aria-describedby="passwordHelpBlock"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
}
