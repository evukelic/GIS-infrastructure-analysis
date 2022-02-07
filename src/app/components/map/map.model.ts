export interface MapLayerData {
  readonly layerId: string;
  readonly layerType?: any;
  readonly color: string;
}

export interface CircleLayerData extends MapLayerData {
  readonly radius: number;
}

export interface LineLayerData extends MapLayerData {
  readonly color: string;
  readonly weight: number;
  readonly opacity: number;
}

export interface MenuItemModel {
  readonly id: string;
  readonly name: string;
  checked: boolean;
}
