// Dans src/Models/Evt.ts
export interface Tool {
  id?: number;
  titre: string;
  date: string | null; // Permettre null
  source: string;
}