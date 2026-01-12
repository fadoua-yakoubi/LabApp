import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { Evt } from 'src/Models/Evt';

@Component({
  selector: 'app-modal-evt',
  templateUrl: './modal-evt.component.html',
  styleUrls: ['./modal-evt.component.css']
})
export class ModalEvtComponent implements OnInit {
  form!: FormGroup;
  
  constructor(
    public dialogRef: MatDialogRef<ModalEvtComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Evt | null // Accepter null pour création
  ) {}

  ngOnInit() {
    // Initialiser la valeur de date
    let dateValue: Date | null = null;
    
    if (this.data?.date) {
      // Convertir la date string "yyyy-MM-dd" en objet Date
      try {
        // Supprimer le fuseau horaire si présent
        const dateString = this.data.date.split('T')[0];
        const [year, month, day] = dateString.split('-').map(Number);
        dateValue = new Date(year, month - 1, day);
      } catch (error) {
        console.error('Erreur de conversion de date:', error);
      }
    }
    
    this.form = new FormGroup({
      titre: new FormControl(this.data?.titre || '', [Validators.required]),
      date: new FormControl(dateValue, [Validators.required]),
      lieu: new FormControl(this.data?.lieu || '', [Validators.required])
    });
  }

  save() {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      // Formater la date au format backend (yyyy-MM-dd)
      const formattedDate = formatDate(formValue.date, 'yyyy-MM-dd', 'en-US');
      
      const eventData: Evt = {
        id: this.data?.id,
        titre: formValue.titre,
        date: formattedDate,
        lieu: formValue.lieu
      };
      
      this.dialogRef.close(eventData);
    }
    
  }

  close() {
    this.dialogRef.close();
  }
}