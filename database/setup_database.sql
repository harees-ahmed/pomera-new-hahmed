-- Pomera Care Database Setup Script
-- Run this script in your Supabase SQL Editor to set up the database

-- First, let's check if tables exist and drop them if they do (for clean setup)
DROP TABLE IF EXISTS company_files CASCADE;
DROP TABLE IF EXISTS company_notes CASCADE;
DROP TABLE IF EXISTS company_contacts CASCADE;
DROP TABLE IF EXISTS company_addresses CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- Drop dimension tables
DROP TABLE IF EXISTS dim_document_type CASCADE;
DROP TABLE IF EXISTS dim_file_category CASCADE;
DROP TABLE IF EXISTS dim_address_type CASCADE;
DROP TABLE IF EXISTS dim_contact_type CASCADE;
DROP TABLE IF EXISTS dim_contact_method CASCADE;
DROP TABLE IF EXISTS dim_note_type CASCADE;
DROP TABLE IF EXISTS dim_position_type CASCADE;
DROP TABLE IF EXISTS dim_annual_revenue CASCADE;
DROP TABLE IF EXISTS dim_company_size CASCADE;
DROP TABLE IF EXISTS dim_lead_score CASCADE;
DROP TABLE IF EXISTS dim_lead_source CASCADE;
DROP TABLE IF EXISTS dim_company_status CASCADE;
DROP TABLE IF EXISTS dim_industry CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_date_column() CASCADE;

-- Now run the main schema
-- (Copy and paste the contents of schema.sql here, or run schema.sql separately)

-- After running the schema, run this verification query:
SELECT 
  'companies' as table_name, 
  COUNT(*) as record_count 
FROM companies
UNION ALL
SELECT 
  'dim_company_status' as table_name, 
  COUNT(*) as record_count 
FROM dim_company_status
UNION ALL
SELECT 
  'dim_lead_source' as table_name, 
  COUNT(*) as record_count 
FROM dim_lead_source
UNION ALL
SELECT 
  'dim_lead_score' as table_name, 
  COUNT(*) as record_count 
FROM dim_lead_score
UNION ALL
SELECT 
  'dim_industry' as table_name, 
  COUNT(*) as record_count 
FROM dim_industry
ORDER BY table_name;
