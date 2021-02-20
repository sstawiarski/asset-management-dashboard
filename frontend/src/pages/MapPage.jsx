import React, { useEffect, useState, useRef } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import './MapPage.css';
import Grid from '@material-ui/core/Grid';

import Header from '../components/Header';
import MapIcon from '@material-ui/icons/Map';
import ListAltIcon from '@material-ui/icons/ListAlt';

//temporary usage until shipment creation is complete
import Geocode from 'react-geocode';
import { Button, Divider } from '@material-ui/core';

import ManifestTable from '../components/Tables/ManifestTable';
import ManifestExampleTable from '../components/Tables/ManifestExampleTable';

/* Find center point of multiple markers so map is centered when multiple are selected */
const geoAverage = (items) => {
  if (items === null || items.length === 0) {
    return [30.346410, -95.470390];
  }
  if (items.length === 1) {
    return [items[0].latitude, items[0].longitude];
  }

  let x = 0.0;
  let y = 0.0;
  let z = 0.0;

  items.forEach(obj => {
    const lat = obj.latitude * Math.PI / 180;
    const lon = obj.longitude * Math.PI / 180;

    x += Math.cos(lat) * Math.cos(lon);
    y += Math.cos(lat) * Math.sin(lon);
    z += Math.sin(lat);
  });

  const total = items.length;

  x = x / total;
  y = y / total;
  z = z / total;

  const centralLon = Math.atan2(y, x);
  const centalSqRt = Math.sqrt(x * x + y * y);
  const centralLat = Math.atan2(z, centalSqRt);

  return [(centralLat * 180 / Math.PI), (centralLon * 180 / Math.PI)];

};

//current geocode, will need to be restricted for security later
Geocode.setApiKey("AIzaSyBw2ingCRrvpqdTC3sLBXRYPvIGB2hirMM");

//response language
Geocode.setLanguage("en");

// Get latitude & longitude from address, example for now
Geocode.fromAddress("Eiffel Tower").then(
  response => {
    const { lat, lng } = response.results[0].geometry.location;
    console.log(lat, lng);
  },
  error => {
    console.error(error);
  }
);

