export interface MapLayerData {
  readonly sourceId: string;
  readonly url: string;
  readonly sourceType: any;
  readonly layerId: string;
  readonly sourceLayer: string;
  readonly layerType: any;
}

export interface CircleLayerData extends MapLayerData {
  readonly color: string;
}

export interface LineLayerData extends MapLayerData {
  readonly color: string;
  readonly width: number;
}

export interface SymbolLayerData extends MapLayerData {
  readonly imagePath: string;
  readonly image: string;
  readonly imageSize: number;
}

export interface MenuItemModel {
  readonly id: string;
  readonly name: string;
  readonly data: CircleLayerData | LineLayerData | SymbolLayerData;
}
