import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

//Library Components
import { Map, Marker, TileLayer, FeatureGroup, GeoJSON, Popup } from 'react-leaflet';
import Typography from '@material-ui/core/Typography';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

//Icons
import ShipFromIcon from '../Icons/ShipFromIcon.svg'; //blue icon represents source
import ShipToIcon from '../Icons/ShipToIcon.svg'; //green icon represents destination

//Library Tools
import { makeStyles } from '@material-ui/core/styles';
import bezierSpline from '@turf/bezier-spline'; //for drawing line between the two points
// eslint-disable-next-line no-unused-vars
import arrow from "leaflet-arrowheads"; //add arrowheads to line

//Helper Tools
import { findCoordinateAverage } from '../../utils/mapping.utils';
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

const SimpleMap = ({ start, end, data, styling, onBoundsChanged = null, variant = null }) => {
    const classes = useStyles();

    /* Refs to the map components, used to set bounds and make the two markers fit */
    const mapRef = useRef(null);
    const featureRef = useRef(null);

    const boundsInitialLoadCallback = useRef((bounds) => onBoundsChanged ? onBoundsChanged(bounds) : null); //runs on map mounting so asset list is properly updated

    const [refAcquired, setRefAcquired] = useState(false); //true when map components are rendered and refs can be used
    const [center, setCenter] = useState([51, -114]); //center of the map
    const [popupPosition, setPopupPosition] = useState(null); //the coordinates of the Marker popup
    const [curve, setCurve] = useState(null); //curve between the two points
    const [coords, setCoords] = useState(null); //the extracted start and end coordinates from the prop documents

    /* Wait until render to allow use of map Refs */
    useEffect(() => {
        setRefAcquired(true);
    }, []);

    /* onBoundsChanged only runs when the map moves, so run it when the map first loads too */
    useEffect(() => {
        const bounds = mapRef.current.leafletElement.getBounds();
        const southWest = bounds.getSouthWest();
        const northEast = bounds.getNorthEast();
        boundsInitialLoadCallback.current([southWest.lat, southWest.lng, northEast.lat, northEast.lng]);
    }, [mapRef, boundsInitialLoadCallback]);

    /* Reset the map bounds to ensure both markers fit in the viewport */
    useEffect(() => {
        if (refAcquired) {
            try {
                mapRef.current.leafletElement.fitBounds(featureRef.current.leafletElement.getBounds());
            } catch (err) { }
        }
    }, [refAcquired]);

    /* Centers the popup when it is open, or re-center to fit the two markers when it is closed */
    useEffect(() => {
        if (refAcquired) {
            if (popupPosition) {
                mapRef.current.leafletElement.setView(coords ? [popupPosition.coords[0] + 5, popupPosition.coords[1]] : popupPosition.coords);
            } else if (variant !== "search") {
                mapRef.current.leafletElement.setView(center);
            }
        }
    }, [center, popupPosition, refAcquired, coords, variant]);

    /* Extract the appropriate coordinates and perform line and centering calculations */
    useEffect(() => {

        if (start && end) {
            //extract coordinates
            /* MongoDB stores coordinates in longitude-latitude order rather than the standard lat-lon, so reverse for Leaflet */
            const startCoordsReversed = [...start.coordinates].reverse();
            const endCoordsReversed = [...end.coordinates].reverse();

            setCoords({
                start: startCoordsReversed,
                end: endCoordsReversed
            });

            //find geographic center
            const centered = findCoordinateAverage([startCoordsReversed, endCoordsReversed]);
            setCenter(centered);

            //line path uses GeoJSON, same as MongoDB, so we can use the non-reversed coordinates
            const line = helpers([start.coordinates, end.coordinates]);
            const curved = bezierSpline(line);
            setCurve(curved);
        } else if (data) {
            /* Calculate the center of all the points and set the center of the map */
            if (data.length) {
                const dataCoords = data.map((obj, idx) => {
                    if (!obj.hasOwnProperty("deployedLocation")) return [0, 0];
                    else if (typeof obj["deployedLocation"] === "string") return [0, 0];
                    else if (typeof obj["deployedLocation"] === "object" && !obj["deployedLocation"].hasOwnProperty("coordinates")) return [0, 0];
                    return [...obj.deployedLocation.coordinates].reverse();
                });

                if (variant !== "search") setCenter(findCoordinateAverage(dataCoords));
            } else {
                /* If no data is supplied or last item is deselected, set center back to its original coordinates */
                if (variant !== "search") setCenter([51, -114]);
            }

            /* Close the popup when the item it is for is deselected */
            if (popupPosition !== null && popupPosition.hasOwnProperty("object")) {
                const findPopup = data.filter(item => item.serial === popupPosition.object.serial);
                if (!findPopup.length) setPopupPosition(null);
            }
        }

    }, [start, end, data, popupPosition, variant]);

    /**
     * Helper function to return the map bounds using the onBoundsChanged prop function
     * 
     * @returns an array of the coordinates of the lower left and upper right bounds of the map view
     */
    const onViewChanged = () => {
        if (!onBoundsChanged) return;
        const bounds = mapRef.current.leafletElement.getBounds();
        const southWest = bounds.getSouthWest();
        const northEast = bounds.getNorthEast();
        onBoundsChanged([southWest.lat, southWest.lng, northEast.lat, northEast.lng]);
    }

    return (
        <Map style={styling ? styling : null} ref={mapRef} center={center} zoom={9} ondragend={onViewChanged} onzoomend={onViewChanged}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />

            <FeatureGroup ref={featureRef}>

                {/* Line between the two points */}
                {curve ? <GeoJSON className={classes.line} data={curve} arrowheads={{ frequency: "endonly", size: "15%" }} /> : null}

                {/* Conditionally render the markers */}
                {
                    coords ?
                        <>
                            <Marker icon={shipFromMarkerIcon} position={coords.start} onclick={() => setPopupPosition({ coords: coords.start, title: "start" })} />
                            <Marker icon={shipToMarkerIcon} position={coords.end} onclick={() => setPopupPosition({ coords: coords.end, title: "end" })} />
                        </>
                        : data ?
                            <>
                                <MarkerClusterGroup>
                                    {
                                        data.map((item, idx) => {
                                            return <Marker
                                                key={item["serial"]}
                                                position={
                                                    item["deployedLocation"] ?
                                                        [...item["deployedLocation"].coordinates].reverse()
                                                        : [idx, idx]
                                                }
                                                onclick={() => setPopupPosition({ coords: item["deployedLocation"] ? [...item["deployedLocation"].coordinates].reverse() : [idx, idx], object: item })} />
                                        })
                                    }
                                </MarkerClusterGroup>
                            </>
                            : null
                }

            </FeatureGroup>

            {/* Conditionally render popup based on state control set in Marker onClick functions */}
            {
                popupPosition ?
                    <Popup autoPan={false} className={classes.popup} position={popupPosition.coords} onClose={() => setPopupPosition(null)}>
                        <Typography variant="body1" style={{ marginBottom: "10px" }}><b>{popupPosition.title === "start" ? "Ship From" : popupPosition.title === "end" ? "Ship To" : popupPosition.title}</b></Typography>

                        {/* Render out the document as the popup content in a clean and dynamic way */}
                        {
                            <>
                                {
                                    Object.entries(popupPosition.hasOwnProperty("object") ? popupPosition.object : popupPosition.title === "start" ? start : end)
                                        .map(([key, value]) => {

                                            /* Remove the document keys that are not needed by end users */
                                            const exclude = ["_id", "__v", "coordinates", "missingItems", "parentId", "retired", "assignmentType", "checkedOut",
                                                "groupTag", "contractNumber", "assetType"];
                                            if (exclude.includes(key)) return null;

                                            /* Break up key camelCase and capitalize the first letter for a nice label */
                                            const capitalizedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

                                            if (key === "deployedLocation") {
                                                return (
                                                    <div key={key}>
                                                        <Typography variant="body2" style={{ float: "left" }}><b>{capitalizedKey}</b></Typography>
                                                        <Typography variant="body2" style={{ float: "right" }}>{value["locationName"]}</Typography>
                                                        <div style={{ clear: "both" }} />
                                                    </div>
                                                );
                                            }

                                            if (key === "dateCreated" || key === "lastUpdated") {
                                                if (value) {
                                                    return (
                                                        <div key={key}>
                                                            <Typography variant="body2" style={{ float: "left" }}><b>{capitalizedKey}</b></Typography>
                                                            <Typography variant="body2" style={{ float: "right" }}>{new Date(value).toLocaleDateString("en-US")}</Typography>
                                                            <div style={{ clear: "both" }} />
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }

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
    data: PropTypes.array,
    /**
     * If variant is not "search" then the map is centered with all markers in view
     * Setting "search" means the user can drag the map around without it being centered as soon as a marker is found (defeating the purpose of drag-to-search)
     */
    variant: PropTypes.string
}

export default SimpleMap;