const MapPage = (props) => {
  const [manifests, setManifests] = useState([]);
  const [selManifest, setSelManifest] = useState(null);
  const [centerManifest, setCenterManifest] = useState(null);
  const [url, setURL] = useState('http://localhost:400/manifests') //might need tweaking
  const mapRef = useRef();

  //get manifest data (will probably need adjustment)
  useEffect(() => {

    //working code
    const generateURL = (filters) => {
      let url = "http://localhost:4000/shipments";
      const keys = Object.keys(filters);
      keys.forEach((key, idx) => {
        if (idx === 0) {
          url = `${url}?${key}=${filters[key]}`;
        } else {
          url = `${url}&${key}=${filters[key]}`;
        }
      });

      return url;
    };

    fetch(url)
      .then(response => {
        if (response.status < 300) {
          return response.json();
        } else {
          if (response.status >= 300) {

            return {
              count: [{ count: 0 }],
              data: []
            }
          } else {
            return null;
          }

        }
      })
      .then(json => {
        if (json) {
          setManifests(json.data);
        }
      });
  }, [url]);

  //resize map zoom when multiple items are selected
  useEffect(() => {
    const { current } = mapRef;
    const { leafletElement: map } = current;
    if (manifests.length) {

      const bounds = manifests.map(item => {
        return [item.latitude, item.longitude];
      });
      const bound2 = new L.latLngBounds(bounds);
      map.fitBounds(bound2, { padding: L.point(50, 50) });

    }
  }, [manifests]);

  //gets current location for the start of the map
  //*********************************************************** */
  
  useEffect(() => {
    const { current = {} } = mapRef;
    const { leafletElement: map } = current;

    map.locate({
      setView: true
    });

    map.on('locationfound', handleOnLocationFound)

    map.on('locationerror', handleOnLocationError);

    return () => {
      map.off('locationfound', handleOnLocationFound);
      map.off('locationerror', handleOnLocationError);
    }
  }, []);

  function handleOnLocationFound(event) {
    const { current = {} } = mapRef;
    const { leafletElement: map } = current;

    const latlng = event.latlng;
    const marker = L.marker(latlng);
    marker.bindPopup("You are here...ish");
    marker.addTo(map);
  }

  function handleOnLocationError(error) {
    console.log(error)
  }
  //************************************************************** */

  return (
    <Grid className="mapDiv" direction='row' spacing={0}>
      <Grid container spacing={0} className="mapContainer" direction='row'>

        <Grid item className='mapHeader' xs={12}>
          <Header heading="Shipments" subheading="View All" />
        </Grid>

        <Grid item className="mapGrid" xs={9}>
<<<<<<< HEAD
          <Map ref={mapRef} center={centerManifest? [centerManifest.latitude, centerManifest.longitude]: [30.346410, -95.470390]} zoom={12}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />


            {//current sample code to map markers for later use

            //mapping manifests to the map
            manifests && (
              /*
              <Marker
              key={manifests.name}
              position={[manifests.latitude, manifests.longitude]}
              onclick={() => {
                //for handling the table if we use one
                setSelManifest(manifests);
              }}
               />)
               */
              manifests.map(manifest => (
              <Marker
              key={manifest.name}
              position={[manifest.latitude, manifest.longitude]}
              onclick={() => {
                //for handling the table if we use one
                setSelManifest(manifest);
                setCenterManifest(manifest);
              }}
               />
               
              )))
=======
          <Map ref={mapRef} center={geoAverage(manifests)} zoom={12}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />

            {
              manifests.length ?

                manifests.map(shipment => (
                  <Marker
                    key={shipment.name}
                    position={[shipment.latitude, shipment.longitude]}
                    onclick={() => {
                      //handles popup
                      setSelManifest(shipment);
                    }}/>
                ))

                : null
>>>>>>> 1f552055be42fb835c100e36de4b63b2cc81f8d5
            }

            {
              selManifest ?

                <Popup position={[
                  selManifest.latitude,
                  selManifest.longitude
                ]}
<<<<<<< HEAD
                onClose={() =>{
                  setSelManifest();
                }}
                >
                  {/*add properties to view here in <p/> elements*/}
                <div>
                  <h2> {selManifest.name} </h2>
                  <p> {selManifest.location} </p>
                  <p> {selManifest.quantity} </p>
                  <p> {selManifest.notes} </p>
                </div>
                
              </Popup>
            )
=======
                  onClose={() => {
                    setSelManifest(null);
                  }}>
                  <div>
                    <h2> {selManifest.name} </h2>
                    <p> {selManifest.type} </p>
                    <p> {selManifest.quantity} </p>
                    <p> {selManifest.notes} </p>
                  </div>

                </Popup>

                : null
>>>>>>> 1f552055be42fb835c100e36de4b63b2cc81f8d5
            }

          </Map>
        </Grid>
        <Grid item xs={3} className='listContainer'>

          <Grid xs={12} container direction="row" justify="space-evenly" style={{ marginBottom: "-25px" }}>
            <Grid item xs={4}>
              <Button color="primary" startIcon={<ListAltIcon />}>List</Button>
            </Grid>
            <Grid item xs={4}>
              <Divider orientation="vertical" variant="inset" />
            </Grid>
            <Grid item xs={4}>
              <Button color="primary" disabled style={{ color: "black", textDecoration: "underline" }} startIcon={<MapIcon />}>Map</Button>
            </Grid>
          </Grid>
<<<<<<< HEAD
          {
          <ManifestExampleTable onUpdate={(objects) => {setManifests(objects);}}
              lastSelect= {(manifest)=> {
                setCenterManifest(manifest);
                  setSelManifest(manifest);
                }}/>
          }
        
=======

          <ManifestExampleTable 
          onUpdate={(objects) => setManifests(objects)} 
          onLatestClick={(manifest) => setSelManifest(manifest)} />

>>>>>>> 1f552055be42fb835c100e36de4b63b2cc81f8d5
        </Grid>
      </Grid>
    </Grid>
  );
}

export default MapPage;