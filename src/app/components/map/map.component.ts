import { Component, OnInit } from '@angular/core';
import { Map as MapboxMap } from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import {
  DATA_CENTER_LAT,
  DATA_CENTER_LNG,
  LOAD,
  MAP_CONTAINER,
  MAP_STYLE,
  NONE,
  ROUTE_DATA,
  VISIBILITY,
  VISIBLE,
  ZOOM_LEVEL,
} from './map.constants';
import { LayerType } from './map.enum';
import { CircleLayerData, LineLayerData, SymbolLayerData } from './map.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  private map: MapboxMap | undefined;

  public constructor() {}

  public ngOnInit(): void {
    this.buildEmptyMap();

    this.initMapData(ROUTE_DATA);
  }

  public toggleLayerVisibility([id, data]: [
    string,
    LineLayerData | CircleLayerData | SymbolLayerData
  ]) {
    const mapLayerData = data;
    const layerId = id;
    const layerExists = this.map?.getLayer(layerId);

    if (!layerExists) {
      this.addLayerByLayerType(mapLayerData);
      return;
    }

    const visibility = this.map?.getLayoutProperty(layerId, VISIBILITY);
    const toggledVisibility =
      !visibility || visibility === VISIBLE ? NONE : VISIBLE;

    this.map?.setLayoutProperty(layerId, VISIBILITY, toggledVisibility);
  }

  private buildEmptyMap(): void {
    const mapboxAccessToken = environment.mapbox.accessToken;

    this.map = new MapboxMap({
      container: MAP_CONTAINER,
      style: MAP_STYLE,
      zoom: ZOOM_LEVEL,
      center: [DATA_CENTER_LNG, DATA_CENTER_LAT],
      accessToken: mapboxAccessToken,
    });
  }

  private initMapData(mapLayerData: LineLayerData): void {
    this.map?.once(LOAD, () => {
      this.addMapSourceAndLayer(mapLayerData, true);
    });
  }

  private addMapSymbolLayer(mapLayerData: SymbolLayerData): void {
    this.map?.loadImage(mapLayerData.imagePath as string, (error, image) => {
      if (error) throw error;

      this.map?.addImage(mapLayerData.image as string, image as ImageBitmap);

      this.addMapSource(mapLayerData);

      const layerData = this.getDefaultLayerData(mapLayerData);

      this.map?.addLayer({
        ...layerData,
        layout: {
          'icon-image': mapLayerData.image,
          'icon-size': mapLayerData.imageSize,
        },
      });
    });
  }

  private addMapSourceAndLayer(
    mapLayerData: LineLayerData | CircleLayerData,
    isLayerVisible: boolean
  ) {
    this.addMapSource(mapLayerData);
    this.addMapLayer(mapLayerData, isLayerVisible);
  }

  private addMapSource(
    mapLayerData: LineLayerData | CircleLayerData | SymbolLayerData
  ): void {
    this.map?.addSource(mapLayerData.sourceId, {
      type: mapLayerData.sourceType,
      url: mapLayerData.url,
    });
  }

  private addMapLayer(
    mapLayerData: LineLayerData | CircleLayerData,
    isVisible: boolean
  ): void {
    const layerData = this.getDefaultLayerData(mapLayerData);

    this.map?.addLayer({
      ...layerData,
      paint: this.getPaintData(mapLayerData),
      layout: {
        visibility: isVisible ? VISIBLE : NONE,
      },
    });
  }

  private getDefaultLayerData(
    mapLayerData: LineLayerData | CircleLayerData | SymbolLayerData
  ): any {
    return {
      id: mapLayerData.layerId,
      type: mapLayerData.layerType,
      source: mapLayerData.sourceId,
      'source-layer': mapLayerData.sourceLayer,
    };
  }

  private addLayerByLayerType(
    mapLayerData: LineLayerData | CircleLayerData | SymbolLayerData
  ): void {
    const layerType = mapLayerData.layerType;

    if (layerType === LayerType.Symbol) {
      this.addMapSymbolLayer(mapLayerData as SymbolLayerData);
    } else {
      this.addMapSourceAndLayer(
        mapLayerData as LineLayerData | CircleLayerData,
        true
      );
    }
  }

  private getPaintData(mapLayerData: LineLayerData | CircleLayerData) {
    if (mapLayerData.layerType === LayerType.Line) {
      const data = mapLayerData as LineLayerData;

      return {
        'line-color': data.color,
        'line-width': data.width,
      };
    }

    return {
      'circle-color': mapLayerData.color,
    };
  }
}
