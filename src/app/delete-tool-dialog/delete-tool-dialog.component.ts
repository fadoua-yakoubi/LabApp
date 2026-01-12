import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DeleteToolDialogData {
  source: string;
  date: string;
}

@Component({
  selector: 'app-delete-tool-dialog',
  templateUrl: './delete-tool-dialog.component.html',
  styleUrls: ['./delete-tool-dialog.component.css']
})
export class DeleteToolDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteToolDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteToolDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}