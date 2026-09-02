package com.scap.analytics.util;

public final class GpsTriangulationUtil {

    private static final double EARTH_RADIUS_METERS = 6371000;

    private GpsTriangulationUtil() {}

    /**
     * Calculates geodesic distance in meters between two GPS coordinates using the Haversine formula
     */
    public static double calculateHaversineDistanceMeters(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double rLat1 = Math.toRadians(lat1);
        double rLat2 = Math.toRadians(lat2);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_METERS * c;
    }

    /**
     * Checks if two coordinate pairs fall within a tactical radius
     */
    public static boolean isWithinRadius(double lat1, double lon1, double lat2, double lon2, double radiusMeters) {
        return calculateHaversineDistanceMeters(lat1, lon1, lat2, lon2) <= radiusMeters;
    }
}
