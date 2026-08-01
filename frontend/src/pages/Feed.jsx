import { useEffect, useState } from "react";
import client from "../api/client";
import PropertyCard from "../components/PropertyCard";

export default function Feed() {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    client
      .get("/properties")
      .then(({ data }) => setProperties(data))
      .catch(() => setError("Could not load properties"));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Latest listings</h1>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {!error && properties.length === 0 && (
        <p className="mt-4 text-sm text-slate">
          No listings yet. Be the first to add one.
        </p>
      )}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
}
