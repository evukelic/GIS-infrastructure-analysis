import { Component, OnInit, ViewChild } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { History } from '../../services/data.model';
import { TABLE_COLUMNS } from './map-table.constants';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-map-table',
  templateUrl: './map-table.component.html',
  styleUrls: ['./map-table.component.scss'],
})
export class MapTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public displayedColumns: string[] = TABLE_COLUMNS;
  public dataSource!: MatTableDataSource<History>;
  public isEmpty: boolean = false;

  public constructor(private dataService: DataServiceService) {}

  public ngOnInit(): void {}

  public initDataSource(): void {
    this.dataService.getHistory().subscribe((data) => {
      if (!data || data.length === 0) {
        this.isEmpty = true;
        return;
      }

      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }
}
