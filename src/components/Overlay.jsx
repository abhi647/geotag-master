import React from 'react';
import { MapPin } from 'lucide-react';

const Overlay = ({ data, mapPreview }) => {
  return (
    <div className="geo-overlay" id="printable-overlay">
      <div className="map-box">
        {mapPreview ? (
          <img src={mapPreview} alt="Map" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#64748b', textAlign: 'center', padding: '10px' }}>
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
      <div className="badge-float">
        <MapPin size={10} />
        GPS Map Camera
      </div>
    </div>
  );
};

export default Overlay;
