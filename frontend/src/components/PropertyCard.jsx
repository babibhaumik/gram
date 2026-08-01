export default function PropertyCard({ property }) {
  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-ink">{property.title}</h3>
        <span className="rounded-full bg-sand px-3 py-1 text-xs font-medium text-moss">
          {property.listing_type}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate">{property.city}</p>
      <p className="mt-3 text-xl font-display text-clay">
        ${property.price.toLocaleString()}
      </p>
      <div className="mt-3 flex gap-4 text-xs text-slate">
        {property.bedrooms != null && <span>{property.bedrooms} bd</span>}
        {property.bathrooms != null && <span>{property.bathrooms} ba</span>}
        {property.area_sqft != null && <span>{property.area_sqft} sqft</span>}
      </div>
      <div className="mt-4 border-t border-line pt-3 text-xs text-slate">
        <p className="font-medium text-ink">{property.owner_name}</p>
        <a
          href={`tel:${property.owner_phone}`}
          className="text-moss hover:underline"
        >
          {property.owner_phone}
        </a>
      </div>
    </div>
  );
}
