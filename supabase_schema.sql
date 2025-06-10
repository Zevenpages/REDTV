-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: localities
-- Stores the different localities where services are offered.
CREATE TABLE IF NOT EXISTS localities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE localities IS 'Stores the different localities where services are offered.';
COMMENT ON COLUMN localities.id IS 'Primary key, auto-generated UUID.';
COMMENT ON COLUMN localities.name IS 'Name of the locality (e.g., "resistencia", "fontana"). Must be unique.';
COMMENT ON COLUMN localities.created_at IS 'Timestamp of when the locality was created.';

-- Table: zone_types
-- Stores the types of zones within localities (e.g., urban, rural).
CREATE TABLE IF NOT EXISTS zone_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE zone_types IS 'Stores the types of zones within localities (e.g., urban, rural).';
COMMENT ON COLUMN zone_types.id IS 'Primary key, auto-generated UUID.';
COMMENT ON COLUMN zone_types.name IS 'Name of the zone type (e.g., "urban", "rural"). Must be unique.';
COMMENT ON COLUMN zone_types.created_at IS 'Timestamp of when the zone type was created.';

-- Table: plans
-- Core table for service plans (Internet, TV, or Combo).
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0), -- Assuming price won't exceed 99,999,999.99 and is non-negative
    plan_category TEXT NOT NULL, -- E.g., 'internet', 'tv', 'combo'
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE plans IS 'Core table for service plans (Internet, TV, or Combo).';
COMMENT ON COLUMN plans.id IS 'Primary key, auto-generated UUID.';
COMMENT ON COLUMN plans.name IS 'Name of the service plan (e.g., "Internet 100MB Fibra").';
COMMENT ON COLUMN plans.price IS 'Price of the plan. Stored as NUMERIC for precision.';
COMMENT ON COLUMN plans.plan_category IS 'Category of the plan (e.g., ''internet'', ''tv'', ''combo'').';
COMMENT ON COLUMN plans.created_at IS 'Timestamp of when the plan was created.';

-- Table: features
-- Stores individual features associated with each plan.
CREATE TABLE IF NOT EXISTS features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    icon_name TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE features IS 'Stores individual features associated with each plan.';
COMMENT ON COLUMN features.id IS 'Primary key, auto-generated UUID.';
COMMENT ON COLUMN features.plan_id IS 'Foreign key referencing the plan this feature belongs to. Deletes cascade.';
COMMENT ON COLUMN features.icon_name IS 'Material Icon name for the feature (e.g., "wifi", "tv", "speed").';
COMMENT ON COLUMN features.description IS 'Short text description of the feature (e.g., "100 Mbps Bajada").';
COMMENT ON COLUMN features.sort_order IS 'Integer to control the display order of features for a plan (0 is highest).';
COMMENT ON COLUMN features.created_at IS 'Timestamp of when the feature was created.';

-- Create an index on plan_id in features table for faster lookups
CREATE INDEX IF NOT EXISTS idx_features_plan_id ON features(plan_id);

-- Table: plan_availability
-- Junction table linking plans to the localities and zone types where they are available.
CREATE TABLE IF NOT EXISTS plan_availability (
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    locality_id UUID NOT NULL REFERENCES localities(id) ON DELETE CASCADE,
    zone_type_id UUID NOT NULL REFERENCES zone_types(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (plan_id, locality_id, zone_type_id) -- Composite primary key
);

COMMENT ON TABLE plan_availability IS 'Junction table linking plans to the localities and zone types where they are available.';
COMMENT ON COLUMN plan_availability.plan_id IS 'Foreign key referencing the plan. Part of the composite primary key. Deletes cascade.';
COMMENT ON COLUMN plan_availability.locality_id IS 'Foreign key referencing the locality. Part of the composite primary key. Deletes cascade.';
COMMENT ON COLUMN plan_availability.zone_type_id IS 'Foreign key referencing the zone type. Part of the composite primary key. Deletes cascade.';
COMMENT ON COLUMN plan_availability.created_at IS 'Timestamp of when the availability record was created.';

-- Create indexes on foreign keys in plan_availability for better join performance
CREATE INDEX IF NOT EXISTS idx_plan_availability_locality_id ON plan_availability(locality_id);
CREATE INDEX IF NOT EXISTS idx_plan_availability_zone_type_id ON plan_availability(zone_type_id);

-- Grant basic usage permissions to anon and authenticated roles
-- These are often default in Supabase but explicitly stating them can be good.
-- You might need to adjust these based on your RLS policies.
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE localities TO anon, authenticated;
GRANT ALL ON TABLE zone_types TO anon, authenticated;
GRANT ALL ON TABLE plans TO anon, authenticated;
GRANT ALL ON TABLE features TO anon, authenticated;
GRANT ALL ON TABLE plan_availability TO anon, authenticated;

-- For a production setup, you'd want to enable Row Level Security (RLS)
-- and define policies for who can SELECT, INSERT, UPDATE, DELETE.
-- For example, you might want to make these tables read-only for the 'anon' role.
-- ALTER TABLE localities ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read access to localities" ON localities FOR SELECT TO anon, authenticated USING (true);

-- ALTER TABLE zone_types ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read access to zone_types" ON zone_types FOR SELECT TO anon, authenticated USING (true);

-- ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read access to plans" ON plans FOR SELECT TO anon, authenticated USING (true);

-- ALTER TABLE features ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read access to features" ON features FOR SELECT TO anon, authenticated USING (true);

-- ALTER TABLE plan_availability ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read access to plan_availability" ON plan_availability FOR SELECT TO anon, authenticated USING (true);

-- Remember to create RLS policies for INSERT, UPDATE, DELETE for the 'service_role' or specific admin users if needed.

SELECT 'Supabase schema creation script executed.'; 