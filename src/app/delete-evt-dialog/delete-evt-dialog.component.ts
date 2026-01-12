import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-evt-dialog',
  templateUrl: './delete-evt-dialog.component.html',
  styleUrls: ['./delete-evt-dialog.component.css']
})
export class DeleteEvtDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteEvtDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      titre: string;
      date: string;
      lieu: string;
    }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); // true = confirmation
  }

  onCancel(): void {
    this.dialogRef.close(false); // false = annulation
  }
}