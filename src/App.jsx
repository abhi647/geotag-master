import React, { useState, useRef } from 'react';
import Overlay from './components/Overlay';
import * as htmlToImage from 'html-to-image';
import piexif from 'piexifjs';
import { Upload, Download, Globe, Map as MapIcon, Calendar, Navigation, Trash2, Image as ImageIcon } from 'lucide-react';

function App() {
  const [data, setData] = useState({
    locationName: 'Zirakpur, Punjab, India',
    address: 'Tricity Trade Tower, 504, Patiala Highway, Near Radisson Hotel, Zirakpur, Punjab 140603, India',
    lat: '30.63739',
    long: '76.801177',
    dateTime: '29/09/2025 06:58 PM GMT +05:30'
  });

  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [mapPreview, setMapPreview] = useState(null);
  const [mapName, setMapName] = useState('');
  const resultRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onload = (re) => setImage(re.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleMapUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMapName(file.name);
      const reader = new FileReader();
      reader.onload = (re) => setMapPreview(re.target.result);
      reader.readAsDataURL(file);
    }
  };

  const convertToDMS = (deg) => {
    const absolute = Math.abs(deg);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60 * 100);
    return [[degrees, 1], [minutes, 1], [seconds, 100]];
  };

  const downloadImage = async () => {
    if (resultRef.current) {
      try {
        const jpegUrl = await htmlToImage.toJpeg(resultRef.current, { quality: 1.0 });

        // Prepare EXIF data
        const zeroth = {};
        const exif = {};
        const gps = {};

        const lat = parseFloat(data.lat);
        const lng = parseFloat(data.long);

        gps[piexif.GPSIFD.GPSLatitudeRef] = lat >= 0 ? 'N' : 'S';
        gps[piexif.GPSIFD.GPSLatitude] = convertToDMS(lat);
        gps[piexif.GPSIFD.GPSLongitudeRef] = lng >= 0 ? 'E' : 'W';
        gps[piexif.GPSIFD.GPSLongitude] = convertToDMS(lng);

        const now = new Date();
        const timestamp = now.toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/-/g, ':');
        zeroth[piexif.ImageIFD.DateTime] = timestamp;

        const exifObj = { "0th": zeroth, "Exif": exif, "GPS": gps };
        const exifBytes = piexif.dump(exifObj);

        const newJpegUrl = piexif.insert(exifBytes, jpegUrl);

        const link = document.createElement('a');
        link.download = `geotagged-${Date.now()}.jpg`;
        link.href = newJpegUrl;
        link.click();
      } catch (error) {
        console.error("EXIF Injection failed:", error);
        const dataUrl = await htmlToImage.toPng(resultRef.current, { quality: 1.0 });
        const link = document.createElement('a');
        link.download = `geotagged-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      }
    }
  };

  return (
    <div className="main-layout">
      {/* Sidebar Controls */}
      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Globe className="upload-icon" size={24} /> GeoTag Master
          </h2>
          <button onClick={() => window.location.reload()} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }} title="Reset All">
            <Trash2 size={18} />
          </button>
        </div>

        <div className="scroll-area">
          <div className="input-block">
            <label><ImageIcon size={14} /> Background Image</label>
            <div className="file-upload-zone">
              <Upload className="upload-icon" size={24} style={{ margin: '0 auto' }} />
              <div className="upload-text">Drag or click to primary photo</div>
              {imageName && <div className="upload-filename">{imageName}</div>}
              <input type="file" onChange={handleImageUpload} accept="image/*" />
            </div>
          </div>

          <div className="input-block">
            <label><MapIcon size={14} /> Map Thumbnail</label>
            <div className="file-upload-zone" style={{ padding: '1rem' }}>
              <div className="upload-text" style={{ fontSize: '0.75rem' }}>Upload Map Screenshot</div>
              {mapName && <div className="upload-filename">{mapName}</div>}
              <input type="file" onChange={handleMapUpload} accept="image/*" />
            </div>
          </div>

          <div className="input-block">
            <label><MapIcon size={14} /> Location Name</label>
            <input value={data.locationName} onChange={e => setData({ ...data, locationName: e.target.value })} placeholder="e.g. London, UK" />
          </div>

          <div className="input-block">
            <label><Navigation size={14} /> Full Address</label>
            <textarea rows="3" value={data.address} onChange={e => setData({ ...data, address: e.target.value })} placeholder="Full street address..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-block">
              <label>Latitude</label>
              <input value={data.lat} onChange={e => setData({ ...data, lat: e.target.value })} placeholder="30.637..." />
            </div>
            <div className="input-block">
              <label>Longitude</label>
              <input value={data.long} onChange={e => setData({ ...data, long: e.target.value })} placeholder="76.801..." />
            </div>
          </div>

          <div className="input-block">
            <label><Calendar size={14} /> Date & Time</label>
            <input value={data.dateTime} onChange={e => setData({ ...data, dateTime: e.target.value })} />
          </div>
        </div>

        <button className="btn" onClick={downloadImage} style={{ marginTop: '1.5rem' }}>
          <Download size={18} /> Download High Quality JPG
        </button>
      </div>

      {/* Preview Area */}
      <div className="preview-container">
        <div className="geo-image-wrapper" ref={resultRef}>
          {image ? (
            <img src={image} alt="Preview" />
          ) : (
            <div className="preview-placeholder">
              <div style={{ textAlign: 'center', color: '#64748b' }}>
                <Upload size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                <p>Upload a background image to see the overlay live</p>
              </div>
            </div>
          )}

          {image && <Overlay data={data} mapPreview={mapPreview} />}
        </div>

        <p className="footer-note">
          The output will be saved as a high-quality JPEG with GPS coordinates and Timestamp embedded in the EXIF data.
        </p>
      </div>
    </div>
  );
}

export default App;
