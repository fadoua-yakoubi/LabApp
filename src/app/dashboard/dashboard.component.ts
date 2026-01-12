import { Component, OnInit } from '@angular/core';
import { EvtService } from 'src/Services/evt.service';
import { MemberService } from 'src/Services/member.service';
import { PublicationService } from 'src/Services/publication.service';
import { ToolService } from 'src/Services/tool.service';
import { ChartConfiguration, ChartData } from 'chart.js';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Statistiques
  Nb_Membres: number = 0;
  Nb_Evenements: number = 0;
  Nb_Outils: number = 0;
  Nb_Publications: number = 0;

  // États de chargement
  isLoadingEvents = true;
  isLoadingPublications = true;

  // Données pour les listes
  upcomingEvents: any[] = [];
  recentPublications: any[] = [];

  // Configuration des graphiques
  eventsChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  publicationsChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: []
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right'
      }
    }
  };

  constructor(
    private memberService: MemberService,
    private evtService: EvtService,
    private publicationService: PublicationService,
    private toolService: ToolService
  ) {}

  ngOnInit(): void {
    console.log('🔄 Dashboard - Chargement des données...');
    this.loadAllStatistics();
  }

  loadAllStatistics(): void {
    // Charger toutes les statistiques en parallèle
    forkJoin({
      membres: this.memberService.GetAllMembers(),
      evenements: this.evtService.GetAllEvts(),
      outils: this.toolService.getAllOutils(),
      publications: this.publicationService.getAllPublications()
    }).subscribe({
      next: (data) => {
        console.log('✅ Données chargées:', data);
        
        // Mettre à jour les compteurs
        this.Nb_Membres = data.membres.length;
        this.Nb_Evenements = data.evenements.length;
        
        // Extraire les outils du format HAL si nécessaire
        const outils = (data.outils as any)._embedded?.outils || data.outils;
        this.Nb_Outils = Array.isArray(outils) ? outils.length : 0;
        
        this.Nb_Publications = data.publications.length;

        // Préparer les graphiques
        this.prepareEventsChart(data.evenements);
        this.preparePublicationsChart(data.publications);

        // Préparer les listes
        this.loadUpcomingEvents();
        this.loadRecentPublications();
      },
      error: (err) => {
        console.error('❌ Erreur chargement statistiques:', err);
      }
    });
  }

  prepareEventsChart(events: any[]): void {
    this.isLoadingEvents = true;
    
    // Grouper les événements par mois
    const monthCounts = new Map<string, number>();
    const currentYear = new Date().getFullYear();
    
    // Initialiser les 12 derniers mois
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthCounts.set(key, 0);
    }

    // Compter les événements par mois
    events.forEach(event => {
      if (event.date) {
        const eventDate = new Date(event.date);
        const key = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}`;
        if (monthCounts.has(key)) {
          monthCounts.set(key, monthCounts.get(key)! + 1);
        }
      }
    });

    // Préparer les données pour le graphique
    const labels: string[] = [];
    const data: number[] = [];
    
    monthCounts.forEach((count, key) => {
      const [year, month] = key.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      labels.push(date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }));
      data.push(count);
    });

    this.eventsChartData = {
      labels,
      datasets: [{
        label: 'Nombre d\'événements',
        data,
        fill: false,
        borderColor: '#3f51b5',
        backgroundColor: '#3f51b5',
        tension: 0.4
      }]
    };

    this.isLoadingEvents = false;
  }

  preparePublicationsChart(publications: any[]): void {
    this.isLoadingPublications = true;
    
    // Grouper par type
    const typeCounts = new Map<string, number>();
    
    publications.forEach(pub => {
      if (pub.type) {
        typeCounts.set(pub.type, (typeCounts.get(pub.type) || 0) + 1);
      }
    });

    const labels = Array.from(typeCounts.keys());
    const data = Array.from(typeCounts.values());
    const colors = [
      '#3f51b5',
      '#00bcd4',
      '#4caf50',
      '#ff9800',
      '#f44336',
      '#9c27b0'
    ];

    this.publicationsChartData = {
      labels,
      datasets: [{
        label: 'Publications',
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };

    this.isLoadingPublications = false;
  }

  loadUpcomingEvents(): void {
    this.evtService.findUpcomingEvents().subscribe({
      next: (events) => {
        this.upcomingEvents = events
          .filter(event => event.date != null) // Filtrer les dates nulles
          .sort((a, b) => 
            new Date(a.date!).getTime() - new Date(b.date!).getTime()
          );
        console.log('✅ Événements à venir:', this.upcomingEvents.length);
      },
      error: (err) => {
        console.error('❌ Erreur chargement événements à venir:', err);
        this.upcomingEvents = [];
      }
    });
  }

  loadRecentPublications(): void {
    this.publicationService.getAllPublications().subscribe({
      next: (publications) => {
        this.recentPublications = publications
          .filter(pub => pub.dateApparition != null) // Filtrer les dates nulles
          .sort((a, b) => 
            new Date(b.dateApparition!).getTime() - new Date(a.dateApparition!).getTime()
          )
          .slice(0, 5);
        console.log('✅ Publications récentes:', this.recentPublications.length);
      },
      error: (err) => {
        console.error('❌ Erreur chargement publications récentes:', err);
        this.recentPublications = [];
      }
    });
  }
}