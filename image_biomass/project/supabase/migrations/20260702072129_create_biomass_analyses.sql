/*
# Create biomass_analyses table

## Purpose
Stores results from AI-powered pasture image biomass prediction analyses.

## New Tables

### biomass_analyses
Each row represents one image analysis run, including all five biomass parameters
and metadata about the image and analysis state.

Columns:
- id: UUID primary key
- image_name: Original filename of the uploaded image
- image_data_url: Base64 data URL of the uploaded image (stored client-side style)
- dry_green_vegetation: Dry Green Vegetation Biomass in kg/ha (excluding clover)
- dry_dead_material: Dry Dead Material Biomass in kg/ha
- dry_clover: Dry Clover Biomass in kg/ha
- green_dry_matter: Green Dry Matter (GDM) in kg/ha
- total_dry_biomass: Total Dry Biomass in kg/ha
- vegetation_coverage: Vegetation coverage percentage (0-100)
- texture_score: Texture analysis score (0-100)
- canopy_density: Canopy density score (0-100)
- status: 'processing' | 'complete' | 'error'
- created_at: Timestamp of analysis

## Security
- RLS enabled. Single-tenant no-auth app; anon + authenticated users can CRUD.
  USING (true) is intentional — data is shared/public (no login screen).
*/

CREATE TABLE IF NOT EXISTS biomass_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_name text NOT NULL DEFAULT 'unknown.jpg',
  image_data_url text,
  dry_green_vegetation numeric(10,2) NOT NULL DEFAULT 0,
  dry_dead_material numeric(10,2) NOT NULL DEFAULT 0,
  dry_clover numeric(10,2) NOT NULL DEFAULT 0,
  green_dry_matter numeric(10,2) NOT NULL DEFAULT 0,
  total_dry_biomass numeric(10,2) NOT NULL DEFAULT 0,
  vegetation_coverage numeric(5,2) NOT NULL DEFAULT 0,
  texture_score numeric(5,2) NOT NULL DEFAULT 0,
  canopy_density numeric(5,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'complete', 'error')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS biomass_analyses_created_at_idx ON biomass_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS biomass_analyses_status_idx ON biomass_analyses(status);

ALTER TABLE biomass_analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_biomass_analyses" ON biomass_analyses;
CREATE POLICY "anon_select_biomass_analyses" ON biomass_analyses FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_biomass_analyses" ON biomass_analyses;
CREATE POLICY "anon_insert_biomass_analyses" ON biomass_analyses FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_biomass_analyses" ON biomass_analyses;
CREATE POLICY "anon_update_biomass_analyses" ON biomass_analyses FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_biomass_analyses" ON biomass_analyses;
CREATE POLICY "anon_delete_biomass_analyses" ON biomass_analyses FOR DELETE
  TO anon, authenticated USING (true);
