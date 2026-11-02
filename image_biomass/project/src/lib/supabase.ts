import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type BiomassAnalysis = {
  id: string;
  image_name: string;
  image_data_url: string | null;
  dry_green_vegetation: number;
  dry_dead_material: number;
  dry_clover: number;
  green_dry_matter: number;
  total_dry_biomass: number;
  vegetation_coverage: number;
  texture_score: number;
  canopy_density: number;
  status: 'processing' | 'complete' | 'error';
  created_at: string;
};
