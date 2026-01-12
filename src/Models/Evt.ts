// Dans src/Models/Evt.ts
export interface Evt {
  id?: number;
  titre: string;
  date: string | null; // Permettre null
  lieu: string;
}