import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/Services/auth.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class TemplateComponent implements OnInit {
  currentRoute = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupRouterEvents();
  }

  private setupRouterEvents(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  getPageTitle(): string {
    return 'LabManager';
  }

  getPageSubtitle(): string {
    const currentUrl = this.router.url;
    
    if (currentUrl.includes('/events')) {
      return 'Gestion des Événements';
    } else if (currentUrl.includes('/members')) {
      return 'Gestion des Membres';
    } else if (currentUrl.includes('/tools')) {
      return 'Gestion des Outils';
    } else if (currentUrl.includes('/publications')) {
      return 'Gestion des Publications';
    } else if (currentUrl.includes('/dashboard')) {
      return 'Tableau de bord';
    }
    
    return '';
  }

  logout(): void {
    this.authService.signOut().then(() => {
      this.router.navigate(['/login']);
    }).catch(error => {
      console.error('Erreur de déconnexion:', error);
    });
  }
}