import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { CsvUploadDialogComponent } from '../csv-upload-dialog/csv-upload-dialog.component';
import { MENU_ITEMS } from '../map/map.constants';
import { MenuItemModel } from '../map/map.model';

@Component({
  selector: 'app-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
})
export class ButtonGroupComponent implements OnInit {
  @ViewChild(MatMenuTrigger, { static: true, read: ElementRef })
  public userMenu: ElementRef<HTMLElement> | undefined;

  @Input() public isError: boolean = false;

  @Output() public layerVisibilityChanged: EventEmitter<any> =
    new EventEmitter();
  @Output() public layersHidden: EventEmitter<any> = new EventEmitter();
  @Output() public analysesHidden: EventEmitter<any> = new EventEmitter();
  @Output() public findLocation: EventEmitter<any> = new EventEmitter();
  @Output() public loadCsv: EventEmitter<any> = new EventEmitter();

  public inputValue: string = '';

  public get userMenuData() {
    return {
      menuWidth: this.userMenu?.nativeElement.clientWidth,
    };
  }

  public menuItems: MenuItemModel[] = MENU_ITEMS;

  public constructor(private dialog: MatDialog) {}

  public ngOnInit(): void {}

  public onMenuItemClick(item: MenuItemModel): void {
    this.layerVisibilityChanged.emit(item.id);
    item.checked = !item.checked;
  }

  public onCSVUploadClick(): void {
    const dialogRef = this.dialog.open(CsvUploadDialogComponent, {
      width: '30%',
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data === '') {
        return;
      }
      this.loadCsv.emit(data);
    });
  }

  public onClearLayersClick(): void {
    this.layersHidden.emit();
  }

  public onClearAnalysesClick(): void {
    this.analysesHidden.emit();
  }

  public searchForLocation(): void {
    this.findLocation.emit(this.inputValue);
  }

  public uncheck(): void {
    for (const item of this.menuItems) {
      item.checked = false;
    }
  }
}
