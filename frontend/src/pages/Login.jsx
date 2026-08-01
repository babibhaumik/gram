import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await client.post("/auth/login", form);
      localStorage.setItem("token", data.access_token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md px-6">
      <h1 className="text-2xl font-semibold">Log in</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          className="w-full rounded-md border border-line px-3 py-2"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={update("email")}
          required
        />
        <input
          className="w-full rounded-md border border-line px-3 py-2"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={update("password")}
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-md bg-moss px-4 py-2 text-white hover:bg-moss/90"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
