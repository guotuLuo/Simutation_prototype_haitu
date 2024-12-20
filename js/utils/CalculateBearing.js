function calculateBearing(startLatLng, endLatLng) {
    const lat1 = startLatLng.lat;
    const lon1 = startLatLng.lng;
    const lat2 = endLatLng.lat;
    const lon2 = endLatLng.lng;

    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    const bearing = Math.atan2(y, x) * 180 / Math.PI;

    return (bearing + 360) % 360; // 返回值是0到360之间
}
