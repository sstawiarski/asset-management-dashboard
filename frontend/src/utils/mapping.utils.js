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