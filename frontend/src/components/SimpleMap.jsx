import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

//Library Components
import { Map, Marker, TileLayer, FeatureGroup, GeoJSON, Popup } from 'react-leaflet';
import Typography from '@material-ui/core/Typography';

//Library Tools
import { makeStyles } from '@material-ui/core/styles';
import bezierSpline from '@turf/bezier-spline'; //for drawing line between the two points
import arrow from "leaflet-arrowheads";
const helpers = require('@turf/helpers').lineString; //needed to actually draw the curve with GeoJSON

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

const useStyles = makeStyles((theme) => ({
    line: {
        strokeDasharray: 5,
        stroke: "#E10000",
        opacity: 0.5
    }
}))

const SimpleMap = ({ start, end }) => {
    const classes = useStyles();

    /* Refs to the map components, used to set bounds and make the two markers fit */
    const mapRef = useRef(null);
    const featureRef = useRef(null);

    const [refAcquired, setRefAcquired] = useState(false); //true when map components are rendered and refs can be used
    const [center, setCenter] = useState([0, 0]); //center of the map
    const [popupPosition, setPopupPosition] = useState(null); //the coordinates of the Marker popup
    const [curve, setCurve] = useState(null); //curve between the two points
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

            //calculate line path
            const line = helpers([startCoords, endCoords].map(item => [item[1], item[0]]));
            const curved = bezierSpline(line);
            setCurve(curved);
        }

    }, [start, end]);

    return (
        <Map ref={mapRef} center={center} zoom={9}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />

            <FeatureGroup ref={featureRef}>
                {/* Line between the two points */}
                <GeoJSON className={classes.line} data={curve} arrowheads={{ frequency: "endonly", size: "15%" }} />

                {/* Conditionally render the markers */}
                {
                    coords ?
                        <>
                            <Marker position={coords.start} onclick={() => setPopupPosition({ coords: coords.start, location: "start" })} />
                            <Marker position={coords.end} onclick={() => setPopupPosition({ coords: coords.end, location: "end" })} />
                        </>
                        : null
                }
            </FeatureGroup>

            {/* Conditionally render popup based on state control set in Marker onClick functions */}
            {
                popupPosition ?
                    <Popup position={popupPosition.coords} onClose={() => setPopupPosition(null)}>
                        <Typography variant="body1" style={{ marginBottom: "10px" }}><b>{popupPosition.location === "start" ? "Ship From" : "Ship To"}</b></Typography>

                        {/* Render out the Location document as the popup content in a clean and somewhat dynamic way */}
                        {
                            Object.entries(popupPosition.location === "start" ? start : end)
                                .map(([key, value]) => {

                                    /* Remove the document keys that are not needed by end users */
                                    const exclude = ["_id", "__v", "coordinates"];
                                    if (exclude.includes(key)) return null;

                                    /* Break up key camelCase and capitalize the first letter for a nice label */
                                    const capitalizedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

                                    /*
                                     * Render each key-value pair as a row in the popup with the key on the left in bold and the value on the right unstyled
                                     * If the key is "contactNumber", indicating a phone number in the Location document, render a telephone link, otherwise just display the value as normal
                                     */
                                    return (
                                        <div key={key}>
                                            <Typography variant="body2" style={{ float: "left" }}><b>{capitalizedKey}</b></Typography>
                                            <Typography variant="body2" style={{ float: "right" }}>{key === "contactNumber" ? <a href={`tel:${value}`}>{value}</a> : value}</Typography>
                                            <div style={{ clear: "both" }} />
                                        </div>
                                    );
                                })
                        }
                    </Popup>
                    : null
            }
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