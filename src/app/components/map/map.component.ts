import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Injector,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet/dist/images/marker-shadow.png';
import { DataServiceService } from 'src/app/services/data-service.service';
import { ButtonGroupComponent } from '../button-group/button-group.component';
import { MapPopupComponent } from './map-popup/map-popup.component';
import {
  ATTRIBUTION,
  CABLE_DATA,
  CONNECTOR_DATA,
  DATA_CENTER_LAT,
  DATA_CENTER_LNG,
  LOCATION_MARKER_PATH,
  MAP_CONTAINER,
  MENU_ITEMS,
  OUTLET_DATA,
  ROUTE_DATA,
  TILE_LAYER,
  WELL_DATA,
  ZOOM_LEVEL,
} from './map.constants';
import { MenuItemModel } from './map.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  @ViewChild(ButtonGroupComponent)
  public buttonGroup: any;

  private map!: L.Map;
  private mapLayers: Map<string, any> = new Map();
  private mapData: any[] = [
    ROUTE_DATA,
    CABLE_DATA,
    WELL_DATA,
    OUTLET_DATA,
    CONNECTOR_DATA,
  ];

  private loadedData: Map<string, any[]> = new Map();
  private analyses: any[] = [];

  private isMainWellLoaded: boolean = false;
  public err: boolean = false;

  public constructor(
    private dataService: DataServiceService,
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  public ngAfterViewInit(): void {
    this.buildEmptyMap();
    this.initMapData();
  }

  private buildEmptyMap(): void {
    this.map = new L.Map(MAP_CONTAINER, {
      center: [DATA_CENTER_LAT, DATA_CENTER_LNG],
      zoom: ZOOM_LEVEL,
      preferCanvas: true,
      crs: L.CRS.EPSG3857,
    });

    const tiles = L.tileLayer(TILE_LAYER, {
      maxZoom: 19,
      minZoom: 3,
      attribution: ATTRIBUTION,
    });

    tiles.addTo(this.map);
    this.map.doubleClickZoom.disable();

    this.setMapListeners();
  }

  private initMapData(): void {
    this.getCircleMarkerData(OUTLET_DATA.layerId, false);
    this.getPolylineData(CABLE_DATA.layerId, false);
    this.getCircleMarkerData(WELL_DATA.layerId, false);
    this.getPolylineData(CABLE_DATA.layerId, true);
  }

  public toggleLayerVisibility(id: string): void {
    if (this.mapLayers.has(id)) {
      const layerExists = this.map?.hasLayer(this.mapLayers.get(id));

      if (!layerExists) {
        this.mapLayers.get(id).addTo(this.map);
        return;
      }

      this.map.removeLayer(this.mapLayers.get(id));
    } else {
      this.addProperDataLayer(id);
    }
  }

  public clearLayersVisibility(): void {
    const layers = [
      ROUTE_DATA.layerId,
      CABLE_DATA.layerId,
      WELL_DATA.layerId,
      OUTLET_DATA.layerId,
      CONNECTOR_DATA.layerId,
    ];

    for (const layer of layers) {
      if (this.map.hasLayer(this.mapLayers.get(layer as string))) {
        this.map.removeLayer(this.mapLayers.get(layer as string));
      }
    }

    (this.buttonGroup as ButtonGroupComponent).uncheck();
  }

  public clearAnalysesVisibility(): void {
    for (const analy of this.analyses) {
      if (this.map.hasLayer(analy)) {
        this.map.removeLayer(analy);
      }
    }
  }

  private setMapListeners(): void {
    this.map.on('dblclick', (e) => {
      const latLng = (e as L.LeafletMouseEvent).latlng;
      const marker = this.createMapAnalysisLocationMarker(latLng);
      const buttonSubmit = L.DomUtil.get('button-submit');

      L.DomEvent.addListener(buttonSubmit as HTMLElement, 'click', (error) => {
        marker.remove();
        this.analyze(latLng);
      });
    });
  }

  private createMapAnalysisLocationMarker(latLng: L.LatLng): L.Marker {
    const markerPopup: any = this.compilePopup(MapPopupComponent, (c: any) => {
      c.instance.latLng = latLng;
    });

    const marker = new L.Marker([latLng.lat, latLng.lng]).bindPopup(
      markerPopup
    );

    marker.addTo(this.map);
    marker.fire('click');
    marker.getPopup()?.on('remove', function () {
      marker.remove();
    });

    return marker;
  }

  private getColorForDistance(distance: number) {
    if (distance < 50) {
      return 'green';
    } else if (distance > 100) {
      return 'red';
    } else {
      return '#d4b126';
    }
  }

  private getColorForRouteDistance(distance: number) {
    if (distance < 200) {
      return 'green';
    } else if (distance > 500) {
      return 'red';
    } else {
      return '#d4b126';
    }
  }

  private analyze(latLng: L.LatLng) {
    this.dataService.getClosestOutlet(latLng).subscribe((data) => {
      this.drawWholeRoute(data[0].shortest_path, data[0].cost);
      this.drawClosestOutletRoute(latLng, data);
    });
  }

  public fetchLocationFromInput(e: string) {
    const location = this.dataService.getLocation(e).subscribe((data: any) => {
      if (data === 'e') {
        this.err = true;
        return;
      }

      this.err = false;
      const coordinates = Object.values(data).map((value) => {
        const tempCoordinates = [(value as any).x, (value as any).y];
        return this.dataService.transformToLatLng(tempCoordinates);
      });

      for (const coord of coordinates) {
        this.analyze(coord);
      }
    });
  }

  public analyzeFromCsv(data: any): void {
    const coordinates = data.data.map((value: any) => {
      const tempCoordinates = [value[0], value[1]];
      return this.dataService.transformToLatLng(tempCoordinates);
    });

    for (const coord of coordinates) {
      this.analyze(coord);
    }
  }

  private drawClosestOutletRoute(latLng: L.LatLng, data: any[]): void {
    var locationMarker = new L.Marker([latLng.lat, latLng.lng]).bindPopup(
      `Lokacija ${latLng}`
    );

    const color = this.getColorForDistance(data[0].distance);
    const outlet = this.loadedData
      .get(OUTLET_DATA.layerId)
      ?.find((o) => o.gid === data[0].connector_gid);

    const outletRoute = this.getClosestOutletRouteLayer(outlet, color, latLng);

    const outletMarker = L.circleMarker(outlet.coordinates, {
      color: color,
      radius: 9,
    }).bindPopup(`Najbliži izvod za lokaciju ${latLng}`);

    const outletLayerGroup = L.layerGroup([
      locationMarker,
      outletRoute,
      outletMarker,
    ]).addTo(this.map);

    this.analyses.push(outletLayerGroup);
  }

  private getClosestOutletRouteLayer(outlet: any, color: string, latLng: any) {
    const coordinates = [outlet.coordinates, latLng];

    var firstpolyline = new L.Polyline(coordinates, {
      color: color,
      weight: 4,
      opacity: 1,
      smoothFactor: 1,
      dashArray: '10 10',
    });

    return firstpolyline;
  }

  private drawWholeRoute(shortest_path: number[], cost: number) {
    const cables = shortest_path.map((path) =>
      this.loadedData.get(CABLE_DATA.layerId)?.find((c) => c.gid === path)
    );
    const coordinates = cables.map((cable) => cable.coordinates);
    const color = this.getColorForRouteDistance(cost);

    const layerarr = coordinates.map(
      (coord) => new L.Polyline(coord, this.getRoutePolylineObject(color))
    );
    const routeLayerGroup = L.layerGroup(layerarr);

    this.analyses.push(routeLayerGroup);
    routeLayerGroup.addTo(this.map);
  }

  private getRoutePolylineObject(color: string): any {
    return {
      color: color,
      weight: 12,
      opacity: 0.5,
      smoothFactor: 5,
    };
  }

  private getCircleMarkerData(id: string, showOnMap: boolean): void {
    const endpoint = this.mapEndpointToId(id);

    this.dataService.getCircleMarkerData(endpoint).subscribe((data) => {
      this.loadedData.set(id, data);
      this.addCircleMarkerLayer(id, data, showOnMap);

      if (id === WELL_DATA.layerId && !this.isMainWellLoaded) {
        this.showMainWell();
        this.isMainWellLoaded = true;
      }
    });
  }

  private getPolylineData(id: string, showOnMap: boolean): void {
    const endpoint = this.mapEndpointToId(id);

    this.dataService.getPolylineData(endpoint).subscribe((data) => {
      this.loadedData.set(id, data);
      this.addPolylineLayer(id, data, showOnMap);
    });
  }

  private mapEndpointToId(id: string): string {
    const item = MENU_ITEMS.find((item) => item.id === id);
    return (item as MenuItemModel).name.toLowerCase();
  }

  private addCircleMarkerLayer(
    id: string,
    data: any[],
    showOnMap: boolean
  ): void {
    const props = this.mapData.find((data) => data.layerId === id);

    var layerarr = data.map((point) =>
      L.circleMarker(point.coordinates, {
        color: props.color,
        radius: props.radius,
      })
    );

    this.mapLayers.set(id, L.layerGroup(layerarr));
    if (showOnMap) {
      this.mapLayers.get(id).addTo(this.map);
    }
  }

  public showMainWell(): void {
    const mainWell = this.loadedData
      .get(WELL_DATA.layerId)
      ?.find((w) => w.gid === 172);

    var redMarker = L.icon({
      iconUrl: LOCATION_MARKER_PATH,
      iconSize: [50, 50],
    });

    var wellLocationMarker = L.marker(mainWell.coordinates, {
      icon: redMarker,
    }).addTo(this.map);

    wellLocationMarker.bindPopup('TK centrala');
  }

  private addPolylineLayer(id: string, data: any[], showOnMap: boolean) {
    const props = this.mapData.find((data) => data.layerId === id);
    var layerarr = data.map(
      (lines) =>
        new L.Polyline(lines.coordinates, this.getPolylineObject(props))
    );

    this.mapLayers.set(id, L.layerGroup(layerarr));
    if (showOnMap) {
      this.mapLayers.get(id).addTo(this.map);
    }
  }

  private getPolylineObject(props: any): any {
    return {
      color: props.color,
      weight: props.weight,
      opacity: props.opacity,
      smoothFactor: 1,
    };
  }

  private addProperDataLayer(id: string): void {
    switch (id) {
      case OUTLET_DATA.layerId:
        this.getCircleMarkerData(id, true);
        break;
      case WELL_DATA.layerId:
        this.getCircleMarkerData(id, true);
        break;
      case CONNECTOR_DATA.layerId:
        this.getCircleMarkerData(id, true);
        break;
      case ROUTE_DATA.layerId:
        this.getPolylineData(id, true);
        break;
      case CABLE_DATA.layerId:
        this.getPolylineData(id, true);
        break;
      default:
        break;
    }
  }

  private compilePopup(component: any, onAttach: any): any {
    const compFactory: any = this.resolver.resolveComponentFactory(component);
    let compRef: any = compFactory.create(this.injector);

    if (onAttach) onAttach(compRef);

    this.appRef.attachView(compRef.hostView);
    compRef.onDestroy(() => this.appRef.detachView(compRef.hostView));

    let div = document.createElement('div');
    div.appendChild(compRef.location.nativeElement);
    return div;
  }
}
