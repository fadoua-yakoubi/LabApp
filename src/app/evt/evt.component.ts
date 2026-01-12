import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Evt } from 'src/Models/Evt';
import { EvtService } from 'src/Services/evt.service';
import { ModalEvtComponent } from '../modal-evt/modal-evt.component';
import { DeleteEvtDialogComponent } from '../delete-evt-dialog/delete-evt-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-evt',
  templateUrl: './evt.component.html',
  styleUrls: ['./evt.component.css']
})
export class EvtComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<Evt>([]);
  displayedColumns: string[] = ['id', 'titre', 'date', 'lieu', 'actions'];
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ES: EvtService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('🔄 ngOnInit appelé');
    this.loadEvents();
  }

  ngAfterViewInit() {
    console.log('🔄 ngAfterViewInit appelé');
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    if (this.dataSource.data.length > 0) {
      this.dataSource.paginator = this.paginator;
      this.cdr.detectChanges();
    }
  }

  loadEvents() {
    console.log('🔄 loadEvents appelé');
    this.isLoading = true;
    this.ES.GetAllEvts().subscribe({
      next: (data) => {
        console.log('✅ Événements chargés:', data);
        console.log('✅ Nombre d\'événements:', data.length);
        this.dataSource.data = data;
        
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log('✅ Paginator reconnecté');
        });
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("❌ Erreur lors du chargement des événements:", err);
        this.showMessage("Erreur lors du chargement des événements");
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  open() {
    console.log('🔄 open() appelé');
    const dialogRef = this.dialog.open(ModalEvtComponent, {
      width: '600px',
      disableClose: true,
      data: null
    });

    dialogRef.afterClosed().subscribe((evtRecupere: Evt) => {
      console.log('✅ Dialog fermé avec données:', evtRecupere);
      
      if (evtRecupere) {
        console.log('📝 Événement à créer:', evtRecupere);
        
        // Supprimer l'id s'il existe
        if (evtRecupere.id) {
          delete evtRecupere.id;
        }
        
        console.log('📤 Envoi au backend...');
        this.ES.saveEvent(evtRecupere).subscribe({
          next: (response) => {
            console.log('✅ Événement créé avec réponse:', response);
            console.log('✅ ID de l\'événement créé:', response?.id);
            this.showMessage("Événement créé avec succès");
            
            // Forcer le rafraîchissement avec un délai
            setTimeout(() => {
              console.log('🔄 Appel de loadEvents après 500ms');
              this.loadEvents();
            }, 500);
          },
          error: (err) => {
            console.error("❌ Erreur lors de la sauvegarde:", err);
            console.error("❌ Status:", err.status);
            console.error("❌ Message:", err.message);
            console.error("❌ Error object:", err.error);
            this.showMessage("Erreur lors de la création de l'événement");
          }
        });
      } else {
        console.log('❌ Dialog fermé sans données');
      }
    });
  }

  // Méthode alternative qui ajoute directement l'événement sans recharger toute la liste
  private addEventLocally(newEvent: Evt) {
    console.log('🔄 addEventLocally appelé avec:', newEvent);
    const currentData = this.dataSource.data;
    const updatedData = [...currentData, newEvent];
    this.dataSource.data = updatedData;
    
    console.log('✅ Données mises à jour:', this.dataSource.data.length, 'événements');
    
    // Reconnecter le paginator avec les nouvelles données
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.lastPage();
        console.log('✅ Aller à la dernière page');
      }
      this.cdr.detectChanges();
    });
  }

  openEdit(id: number) {
    const eventToEdit = this.dataSource.data.find(event => event.id === id);
    
    if (!eventToEdit) {
      this.showMessage("Événement non trouvé");
      return;
    }

    const dialogRef = this.dialog.open(ModalEvtComponent, {
      width: '600px',
      disableClose: true,
      data: { ...eventToEdit }
    });

    dialogRef.afterClosed().subscribe((resForm: Evt) => {
      if (resForm) {
        this.ES.updateEvenement(id.toString(), resForm).subscribe({
          next: (response) => {
            console.log('✅ Événement modifié:', response);
            this.showMessage("Événement modifié avec succès");
            this.loadEvents();
          },
          error: (err) => {
            console.error("❌ Erreur lors de la modification:", err);
            this.showMessage("Erreur lors de la modification");
          }
        });
      }
    });
  }

  delete(id: number) {
    const eventToDelete = this.dataSource.data.find(event => event.id === id);
    
    if (!eventToDelete) {
      this.showMessage("Événement non trouvé");
      return;
    }

    let formattedDate = eventToDelete.date;
    try {
      if (eventToDelete.date) {
        const [year, month, day] = eventToDelete.date.split('-');
        formattedDate = `${day}/${month}/${year}`;
      }
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
    }

    const dialogRef = this.dialog.open(DeleteEvtDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        titre: eventToDelete.titre,
        date: formattedDate,
        lieu: eventToDelete.lieu
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.ES.deleteEvenement(id.toString()).subscribe({
          next: () => {
            console.log('✅ Événement supprimé');
            this.showMessage("Événement supprimé avec succès");
            this.loadEvents();
          },
          error: (err) => {
            console.error("❌ Erreur lors de la suppression:", err);
            this.showMessage("Erreur lors de la suppression");
          }
        });
      }
    });
  }

  private showMessage(message: string) {
    console.log('💬 Message:', message);
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}