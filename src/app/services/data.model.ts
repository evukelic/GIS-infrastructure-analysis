export interface OutletResponse {
  readonly gid: string;
  readonly coordinates: L.LatLng;
}

export interface ConnectorResponse {
  readonly gid: string;
  readonly coordinates: L.LatLng;
}

export interface WellResponse {
  readonly gid: string;
  readonly coordinates: L.LatLng;
}

export interface RouteResponse {
  readonly gid: string;
  readonly coordinates: L.LatLng[];
}

export interface CableResponse {
  readonly gid: string;
  readonly length: number;
  readonly coordinates: L.LatLng[];
}

export interface ClosestOutletResponse {
  readonly outletData: OutletData[];
}

export interface OutletData {
  readonly connector_gid: number;
  readonly distance: number;
  readonly cost: number;
  readonly shortest_path: number[];
}

export interface Location {
  readonly input: string;
  readonly coordinates: L.LatLng;
}

export interface History {
  readonly date: string;
  readonly coordinates: string;
  readonly outlet: string;
  readonly distance: string;
  readonly shortestPath: number[];
  readonly cost: number;
}
