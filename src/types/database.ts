/**
 * Tipos do banco gerados pelo Supabase CLI.
 *
 * Para regerar após mudança de schema:
 *   npx supabase gen types typescript --project-id <PROJECT_ID> > src/types/database.ts
 *
 * Por enquanto, stub `any` pra desbloquear o desenvolvimento antes do projeto Supabase existir.
 * Trocar antes do MVP estar pronto.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any;
