import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

//Library Components
import { Map, Marker, TileLayer, FeatureGroup, GeoJSON, Popup } from 'react-leaflet';
import Typography from '@material-ui/core/Typography';
import L from 'leaflet';

//Icons
import ShipFromIcon from './Icons/ShipFromIcon.svg'; //blue icon represents source
import ShipToIcon from './Icons/ShipToIcon.svg'; //green icon represents destination

//Library Tools
import { makeStyles } from '@material-ui/core/styles';
import bezierSpline from '@turf/bezier-spline'; //for drawing line between the two points
import arrow from "leaflet-arrowheads"; //add arrowheads to line

//Helper Tools
import { findCoordinateAverage } from '../utils/mapping.utils';
const helpers = require('@turf/helpers').lineString; //needed to actually draw the curve with GeoJSON

/* Styles */
const useStyles = makeStyles((theme) => ({
    /* Styling for the line between the two points (red dashed line) */
    line: {
        strokeDasharray: 5,
        stroke: "#E10000",
        opacity: 0.5
    },
    /* Ensures popup is not covered by the zoom controls */
    popup: {
        "& .leaflet-popup-content-wrapper": {
            marginLeft: "50px"
        }
    }
}));

/* Using SVG to make a custom marker icon for the destination */
const shipToMarkerIcon = new L.Icon({
    iconUrl: ShipToIcon,
    iconSize: [35, 30],
    iconAnchor: [18, 28],
    className: 'leaflet-marker-shipto'
});

/* Using SVG to make a custom marker icon for the source */
const shipFromMarkerIcon = new L.Icon({
    iconUrl: ShipFromIcon,
    iconSize: [35, 30],
    iconAnchor: [18, 28],
    className: 'leaflet-marker-shipfrom'
});

const SimpleMap = ({ start, end, data, styling }) => {
    const classes = useStyles();

    /* Refs to the map components, used to set bounds and make the two markers fit */
    const mapRef = useRef(null);
    const featureRef = useRef(null);

    const [refAcquired, setRefAcquired] = useState(false); //true when map components are rendered and refs can be used
    const [center, setCenter] = useState([51, -114]); //center of the map
    const [popupPosition, setPopupPosition] = useState(null); //the coordinates of the Marker popup
    const [curve, setCurve] = useState(null); //curve between the two points
    const [coords, setCoords] = useState(null); //the extracted start and end coordinates from the prop documents

    /* Wait until render to allow use of map Refs */
    useEffect(() => {
        setRefAcquired(true);
    }, [])

    // TESTING printing out data
    useEffect(() => {
        if (data) {
            console.log(data);
        }
    }, [data])

    /* Reset the map bounds to ensure both markers fit in the viewport */
    useEffect(() => {
        if (refAcquired) {
            try {
                mapRef.current.leafletElement.fitBounds(featureRef.current.leafletElement.getBounds());
            } catch (err) { }
        }
    }, [refAcquired, data]);

    /* Centers the popup when it is open, or re-center to fit the two markers when it is closed */
    useEffect(() => {
        if (refAcquired) {
            if (popupPosition) {
                mapRef.current.leafletElement.setView(coords ? [popupPosition.coords[0]+5, popupPosition.coords[1]] : popupPosition.coords);
            } else {
                mapRef.current.leafletElement.setView(center);
            }
        }
    }, [center, popupPosition, refAcquired, coords]);

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
            const centered = findCoordinateAverage([startCoords, endCoords]);
            setCenter(centered);

            //calculate line path
            const line = helpers([startCoords, endCoords].map(item => [item[1], item[0]]));
            const curved = bezierSpline(line);
            setCurve(curved);
        } else if (data) {
            /* Calculate the center of all the points and set the center of the map */
            if (data.length) {
                const dataCoords = data.map((obj, idx) => {
                    /* TODO: Using the index as coords until we can get assets set up with actual coordinates */
                    if (!obj.hasOwnProperty("deployedLocation")) return [idx, idx];
                    else if (typeof obj["deployedLocation"] === "string") return [idx, idx];
                    else if (typeof obj["deployedLocation"] === "object" && !obj["deployedLocation"].hasOwnProperty("coordinates")) return [idx, idx];
                    return Object.values(obj.deployedLocation.coordinates);
                });
                setCenter(findCoordinateAverage(dataCoords));
            } else {
                /* If no data is supplied or last item is deselected, set center back to its original coordinates */
                setCenter([51, -114]);
            }

            /* Close the popup when the item it is for is deselected */
            if (popupPosition !== null && popupPosition.hasOwnProperty("object")) {
                const findPopup = data.filter(item => item.serial === popupPosition.object.serial);
                if (!findPopup.length) setPopupPosition(null);
            }
        }

    }, [start, end, data, popupPosition]);

    return (
        <Map style={styling ? styling : null} ref={mapRef} center={center} zoom={9}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />

            <FeatureGroup ref={featureRef}>

                {/* Line between the two points */}
                { curve ? <GeoJSON className={classes.line} data={curve} arrowheads={{ frequency: "endonly", size: "15%" }} /> : null }

                {/* Conditionally render the markers */}
                {
                    coords ?
                        <>
                            <Marker icon={shipFromMarkerIcon} position={coords.start} onclick={() => setPopupPosition({ coords: coords.start, title: "start" })} />
                            <Marker icon={shipToMarkerIcon} position={coords.end} onclick={() => setPopupPosition({ coords: coords.end, title: "end" })} />
                        </>
                        : data ?
                            <>
                                {data.map((item, idx) => <Marker position={item.hasOwnProperty("coordinates") ? item.coordinates : [idx, idx]} onclick={() => setPopupPosition({ coords: item.hasOwnProperty("coordinates") ? item.coordinates : [idx, idx], object: item })} />)}
                            </>
                            : null
                }

            </FeatureGroup>

            {/* Conditionally render popup based on state control set in Marker onClick functions */}
            {
                popupPosition ?
                    <Popup className={classes.popup} position={popupPosition.coords} onClose={() => setPopupPosition(null)}>
                        <Typography variant="body1" style={{ marginBottom: "10px" }}><b>{popupPosition.title === "start" ? "Ship From" : popupPosition.title === "end" ? "Ship To" : popupPosition.title}</b></Typography>

                        {/* Render out the document as the popup content in a clean and dynamic way */}
                        {
                                <>
                                    {
                                        Object.entries(popupPosition.hasOwnProperty("object") ? popupPosition.object : popupPosition.title === "start" ? start : end)
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
                                </>
                        }
                    </Popup>
                    : null
            }
        </Map>
    );
};

SimpleMap.propTypes = {
    /**
     * Shipment document representing the location of the starting point, e.g. "shipFrom"
     */
    start: PropTypes.object,
    /**
     * Shipment document representing the location of the end point, e.g. "shipTo"
     */
    end: PropTypes.object,
    /**
     * Inline styles to apply directly to the map container
     */
    styling: PropTypes.object,
    /**
     * Array of asset objects to map as markers, each should contain a "deployedLocation" property holding a document with its coordinates where applicable
     */
    data: PropTypes.array
}

export default SimpleMap;