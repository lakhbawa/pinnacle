export interface Seeder {
  run(): Promise<void>;
  clear?(): Promise<void>;
}