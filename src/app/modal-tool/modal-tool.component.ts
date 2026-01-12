import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tool } from 'src/Models/Tool';

@Component({
  selector: 'app-modal-tool',
  templateUrl: './modal-tool.component.html',
  styleUrls: ['./modal-tool.component.css']
})
export class ModalToolComponent implements OnInit {
  toolForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalToolComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Tool | null
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data;
    this.initForm();
  }

  initForm(): void {
    this.toolForm = this.fb.group({
      source: [this.data?.source || '', [Validators.required]],
      date: [this.data?.date ? new Date(this.data.date) : null, [Validators.required]]
    });
  }

  save(): void {
    if (this.toolForm.valid) {
      const formValue = this.toolForm.value;
      
      // Convertir la date en format YYYY-MM-DD pour le backend
      const dateValue = formValue.date;
      const formattedDate = dateValue instanceof Date 
        ? dateValue.toISOString().split('T')[0] 
        : dateValue;

      const tool: Tool = {
        id: this.data?.id,
        source: formValue.source,
        date: formattedDate,
        titre: ''
      };

      console.log('📤 Outil à envoyer:', tool);
      this.dialogRef.close(tool);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}