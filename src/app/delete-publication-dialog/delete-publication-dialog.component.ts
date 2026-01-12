import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DeletePublicationDialogData {
  titre: string;
  auteurs: string;
  dateApparition: string;
  type: string;
}

@Component({
  selector: 'app-delete-publication-dialog',
  templateUrl: './delete-publication-dialog.component.html',
  styleUrls: ['./delete-publication-dialog.component.css']
})
export class DeletePublicationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeletePublicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeletePublicationDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}