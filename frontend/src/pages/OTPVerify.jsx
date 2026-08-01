import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import client from "../api/client";

export default function OTPVerify() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await client.post("/auth/otp/verify", { email, code });
      localStorage.setItem("token", data.access_token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Verification failed");
    }
  }

  async function handleResend() {
    setError("");
    try {
      await client.post("/auth/otp/resend", { email });
      setResent(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not resend code");
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md px-6">
      <h1 className="text-2xl font-semibold">Verify your account</h1>
      <p className="mt-2 text-sm text-slate">
        Enter the code sent to {email || "your email/phone"}.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          className="w-full rounded-md border border-line px-3 py-2 tracking-widest"
          placeholder="6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {resent && <p className="text-sm text-moss">New code sent.</p>}
        <button
          type="submit"
          className="w-full rounded-md bg-moss px-4 py-2 text-white hover:bg-moss/90"
        >
          Verify
        </button>
        <button
          type="button"
          onClick={handleResend}
          className="w-full text-sm text-slate hover:text-moss"
        >
          Resend code
        </button>
      </form>
    </div>
  );
}
