import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-csv-upload-dialog',
  templateUrl: './csv-upload-dialog.component.html',
  styleUrls: ['./csv-upload-dialog.component.scss'],
})
export class CsvUploadDialogComponent implements OnInit {
  public csvFile: any;
  public isError: boolean = false;

  public constructor(
    private dialogRef: MatDialogRef<CsvUploadDialogComponent>
  ) {}

  public ngOnInit(): void {}

  public onCSVUploadClick(e: any) {
    if (this.isError || !this.csvFile) {
      return;
    }

    const csvRecordsArray = this.csvFile.split(/(?:\r\n|\n)+/);
    const coordinates = [];
    for (const record of csvRecordsArray) {
      const row = record.split(',');
      if (row.length == 2) {
        coordinates.push([row[0].trim(), row[1].trim()]);
      }
    }

    this.dialogRef.close({ data: coordinates });
  }

  public uploadListener($event: any): void {
    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {
      this.isError = false;

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = (e) => {
        this.csvFile = reader.result;
      };
    } else {
      this.isError = true;
    }
  }

  public isValidCSVFile(file: any): boolean {
    return file.name.endsWith('.csv');
  }
}
