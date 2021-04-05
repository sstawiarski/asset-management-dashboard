import Typography from '@material-ui/core/Typography';

/**
 * Calculate the geographic center of multiple coordinates
 * 
 * Retreived from https://gist.github.com/tlhunter/0ea604b77775b3e7d7d25ea0f70a23eb
 * 
 * @param {Array} coords coordinates for which to find a geographic center
 */
export const findCoordinateAverage = (coords) => {
  if (coords.length === 1) {
    return coords[0];
  }

  let x = 0.0;
  let y = 0.0;
  let z = 0.0;

  for (let coord of coords) {
    if (coord === null) continue;
    let latitude = coord[0] * Math.PI / 180;
    let longitude = coord[1] * Math.PI / 180;

    x += Math.cos(latitude) * Math.cos(longitude);
    y += Math.cos(latitude) * Math.sin(longitude);
    z += Math.sin(latitude);
  }

  let total = coords.length;

  x = x / total;
  y = y / total;
  z = z / total;

  let centralLongitude = Math.atan2(y, x);
  let centralSquareRoot = Math.sqrt(x * x + y * y);
  let centralLatitude = Math.atan2(z, centralSquareRoot);

  return [(centralLatitude * 180 / Math.PI), (centralLongitude * 180 / Math.PI)];
};

/**
 * Helper function to render out location document key-value pairs in a pretty way
 * 
 * @param {Object} obj location document
 * @param {String[]} exclude keys from the document to exclude from the pretty print
 * @returns prettified object representation
 */
export const prettyStringify = (obj, exclude = []) => {
  if (!obj) return null;
  return Object.entries(obj)
    .map(([key, value]) => {

      /* Remove the document keys that are not needed by end users */
      if (exclude.includes(key)) return null;

      /* Break up key camelCase and capitalize the first letter for a nice label */
      const capitalizedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

      if (key === "coordinates") {
        return (
          <div key={key}>
            <Typography variant="subtitle2" style={{ float: "left" }}><b>{capitalizedKey}</b>&nbsp;&nbsp;&nbsp;</Typography>
            <Typography variant="subtitle2" style={{ float: "right" }}>{JSON.stringify(value)}</Typography>
            <div style={{ clear: "both" }} />
          </div>
        );
      }

      if (key === "dateCreated" || key === "lastUpdated") {
        if (value) {
          return (
            <div key={key}>
              <Typography variant="subtitle2" style={{ float: "left" }}><b>{capitalizedKey}</b>&nbsp;</Typography>
              <Typography variant="subtitle2" style={{ float: "right" }}>{new Date(value).toLocaleDateString("en-US")}</Typography>
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
          <Typography variant="subtitle2" style={{ float: "left" }}><b>{capitalizedKey}</b>&nbsp;</Typography>
          <Typography variant="subtitle2" style={{ float: "right" }}>{value}</Typography>
          <div style={{ clear: "both" }} />
        </div>
      );
    })
};