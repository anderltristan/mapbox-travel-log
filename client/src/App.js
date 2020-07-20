import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';

import { listLogEntries } from './api';
import LogEntryForm from './LogEntryForm';

const App = () => { 
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState([]);
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 37.7577,
    longitude: -98,
    zoom: 4
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  // data fetching hook
  useEffect(() => {
    // IIFE to list log entries
    (async () => {
      const logEntries = await listLogEntries();
      // update state with useState hook
      setLogEntries(logEntries);
      console.log(logEntries);
    })();
  }, []);

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude
    })
  }

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle='mapbox://styles/mapbox/dark-v10'
      onDblClick={showAddMarkerPopup}
    >
      {
        logEntries.map(entry => (
          <div
            onClick={() => setShowPopup({
              [entry._id]: true
            })}
          >
            <Marker 
              key={entry._id}
              latitude={entry.latitude} 
              longitude={entry.longitude} 
            >
              <img 
                className="map-marker" 
                alt="marker" 
                src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png"
                />
            </Marker>
            {
              showPopup[entry._id] ? ( 
                <Popup
                  latitude={entry.latitude} 
                  longitude={entry.longitude} 
                  closeButton={true}
                  closeOnClick={false}
                  onClose={() => setShowPopup({})}
                  anchor="top" >
                    <div className="map-marker-popup">
                      <h2>{entry.title}</h2>
                      <p>{entry.comments}</p>
                      <span>Visited on {new Date(entry.visitDate).toLocaleDateString()}</span>
                      {entry.image ? <img src={entry.image} alt={entry.title}/> : null }
                    </div>
                </Popup>
              ) : null
            }
          </div>
        ))
      }
      {
        addEntryLocation ? (
          <div>
            <Marker 
              key={addEntryLocation._id}
              latitude={addEntryLocation.latitude} 
              longitude={addEntryLocation.longitude} 
            >
              <img 
                className="map-marker" 
                alt="marker" 
                src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png"
                />
            </Marker>
            <Popup
              latitude={addEntryLocation.latitude} 
              longitude={addEntryLocation.longitude} 
              closeButton={true}
              closeOnClick={false}
              onClose={() => setAddEntryLocation(null)}
              anchor="top" >
                <div className="map-marker-popup">
                  <LogEntryForm onClose={() => {
                    setAddEntryLocation(null);
                    // Reload map
                    getEntries();
                  }} location={addEntryLocation}/>
                </div>
            </Popup>
          </div>
        ) : null
      }
    </ReactMapGL>
  );
}

export default App;