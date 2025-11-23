import React, { useState, useEffect } from 'react';
import { getCurrentLocation, getAddressFromCoords } from '../services/locationService';

const LocationPicker = ({ onLocationSelect }) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGetLocation = async () => {
    setLoading(true);
    try {
      const coords = await getCurrentLocation();
      setLocation(coords);
      
      const addr = await getAddressFromCoords(coords.latitude, coords.longitude);
      setAddress(addr);
      
      if (onLocationSelect) {
        onLocationSelect({ ...coords, address: addr });
      }
    } catch (error) {
      alert('Failed to get location. Please enable location services.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={styles.container}>
      <h3 style={styles.title}>📍 Location</h3>
      
      {!location ? (
        <button 
          onClick={handleGetLocation}
          disabled={loading}
          className="btn-primary"
          style={styles.button}
        >
          {loading ? 'Getting Location...' : 'Get Current Location'}
        </button>
      ) : (
        <div>
          <p style={styles.address}>{address}</p>
          <p style={styles.coords}>
            Lat: {location.latitude.toFixed(4)}, 
            Lng: {location.longitude.toFixed(4)}
          </p>
          <button 
            onClick={handleGetLocation}
            className="btn-secondary"
            style={styles.button}
          >
            Update Location
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '20px'
  },
  title: {
    color: 'white',
    marginBottom: '15px'
  },
  button: {
    width: '100%',
    padding: '12px'
  },
  address: {
    color: 'white',
    marginBottom: '10px',
    fontSize: '16px'
  },
  coords: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
    marginBottom: '15px'
  }
};

export default LocationPicker;
