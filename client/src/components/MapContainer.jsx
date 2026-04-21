import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '20px',
  overflow: 'hidden'
};

const center = {
  lat: 15.4909,
  lng: 73.8278 // Panaji, Goa
};

const mapStyles = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#1d2c4d" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#8ec3b9" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#1a3646" }]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#4b6878" }]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#334e87" }]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{ "color": "#283d6a" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#6f9ba5" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#304a7d" }]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#98a5be" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#0e1626" }]
  }
];

export default function MapContainer({ spots = [], routingTarget = null }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [selectedSpot, setSelectedSpot] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [map, setMap] = useState(null);

  // Auto-detect location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => console.log("Location access denied")
      );
    }
  }, []);

  // Update directions when routingTarget changes
  useEffect(() => {
    if (routingTarget && userLocation) {
      // Directions will be handled by the DirectionsService component's callback
      setSelectedSpot(routingTarget);
    }
  }, [routingTarget, userLocation]);

  const directionsCallback = useCallback((res) => {
    if (res !== null) {
      if (res.status === 'OK') {
        setDirections(res);
      } else {
        console.log('Directions error: ', res);
      }
    }
  }, []);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (!isLoaded) return <div className="skeleton" style={{ height: '400px', borderRadius: '20px' }} />;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={userLocation || center}
      zoom={userLocation ? 12 : 10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles: mapStyles,
        disableDefaultUI: false,
        zoomControl: true,
      }}
    >
      {/* User Location Marker */}
      {userLocation && (
        <Marker
          position={userLocation}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
          }}
          title="You are here"
        />
      )}

      {/* Spots Markers */}
      {spots.map((spot) => (
        spot.coordinates && (
          <Marker
            key={spot.id}
            position={{ lat: spot.coordinates.lat, lng: spot.coordinates.lng }}
            onClick={() => {
              setSelectedSpot(spot);
              setDirections(null); // Reset directions when selecting a new marker
            }}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }}
          />
        )
      ))}

      {/* Routing */}
      {userLocation && selectedSpot && selectedSpot.coordinates && (
        <DirectionsService
          options={{
            destination: { lat: selectedSpot.coordinates.lat, lng: selectedSpot.coordinates.lng },
            origin: userLocation,
            travelMode: 'DRIVING'
          }}
          callback={directionsCallback}
        />
      )}

      {directions && (
        <DirectionsRenderer
          options={{
            directions: directions,
            suppressMarkers: false // Keep markers for origin/dest
          }}
        />
      )}

      {selectedSpot && (
        <InfoWindow
          position={{ lat: selectedSpot.coordinates.lat, lng: selectedSpot.coordinates.lng }}
          onCloseClick={() => {
            setSelectedSpot(null);
            setDirections(null);
          }}
        >
          <div style={{ color: '#0d1b2a', padding: '5px' }}>
            <h4 style={{ margin: '0 0 5px 0' }}>{selectedSpot.name}</h4>
            <p style={{ margin: 0, fontSize: '0.8rem' }}>{selectedSpot.area}</p>
            {userLocation && (
              <p style={{ margin: '5px 0 0 0', fontSize: '0.75rem', color: '#00b4d8', fontWeight: '600' }}>
                🚗 Route calculated from your location
              </p>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
