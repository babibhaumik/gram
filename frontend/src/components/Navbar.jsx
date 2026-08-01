import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav className="flex items-center justify-between border-b border-line px-6 py-4">
      <Link to="/" className="text-xl font-display font-semibold text-ink">
        PropertyGram
      </Link>
      <div className="flex items-center gap-4 text-sm">
        {isLoggedIn ? (
          <>
            <Link to="/add-property" className="text-slate hover:text-moss">
              Add property
            </Link>
            <button onClick={logout} className="text-slate hover:text-clay">
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate hover:text-moss">
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-md bg-moss px-4 py-2 text-white hover:bg-moss/90"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
