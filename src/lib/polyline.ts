/**
 * --- WHAT IS A POLYLINE? ---
 * When we plan a route (like Bangalore to Mysore), we get thousands of GPS coordinates.
 * Sending all those numbers to an API would make the URL too long and slow.
 * 
 * "Polyline Encoding" is a famous Google algorithm that squashes all those 
 * coordinates into a single, compact string like "_p~iF~ps|U_c@...".
 */

export function encodePolyline(coordinates: [number, number][], precision = 5) {
  // Precision 5 means we keep 5 decimal places (standard for Google Maps)
  const factor = Math.pow(10, precision);
  let lastLat = 0;
  let lastLng = 0;
  let result = '';

  // We loop through every coordinate pair in the route
  for (const coord of coordinates) {
      const lat = coord[1]; // GeoJSON format gives us [lng, lat], so we swap them
      const lng = coord[0];
      
      // We multiply the decimal by 100,000 to turn it into a whole number
      const latE5 = Math.round(lat * factor);
      const lngE5 = Math.round(lng * factor);

      // We only store the "Difference" from the previous point.
      // This makes the numbers smaller and easier to compress!
      const dLat = latE5 - lastLat;
      const dLng = lngE5 - lastLng;

      lastLat = latE5;
      lastLng = lngE5;

      // We run our magic compression on the Latitude and Longitude differences
      result += encodeValue(dLat) + encodeValue(dLng);
  }
  return result;
}

/**
 * --- THE COMPRESSION MAGIC ---
 * This function turns a large number into a set of special characters.
 * It uses "Bitwise Operations" (shifting bits left and right) to pack data tightly.
 */
function encodeValue(value: number) {
  // Step 1: Handle negative numbers using a trick called "ZigZag encoding"
  let v = value < 0 ? ~(value << 1) : value << 1;
  let result = '';
  
  // Step 2: Break the number into 5-bit chunks
  while (v >= 0x20) {
      // Step 3: Turn each chunk into a printable ASCII character (adding 63)
      result += String.fromCharCode((0x20 | (v & 0x1f)) + 63);
      v >>= 5;
  }
  result += String.fromCharCode(v + 63);
  return result;
}
