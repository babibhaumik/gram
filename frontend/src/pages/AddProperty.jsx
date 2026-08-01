import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

const initialForm = {
  title: "",
  description: "",
  property_type: "apartment",
  listing_type: "sale",
  price: "",
  area_sqft: "",
  bedrooms: "",
  bathrooms: "",
  city: "",
  address: "",
};

export default function AddProperty() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        area_sqft: form.area_sqft ? parseFloat(form.area_sqft) : null,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms, 10) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms, 10) : null,
      };
      await client.post("/properties", payload);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Could not add property");
    }
  }

  return (
    <div className="mx-auto mt-12 max-w-xl px-6">
      <h1 className="text-2xl font-semibold">Add a property</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          className="w-full rounded-md border border-line px-3 py-2"
          placeholder="Title"
          value={form.title}
          onChange={update("title")}
          required
        />
        <textarea
          className="w-full rounded-md border border-line px-3 py-2"
          placeholder="Description"
          value={form.description}
          onChange={update("description")}
          rows={3}
        />
        <div className="flex gap-4">
          <select
            className="w-full rounded-md border border-line px-3 py-2"
            value={form.property_type}
            onChange={update("property_type")}
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="plot">Plot</option>
            <option value="commercial">Commercial</option>
          </select>
          <select
            className="w-full rounded-md border border-line px-3 py-2"
            value={form.listing_type}
            onChange={update("listing_type")}
          >
            <option value="sale">For sale</option>
            <option value="rent">For rent</option>
          </select>
        </div>
        <input
          className="w-full rounded-md border border-line px-3 py-2"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={update("price")}
          required
        />
        <div className="flex gap-4">
          <input
            className="w-full rounded-md border border-line px-3 py-2"
            placeholder="Area (sqft)"
            type="number"
            value={form.area_sqft}
            onChange={update("area_sqft")}
          />
          <input
            className="w-full rounded-md border border-line px-3 py-2"
            placeholder="Bedrooms"
            type="number"
            value={form.bedrooms}
            onChange={update("bedrooms")}
          />
          <input
            className="w-full rounded-md border border-line px-3 py-2"
            placeholder="Bathrooms"
            type="number"
            value={form.bathrooms}
            onChange={update("bathrooms")}
          />
        </div>
        <input
          className="w-full rounded-md border border-line px-3 py-2"
          placeholder="City"
          value={form.city}
          onChange={update("city")}
          required
        />
        <input
          className="w-full rounded-md border border-line px-3 py-2"
          placeholder="Address"
          value={form.address}
          onChange={update("address")}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-md bg-moss px-4 py-2 text-white hover:bg-moss/90"
        >
          Publish listing
        </button>
      </form>
    </div>
  );
}
