// Supabase Configuration
// Replace these with your actual Supabase project credentials
// You can find these in your Supabase project dashboard under Settings > API

export const SUPABASE_CONFIG = {
  url: 'https://leepimkwdqpgkqhxrmqm.supabase.co', // Fixed: removed extra "L"
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZXBpbWt3ZHFwZ2txaHhybXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTg3OTcsImV4cCI6MjA2Mzg3NDc5N30.WufUGTA6IpSZmkb7Uze7aqvAzx80AOW76XqgaMbw9C4' // Your anon/public key
}

// Example of how your URL should look:
// url: 'https://abcdefghijklmnop.supabase.co'

// To get your credentials:
// 1. Go to your Supabase project dashboard
// 2. Click on Settings (gear icon) in the sidebar
// 3. Go to API section
// 4. Copy the Project URL and anon/public key 