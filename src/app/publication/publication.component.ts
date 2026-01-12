import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Publication } from 'src/Models/Publication';
import { PublicationService } from 'src/Services/publication.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalPublicationComponent } from '../modal-publication/modal-publication.component';
import { DeletePublicationDialogComponent } from '../delete-publication-dialog/delete-publication-dialog.component';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css']
})
export class PublicationComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<Publication>([]);
  displayedColumns: string[] = ['id','titre', 'auteurs', 'dateApparition', 'source', 'actions'];
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private publicationService: PublicationService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('🔄 ngOnInit - Chargement des publications');
    this.loadPublications();
  }

  ngAfterViewInit(): void {
    console.log('🔄 ngAfterViewInit - Configuration du paginator et sort');
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    if (this.dataSource.data.length > 0) {
      this.cdr.detectChanges();
    }
  }

  loadPublications(): void {
    console.log('📥 Chargement des publications...');
    this.isLoading = true;
    
    this.publicationService.getAllPublications().subscribe({
      next: (data) => {
        console.log(`✅ ${data.length} publications chargées`);
        this.dataSource.data = data;
        
        setTimeout(() => {
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            console.log('✅ Paginator et sort reconnectés');
          }
        });
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Erreur chargement publications:', error);
        this.showMessage('Erreur lors du chargement des publications');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    
    console.log(`🔍 Filtre appliqué: "${filterValue}" - ${this.dataSource.filteredData.length} résultats`);
  }

  openCreateModal(): void {
    console.log('➕ Ouverture modal de création');
    const dialogRef = this.dialog.open(ModalPublicationComponent, {
      width: '700px',
      disableClose: true,
      data: null
    });

    dialogRef.afterClosed().subscribe((result: Publication) => {
      if (result) {
        console.log('📝 Données reçues du modal:', result);
        
        if (result.id) {
          delete result.id;
        }
        
        this.publicationService.savePublication(result).subscribe({
          next: (response) => {
            console.log('✅ Publication créée:', response);
            this.showMessage('Publication créée avec succès');
            setTimeout(() => this.loadPublications(), 500);
          },
          error: (error) => {
            console.error('❌ Erreur création:', error);
            this.showMessage('Erreur lors de la création');
          }
        });
      } else {
        console.log('❌ Modal fermé sans données');
      }
    });
  }

  openEditModal(publication: Publication): void {
    console.log('✏️ Ouverture modal de modification pour:', publication.titre);
    
    const publicationToEdit = this.dataSource.data.find(pub => pub.id === publication.id);
    
    if (!publicationToEdit) {
      this.showMessage('Publication non trouvée');
      return;
    }

    const dialogRef = this.dialog.open(ModalPublicationComponent, {
      width: '700px',
      disableClose: true,
      data: { ...publicationToEdit }
    });

    dialogRef.afterClosed().subscribe((result: Publication) => {
      if (result) {
        console.log('📝 Modification de la publication:', result);
        
        this.publicationService.updatePublication(publication.id!, result).subscribe({
          next: (response) => {
            console.log('✅ Publication modifiée:', response);
            this.showMessage('Publication mise à jour avec succès');
            this.loadPublications();
          },
          error: (error) => {
            console.error('❌ Erreur mise à jour:', error);
            this.showMessage('Erreur lors de la mise à jour');
          }
        });
      }
    });
  }

  deletePublication(id: number): void {
    const publicationToDelete = this.dataSource.data.find(pub => pub.id === id);
    
    if (!publicationToDelete) {
      this.showMessage('Publication non trouvée');
      return;
    }

    // Formatage de la date
    let formattedDate = publicationToDelete.dateApparition;
    try {
      if (publicationToDelete.dateApparition) {
        const dateObj = new Date(publicationToDelete.dateApparition);
        formattedDate = dateObj.toLocaleDateString('fr-FR');
      }
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
    }

    // Ouvrir le dialogue de confirmation
    const dialogRef = this.dialog.open(DeletePublicationDialogComponent, {
      width: '550px',
      disableClose: true,
      data: {
        titre: publicationToDelete.titre,
        auteurs: publicationToDelete.auteurs,
        dateApparition: formattedDate,
        type: publicationToDelete.type
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        console.log('🗑️ Suppression de la publication:', id);
        
        this.publicationService.deletePublication(id).subscribe({
          next: () => {
            console.log('✅ Publication supprimée avec succès');
            this.showMessage('Publication supprimée avec succès');
            this.loadPublications();
          },
          error: (error) => {
            console.error('❌ Erreur suppression:', error);
            this.showMessage('Erreur lors de la suppression');
          }
        });
      }
    });
  }

  private showMessage(message: string): void {
    console.log('💬 Notification:', message);
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}