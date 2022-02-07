import { Component, ViewChild } from '@angular/core';
import { MapTableComponent } from './components/map-table/map-table.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild(MapTableComponent)
  public mapTable!: MapTableComponent;

  title = 'gis';

  public onTabClick(e: any): void {
    if (e.index === 1) {
      (this.mapTable as MapTableComponent).initDataSource();
    }
  }
}
