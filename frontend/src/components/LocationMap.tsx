interface LocationMapProps {
  location: string;
  country: string;
}

function LocationMap({ location, country }: LocationMapProps) {
  const mapQuery = encodeURIComponent(`${location}, ${country}`);

  return (
    <div className="map-section">
      <h2>Location Map</h2>

      <iframe
        title={`Map of ${location}`}
        src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
        className="location-map"
        loading="lazy"
      ></iframe>
    </div>
  );
}

export default LocationMap;