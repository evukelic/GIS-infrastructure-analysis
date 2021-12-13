import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { CsvUploadDialogComponent } from '../csv-upload-dialog/csv-upload-dialog.component';
import { ADDRESS_DATA, MENU_ITEMS } from '../map/map.constants';
import { MenuItemModel } from '../map/map.model';

@Component({
  selector: 'app-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
})
export class ButtonGroupComponent implements OnInit {
  @ViewChild(MatMenuTrigger, { static: true, read: ElementRef })
  public userMenu: ElementRef<HTMLElement> | undefined;

  @Output() public layerVisibilityChanged: EventEmitter<any> =
    new EventEmitter();

  public get userMenuData() {
    return {
      menuWidth: this.userMenu?.nativeElement.clientWidth,
    };
  }

  public menuItems: MenuItemModel[] = MENU_ITEMS;

  public constructor(private dialog: MatDialog) {}

  public ngOnInit(): void {}

  public onMenuItemClick(item: MenuItemModel): void {
    this.layerVisibilityChanged.emit([item.id, item.data]);
  }

  public onAddressButtonClick(): void {
    this.layerVisibilityChanged.emit([ADDRESS_DATA.layerId, ADDRESS_DATA]);
  }

  public onCSVUploadClick(): void {
    this.dialog.open(CsvUploadDialogComponent, {
      width: '30%',
    });
  }
}
