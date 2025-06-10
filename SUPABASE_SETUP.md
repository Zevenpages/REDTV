# 🚀 Supabase Database Integration Guide

This guide will help you integrate your Supabase schema with your project.

## 📋 Prerequisites

- A Supabase account and project
- Node.js installed on your system
- Your project files (already set up)

## 🔧 Step-by-Step Setup

### 1. Apply the Schema to Your Supabase Project

You have two options to apply your schema:

#### Option A: Using Supabase Dashboard (Recommended)
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor** in the sidebar
4. Copy the contents of `supabase_schema.sql`
5. Paste it into the SQL Editor
6. Click **Run** to execute the schema

#### Option B: Using Supabase CLI
```bash
# If you have Supabase CLI installed
supabase db push
```

### 2. Get Your Supabase Credentials

1. In your Supabase project dashboard
2. Go to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (looks like: `https://your-project-ref.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 3. Configure Your Project

1. Open `js/config.js`
2. Replace the placeholder values with your actual credentials:

```javascript
export const SUPABASE_CONFIG = {
  url: 'https://your-actual-project-ref.supabase.co',
  anonKey: 'your-actual-anon-key-here'
}
```

### 4. Test Your Setup

1. Open `test-database.html` in your browser
2. Click **"🔌 Test Connection"** to verify the connection
3. If successful, click **"🌱 Seed Database"** to populate with sample data
4. Use **"📋 Load Plans"** and **"📍 Load Localities"** to see your data

## 📁 Files Created

- `js/supabase.js` - Main Supabase client and database service functions
- `js/config.js` - Configuration file for your Supabase credentials
- `js/seed-data.js` - Sample data and seeding functions
- `test-database.html` - Test page to verify everything works
- `SUPABASE_SETUP.md` - This setup guide

## 🛠️ Available Database Functions

### Localities
```javascript
import { DatabaseService } from './js/supabase.js';

// Get all localities
const localities = await DatabaseService.getLocalities();

// Create a new locality
const newLocality = await DatabaseService.createLocality('Nueva Localidad');
```

### Zone Types
```javascript
// Get all zone types
const zoneTypes = await DatabaseService.getZoneTypes();

// Create a new zone type
const newZoneType = await DatabaseService.createZoneType('Nuevo Tipo');
```

### Plans
```javascript
// Get all plans
const plans = await DatabaseService.getPlans();

// Get plans by category
const internetPlans = await DatabaseService.getPlans('internet');

// Get plans with their features
const plansWithFeatures = await DatabaseService.getPlansWithFeatures();

// Get a specific plan with features
const plan = await DatabaseService.getPlanWithFeatures(planId);

// Create a new plan
const newPlan = await DatabaseService.createPlan('Plan Name', 15000.00, 'internet');
```

### Features
```javascript
// Get features for a specific plan
const features = await DatabaseService.getFeaturesByPlan(planId);

// Add a feature to a plan
const newFeature = await DatabaseService.createFeature(
  planId, 
  'wifi', 
  'WiFi Gratis', 
  0 // sort order
);
```

### Plan Availability
```javascript
// Get available plans for a locality and zone type
const availablePlans = await DatabaseService.getAvailablePlans(localityId, zoneTypeId);

// Add plan availability
await DatabaseService.addPlanAvailability(planId, localityId, zoneTypeId);
```

## 🔒 Security Considerations

### Row Level Security (RLS)
Your schema includes commented RLS policies. To enable them:

1. Go to your Supabase SQL Editor
2. Run the following to enable RLS:

```sql
-- Enable RLS on all tables
ALTER TABLE localities ENABLE ROW LEVEL SECURITY;
ALTER TABLE zone_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_availability ENABLE ROW LEVEL SECURITY;

-- Create read-only policies for public access
CREATE POLICY "Allow public read access to localities" ON localities FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read access to zone_types" ON zone_types FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read access to plans" ON plans FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read access to features" ON features FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read access to plan_availability" ON plan_availability FOR SELECT TO anon, authenticated USING (true);
```

### Environment Variables
For production, consider using environment variables instead of hardcoding credentials:

```javascript
// In a real application, use environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
```

## 🧪 Testing

### Manual Testing
1. Open `test-database.html` in your browser
2. Use the provided buttons to test each function
3. Check the console for detailed logs

### Integration with Existing Pages
To integrate with your existing pages (like `planes.html`):

```javascript
// Add to your existing JavaScript files
import { DatabaseService } from './js/supabase.js';

// Example: Load plans dynamically
async function loadPlansFromDatabase() {
  try {
    const plans = await DatabaseService.getPlansWithFeatures('internet');
    // Update your UI with the plans data
    displayPlans(plans);
  } catch (error) {
    console.error('Error loading plans:', error);
  }
}
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Make sure your domain is added to the allowed origins in Supabase settings
   - For local development, `localhost` should work by default

2. **Authentication Errors**
   - Verify your URL and anon key are correct
   - Check that the keys don't have extra spaces or characters

3. **Permission Errors**
   - Ensure RLS policies are set up correctly
   - Check that the anon role has the necessary permissions

4. **Import Errors**
   - Make sure you're serving the files through a web server (not file://)
   - Use a local server like `python -m http.server` or `npx serve`

### Getting Help

- Check the browser console for detailed error messages
- Verify your Supabase project is active and accessible
- Test the connection using the test page first

## 🎯 Next Steps

1. **Apply the schema** to your Supabase project
2. **Update the configuration** with your credentials
3. **Test the connection** using the test page
4. **Seed the database** with sample data
5. **Integrate** with your existing pages

Once everything is working, you can start using the database functions in your existing HTML pages to make them dynamic!

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security) 