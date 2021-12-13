import { Visibility } from 'mapbox-gl';
import { LayerType } from './map.enum';
import {
  CircleLayerData,
  LineLayerData,
  MenuItemModel,
  SymbolLayerData,
} from './map.model';

export const MAP_CONTAINER: string = 'map';

export const MAP_STYLE: string = 'mapbox://styles/mapbox/streets-v11';

export const DATA_CENTER_LNG: number = 15.924;
export const DATA_CENTER_LAT: number = 45.7989;

export const ZOOM_LEVEL: number = 15.5;

export const LOAD: string = 'load';
export const RENDER: string = 'render';

export const VISIBILITY: string = 'visibility';
export const VISIBLE: Visibility = 'visible';
export const NONE: Visibility = 'none';

export const LOCATION_MARKER_PATH: string =
  '../../../assets/icons/location_marker.png';
export const LOCATION_MARKER: string = 'marker';
export const MARKER_SIZE: number = 0.15;

export const ROUTE_DATA: LineLayerData = {
  sourceId: 'route',
  url: 'mapbox://evukelic.06ug29qu',
  sourceType: 'vector',
  layerId: 'route-data',
  sourceLayer: 'trasa-98kftq',
  layerType: LayerType.Line,
  color: '#0a4772',
  width: 4,
};

export const CABLE_DATA: LineLayerData = {
  sourceId: 'cable',
  url: 'mapbox://evukelic.c1djgvi6',
  sourceType: 'vector',
  layerId: 'cable-data',
  sourceLayer: 'kabel-3gv51r',
  layerType: LayerType.Line,
  color: '#82a9c5',
  width: 2,
};

export const WELL_DATA: CircleLayerData = {
  sourceId: 'well',
  url: 'mapbox://evukelic.bogbqcq7',
  sourceType: 'vector',
  layerId: 'well-data',
  sourceLayer: 'zdenac-2k9clm',
  layerType: LayerType.Circle,
  color: '#d7a80a',
};

export const OUTLET_DATA: CircleLayerData = {
  sourceId: 'outlet',
  url: 'mapbox://evukelic.5pe2m987',
  sourceType: 'vector',
  layerId: 'outlet-data',
  sourceLayer: 'izvod-by9nix',
  layerType: LayerType.Circle,
  color: '#bc0000',
};

export const CONNECTOR_DATA: CircleLayerData = {
  sourceId: 'connector',
  url: 'mapbox://evukelic.4fo2biuy',
  sourceType: 'vector',
  layerId: 'connector-data',
  sourceLayer: 'spojnica_2-63jzs8',
  layerType: LayerType.Circle,
  color: '#2f6b2f',
};

export const ADDRESS_DATA: SymbolLayerData = {
  sourceId: 'address',
  url: 'mapbox://evukelic.3dyhadfo',
  sourceType: 'vector',
  layerId: 'address-data',
  sourceLayer: 'adrese-cf9twf',
  layerType: LayerType.Symbol,
  imagePath: LOCATION_MARKER_PATH,
  image: LOCATION_MARKER,
  imageSize: MARKER_SIZE,
};

export const MENU_ITEMS: MenuItemModel[] = [
  {
    id: 'route-data',
    name: 'Trasa',
    data: ROUTE_DATA,
  },
  {
    id: 'cable-data',
    name: 'Kabel',
    data: CABLE_DATA,
  },
  {
    id: 'well-data',
    name: 'Zdenac',
    data: WELL_DATA,
  },
  {
    id: 'outlet-data',
    name: 'Izvod',
    data: OUTLET_DATA,
  },
  {
    id: 'connector-data',
    name: 'Spojnica',
    data: CONNECTOR_DATA,
  },
];
