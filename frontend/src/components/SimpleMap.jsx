import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

//Library Components
import { Map, Marker, TileLayer, FeatureGroup } from 'react-leaflet';

/**
 * Finds the center (average) of 2 coordinates
 * 
 * @param {array} start array with the starting point latitude at the first index and longitude at the second
 * @param {array} end array with the ending point latitude at the first index and longitude at the second
 */
const centerPoints = (start, end) => {
    //if the arrays are undefined, default to [0, 0]
    if (!start || !end) {
        return [0, 0];
    }

    const newLat = (start[0] + end[0]) / 2;
    const newLon = (start[1] + end[1]) / 2;

    return [newLat, newLon];
};

const SimpleMap = ({ start, end }) => {
    /* Refs to the map components, used to set bounds and make the two markers fit */
    const mapRef = useRef(null);
    const featureRef = useRef(null);

    const [refAcquired, setRefAcquired] = useState(false); //true when map components are rendered and refs can be used
    const [center, setCenter] = useState([0, 0]); //center of the map
    const [coords, setCoords] = useState(null); //the extracted start and end coordinates from the prop documents

    /* Wait until render to allow use of map Refs */
    useEffect(() => {
        setRefAcquired(true);
    }, [])

    /* Reset the map bounds to ensure both markers fit in the viewport */
    useEffect(() => {
        if (refAcquired) {
            try {
                mapRef.current.leafletElement.fitBounds(featureRef.current.leafletElement.getBounds());
            } catch (err) { }
        }
    }, [refAcquired]);

    /* Extract the appropriate coordinates and perform line and centering calculations */
    useEffect(() => {

        if (start && end) {
            //extract coordinates
            const startCoords = Object.values(start.coordinates);
            const endCoords = Object.values(end.coordinates);
            setCoords({
                start: startCoords,
                end: endCoords
            });

            //find geographic center
            const centered = centerPoints(startCoords, endCoords);
            setCenter(centered);
        }

    }, [start, end]);

    return (
        <Map ref={mapRef} center={center} zoom={9}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />

            <FeatureGroup ref={featureRef}>
                {/* Conditionally render the markers */}
                {
                    coords ?
                        <>
                            <Marker position={coords.start} />
                            <Marker position={coords.end} />
                        </>
                        : null
                }
            </FeatureGroup>
        </Map>
    );
};

SimpleMap.propTypes = {
    /**
     * A single shipment document
     */
    start: PropTypes.object,
    /**
     * A single shipment document
     */
    end: PropTypes.object
}

export default SimpleMap;