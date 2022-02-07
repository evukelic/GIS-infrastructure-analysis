import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  CableResponse,
  ConnectorResponse,
  OutletData,
  OutletResponse,
  RouteResponse,
  WellResponse,
  History,
} from './data.model';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  private mapApi: string = '';

  constructor(private http: HttpClient) {
    this.mapApi = 'http://161.53.66.98:4321';
  }

  public getCircleMarkerData(
    endpoint: string
  ): Observable<OutletResponse[] | ConnectorResponse[] | WellResponse[]> {
    return this.http.get<any>(`${this.mapApi}/${endpoint}`).pipe(
      map(
        (
          result: any[]
        ): OutletResponse[] | ConnectorResponse[] | WellResponse[] => {
          result.shift();
          return result.map((response) => {
            const params = {
              gid: response[0],
              coordinates: this.transformCoordinates(
                response[response.length - 1]
              ),
            } as OutletResponse | ConnectorResponse | WellResponse;

            return params;
          });
        }
      )
    );
  }

  public getPolylineData(
    endpoint: string
  ): Observable<RouteResponse[] | CableResponse[]> {
    return this.http.get<any>(`${this.mapApi}/${endpoint}`).pipe(
      map((result: any[]): RouteResponse[] | CableResponse[] => {
        result.shift();
        return result.map((response) => {
          const splittingChars = this.getLineChars(endpoint);
          const params = {
            gid: response[0],
            length: endpoint === 'kabel' ? response[1] : null,
            coordinates: this.transformLineCoordinates(
              splittingChars,
              response[response.length - 1]
            ),
          } as RouteResponse | CableResponse;

          return params;
        });
      })
    );
  }

  public getClosestOutlet(latLng: any): Observable<OutletData[]> {
    const body = L.Projection.SphericalMercator.project(latLng);
    const bodyParams = [body.x, body.y];

    return this.http.post<any>(`${this.mapApi}/analiziraj`, {
      nodes: [bodyParams],
    });
  }

  public getLocation(input: string): any {
    const body = input.split(/,\s*/);
    return this.http
      .post<any>(`${this.mapApi}/georeferenciraj`, {
        addresses: [...body],
      })
      .pipe(
        catchError((err) => {
          return 'e';
        })
      );
  }

  public getHistory(): Observable<History[]> {
    return this.http.get<any>(`${this.mapApi}/povijest`).pipe(
      map((result: any[]): History[] => {
        result.shift();
        return result.map((response) => {
          const params = {
            date: this.parseDate(response[1]),
            coordinates: this.parseCoordinates(response[2]),
            outlet: response[3],
            distance: this.roundDistance(response[4]),
            shortestPath: response[5],
            cost: response[6],
          } as History;

          return params;
        });
      })
    );
  }

  private parseDate(date: string): string {
    const withoutZone = date.split(' GMT');
    return withoutZone[0];
  }

  private parseCoordinates(point: string) {
    const coordinates = this.splitCoordinates(point, '(', ')', ' ');

    return `${coordinates[0]},\n\n${coordinates[1]}`;
  }

  private roundDistance(distance: string): string {
    const num: number = +distance;
    return num.toFixed(4);
  }

  private transformCoordinates(coordinates: string): L.LatLng {
    const parsedCoordinates: string[] = this.splitCoordinates(
      coordinates,
      '(',
      ')',
      ' '
    );

    return this.transformToLatLng(parsedCoordinates);
  }

  private transformLineCoordinates(
    chars: string[],
    coordinates: string
  ): L.LatLng[] {
    const parsedCoordinates: string[] = this.splitCoordinates(
      coordinates,
      chars[0],
      chars[1],
      chars[2]
    );
    const latlngArr = [];

    for (const p of parsedCoordinates) {
      const splitted = p.split(' ');
      latlngArr.push(this.transformToLatLng(splitted));
    }

    return latlngArr;
  }

  private splitCoordinates(
    coordinates: string,
    char1: string,
    char2: string,
    char3: string
  ) {
    return coordinates.split(char1)[1].split(char2)[0].split(char3);
  }

  public transformToLatLng(parsedCoordinates: string[]): L.LatLng {
    var coords = new L.Point(+parsedCoordinates[0], +parsedCoordinates[1]);
    var coords4326 = L.Projection.SphericalMercator.unproject(coords);

    return L.latLng(coords4326);
  }

  private getLineChars(endpoint: string): string[] {
    if (endpoint === 'trasa') {
      return ['((', '))', ','];
    }

    return ['(', ')', ','];
  }
}
