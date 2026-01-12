export interface Publication {
  id?: number;
  titre: string;
  type: string; // Type de publication (article, conférence, livre, etc.)
  dateApparition: string; // Format ISO: "yyyy-MM-dd"
  lien: string; // URL ou DOI
  auteurs: string; // Liste des auteurs séparés par des virgules
  source: string; // Journal, conférence, etc.
}