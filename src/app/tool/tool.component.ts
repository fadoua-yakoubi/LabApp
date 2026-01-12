import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Tool } from 'src/Models/Tool';
import { ToolService } from 'src/Services/tool.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalToolComponent } from '../modal-tool/modal-tool.component';
import { DeleteToolDialogComponent } from '../delete-tool-dialog/delete-tool-dialog.component';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.css']
})
export class ToolComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<Tool>([]);
  displayedColumns: string[] = ['id', 'source', 'date', 'actions'];
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private toolService: ToolService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('🔄 ngOnInit appelé');
    this.loadTools();
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

  loadTools() {
    console.log('🔄 loadTools appelé');
    this.isLoading = true;
    this.toolService.getAllOutils().subscribe({
      next: (response: any) => {
        console.log('✅ Réponse brute:', response);
        
        // Extraire les données de _embedded.outils (format Spring Data REST HAL)
        const data = response._embedded?.outils || [];
        
        console.log('✅ Outils extraits:', data);
        console.log('✅ Nombre d\'outils:', data.length);
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
        console.error("❌ Erreur lors du chargement des outils:", err);
        this.showMessage("Erreur lors du chargement des outils");
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
    
    const dialogRef = this.dialog.open(ModalToolComponent, {
      width: '600px',
      disableClose: true,
      data: null
    });

    dialogRef.afterClosed().subscribe((toolRecupere: Tool) => {
      console.log('✅ Dialog fermé avec données:', toolRecupere);
      
      if (toolRecupere) {
        console.log('📝 Outil à créer:', toolRecupere);
        
        if (toolRecupere.id) {
          delete toolRecupere.id;
        }
        
        console.log('📤 Envoi au backend...');
        this.toolService.saveOutil(toolRecupere).subscribe({
          next: (response) => {
            console.log('✅ Outil créé avec réponse:', response);
            this.showMessage("Outil créé avec succès");
            
            setTimeout(() => {
              console.log('🔄 Appel de loadTools après 500ms');
              this.loadTools();
            }, 500);
          },
          error: (err) => {
            console.error("❌ Erreur lors de la sauvegarde:", err);
            this.showMessage("Erreur lors de la création de l'outil");
          }
        });
      } else {
        console.log('❌ Dialog fermé sans données');
      }
    });
  }

  openEdit(id: number) {
    const toolToEdit = this.dataSource.data.find(tool => tool.id === id);
    
    if (!toolToEdit) {
      this.showMessage("Outil non trouvé");
      return;
    }

    const dialogRef = this.dialog.open(ModalToolComponent, {
      width: '600px',
      disableClose: true,
      data: { ...toolToEdit }
    });

    dialogRef.afterClosed().subscribe((resForm: Tool) => {
      if (resForm) {
        this.toolService.updateOutil(id, resForm).subscribe({
          next: (response) => {
            console.log('✅ Outil modifié:', response);
            this.showMessage("Outil modifié avec succès");
            this.loadTools();
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
    const toolToDelete = this.dataSource.data.find(tool => tool.id === id);
    
    if (!toolToDelete) {
      this.showMessage("Outil non trouvé");
      return;
    }

    // Formatage de la date
    let formattedDate = toolToDelete.date;
    try {
      if (toolToDelete.date) {
        const dateObj = new Date(toolToDelete.date);
        formattedDate = dateObj.toLocaleDateString('fr-FR');
      }
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
    }

    // Ouvrir le dialogue de confirmation
    const dialogRef = this.dialog.open(DeleteToolDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        source: toolToDelete.source,
        date: formattedDate
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.toolService.deleteOutil(id).subscribe({
          next: () => {
            console.log('✅ Outil supprimé');
            this.showMessage("Outil supprimé avec succès");
            this.loadTools();
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