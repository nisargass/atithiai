// Real-time Geolocation & Google Maps Navigation Engine
class GeoService {
  constructor() {
    this.userLocation = null; // { latitude, longitude, accuracy, timestamp, isFallback }
    this.locationError = null;
    this.watchId = null;
  }

  // Get user's current live GPS position via HTML5 Geolocation API
  async getUserLocation(forceRefresh = false) {
    if (this.userLocation && !forceRefresh && !this.userLocation.isFallback) {
      return this.userLocation;
    }

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        this.locationError = "Geolocation is not supported by your browser.";
        this.setDefaultLocation();
        resolve(this.userLocation);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp || Date.now(),
            isFallback: false
          };
          this.locationError = null;
          this.notifyLocationChange();
          resolve(this.userLocation);
        },
        (error) => {
          console.warn("Geolocation notice:", error.message);
          this.locationError = error.message;
          this.setDefaultLocation();
          this.notifyLocationChange();
          resolve(this.userLocation);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
      );
    });
  }

  // Fallback coordinates: Mysore Palace / Sayyaji Rao Road (City Center)
  setDefaultLocation() {
    this.userLocation = {
      latitude: 12.3051,
      longitude: 76.6551,
      accuracy: 50,
      timestamp: Date.now(),
      isFallback: true
    };
  }

  // Start continuous real-time GPS tracking
  startRealtimeTracking() {
    if (this.watchId !== null || !navigator.geolocation) return;

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp || Date.now(),
          isFallback: false
        };
        this.locationError = null;
        this.notifyLocationChange();
      },
      (error) => {
        console.warn("Continuous GPS notice:", error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
    );
  }

  // Stop real-time GPS tracking
  stopRealtimeTracking() {
    if (this.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Notify listeners and window of live location update
  notifyLocationChange() {
    window.dispatchEvent(new CustomEvent('atithi:location_updated', {
      detail: { location: this.userLocation }
    }));
  }

  // Calculate distance between two coordinates using Haversine formula (km)
  calculateDistance(lat1, lon1, lat2, lon2) {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  }

  // Format latitude/longitude nicely for UI badges
  formatCoordinates(lat, lng) {
    if (lat == null || lng == null) return "12.3051° N, 76.6551° E";
    const latStr = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
    const lngStr = `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
    return `${latStr}, ${lngStr}`;
  }

  // Generate direct Google Maps Live Navigation URL
  getGoogleMapsDirectionsUrl(dest, travelMode = 'driving') {
    let destLat = 12.3051;
    let destLng = 76.6551;
    let destTitle = "Mysuru, Karnataka";

    if (dest) {
      if (typeof dest.latitude === 'number') destLat = dest.latitude;
      if (typeof dest.longitude === 'number') destLng = dest.longitude;
      if (dest.name) destTitle = dest.name + (dest.location ? `, ${dest.location}` : ', Mysuru');
      else if (dest.title) destTitle = dest.title + ', Mysuru';
    }

    const encodedTitle = encodeURIComponent(destTitle);

    // If user's real GPS is available, pass origin coordinates for turn-by-turn routing
    if (this.userLocation && !this.userLocation.isFallback) {
      const originLat = this.userLocation.latitude.toFixed(6);
      const originLng = this.userLocation.longitude.toFixed(6);
      return `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&destination_place_id=&travelmode=${travelMode}`;
    }

    // Direct Google Maps navigation URL with destination coordinates and search query
    return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=${travelMode}&query=${encodedTitle}`;
  }

  // Open Google Maps navigation in a new tab
  openInGoogleMaps(dest, travelMode = 'driving') {
    const url = this.getGoogleMapsDirectionsUrl(dest, travelMode);
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

export const geoService = new GeoService();
