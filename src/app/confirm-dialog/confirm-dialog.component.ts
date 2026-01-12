import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formatDate } from '@angular/common';

export interface DialogData {
  elements: any[];
  message?: string;
  title?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  elements: any[] = [];
  title: string = 'Supprimer tous les éléments ?';
  message: string = 'Cette action supprimera définitivement tous les éléments sélectionnés. Cette action est irréversible.';

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (data) {
      this.elements = data.elements || [];
      this.title = data.title || this.title;
      this.message = data.message || this.message;
    }
  }

  // Compter les éléments par type
  countByType(type: string): number {
    return this.elements.filter(element => element.type === type).length;
  }

  // Formater la date
  getFormattedDate(element: any): string {
    const date = element.dateInscription || element.date;
    if (!date) return 'N/D';
    
    if (typeof date === 'string') {
      return formatDate(date, 'dd/MM/yyyy', 'fr-FR');
    } else if (date instanceof Date) {
      return formatDate(date, 'dd/MM/yyyy', 'fr-FR');
    }
    
    return 'Date invalide';
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onDelete(): void {
    this.dialogRef.close(true);
  }
}