import { CircleLayerData, LineLayerData, MenuItemModel } from './map.model';

export const MAP_CONTAINER: string = 'map';

export const DATA_CENTER_LNG: number = 15.924;
export const DATA_CENTER_LAT: number = 45.7989;

export const ZOOM_LEVEL: number = 17;

export const LOAD: string = 'load';
export const RENDER: string = 'render';

export const LOCATION_MARKER_PATH: string = 'assets/icons/location_marker.png';
export const LOCATION_MARKER: string = 'marker';
export const MARKER_SIZE: number = 0.15;

export const TILE_LAYER: string =
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const ATTRIBUTION: string =
  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

export const ROUTE_DATA: LineLayerData = {
  layerId: 'route',
  color: '#e74c3c',
  weight: 2,
  opacity: 0.6,
};

export const CABLE_DATA: LineLayerData = {
  layerId: 'cable',
  color: '#2981ca',
  weight: 2,
  opacity: 1,
};

export const WELL_DATA: CircleLayerData = {
  layerId: 'well',
  color: '#d7a80a',
  radius: 9,
};

export const OUTLET_DATA: CircleLayerData = {
  layerId: 'outlet',
  color: '#0a4772',
  radius: 5,
};

export const CONNECTOR_DATA: CircleLayerData = {
  layerId: 'connector',
  color: '#2f6b2f',
  radius: 7,
};

export const MENU_ITEMS: MenuItemModel[] = [
  {
    id: 'route',
    name: 'Trasa',
    checked: false,
  },
  {
    id: 'cable',
    name: 'Kabel',
    checked: true,
  },
  {
    id: 'well',
    name: 'Zdenac',
    checked: false,
  },
  {
    id: 'outlet',
    name: 'Izvod',
    checked: false,
  },
  {
    id: 'connector',
    name: 'Spojnica',
    checked: false,
  },
];
