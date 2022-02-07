import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-map-popup',
  templateUrl: './map-popup.component.html',
  styleUrls: ['./map-popup.component.scss'],
})
export class MapPopupComponent implements OnInit {
  @Input() latLng: any;

  public onAnalyzeClick(): void {}
  constructor() {}

  ngOnInit(): void {}
}
