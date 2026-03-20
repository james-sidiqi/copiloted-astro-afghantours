export interface RouteMatrixRow {
    route_id: string;
    from_code: string;
    to_code: string;
    distance_km: number;
    drive_hours_low: number;
    drive_hours_high: number;
    road_class: string;
    bus_allowed: boolean;
    armored_allowed: boolean;
    armored_months: string;
    notes: string;
}