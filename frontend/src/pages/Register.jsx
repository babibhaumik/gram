import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
  });
  const [error, setError] = useState("");

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await client.post("/auth/register", form);
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md px-6">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          className="w-full rounded-md border border-line px-3 py-2"
          placeholder="Full name"
          value={form.full_name}
          onChange={update("full_name")}
          required
        />
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
          placeholder="Phone number"
          value={form.phone_number}
          onChange={update("phone_number")}
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
          Sign up
        </button>
      </form>
    </div>
  );
}
