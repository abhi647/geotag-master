import React from 'react';
import { Navigation } from 'lucide-react';

const Overlay = ({ data, mapPreview }) => {
  return (
    <div className="geo-overlay" id="printable-overlay">
      <div className="badge-float">
        <Navigation size={10} fill="currentColor" /> GPS MAP CAMERA
      </div>
      <div className="map-box">
        {mapPreview ? (
          <img src={mapPreview} alt="Map" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.6rem', color: '#64748b', textAlign: 'center', padding: '4px' }}>
            Map Loading...
          </div>
        )}
      </div>
      <div className="info-box">
        <div className="info-title">
          <span className="text">{data.locationName || 'Location Name'}</span>
          <span className="emoji">🇮🇳</span>
        </div>
        <div className="info-address">
          {data.address || 'Street Address, City, State, ZIP, Country'}
        </div>
        <div className="info-meta">
          <div>Lat {data.lat || '0.000000'}° Long {data.long || '0.000000'}°</div>
          <div>{data.dateTime || '29/09/2025 06:58 PM GMT+05:30'}</div>
        </div>
      </div>
    </div>
  );
};

export default Overlay;
