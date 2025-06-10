// Supabase configuration using CDN
// This version loads Supabase from CDN to avoid module resolution issues

// Import the config
import { SUPABASE_CONFIG } from './config.js'

// Supabase will be loaded from CDN in the HTML file
// We'll access it via window.supabase after the CDN script loads

let supabase = null;

// Initialize Supabase client
export function initSupabase() {
  if (window.supabase && window.supabase.createClient) {
    supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    return supabase;
  } else {
    throw new Error('Supabase CDN not loaded. Make sure to include the Supabase CDN script.');
  }
}

// Get the Supabase client (initialize if needed)
export function getSupabase() {
  if (!supabase) {
    supabase = initSupabase();
  }
  return supabase;
}

// Database service functions for your schema
export class DatabaseService {
  
  // Localities
  static async getLocalities() {
    const client = getSupabase();
    const { data, error } = await client
      .from('localities')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  }

  static async createLocality(name) {
    const client = getSupabase();
    const { data, error } = await client
      .from('localities')
      .insert([{ name }])
      .select()
    
    if (error) throw error
    return data[0]
  }

  // Zone Types
  static async getZoneTypes() {
    const client = getSupabase();
    const { data, error } = await client
      .from('zone_types')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  }

  static async createZoneType(name) {
    const client = getSupabase();
    const { data, error } = await client
      .from('zone_types')
      .insert([{ name }])
      .select()
    
    if (error) throw error
    return data[0]
  }

  // Plans
  static async getPlans(category = null) {
    const client = getSupabase();
    let query = client
      .from('plans')
      .select('*')
    
    if (category) {
      query = query.eq('plan_category', category)
    }
    
    const { data, error } = await query.order('price')
    
    if (error) throw error
    return data
  }

  static async getPlanWithFeatures(planId) {
    const client = getSupabase();
    const { data, error } = await client
      .from('plans')
      .select(`
        *,
        features (
          id,
          icon_name,
          description,
          sort_order
        )
      `)
      .eq('id', planId)
      .single()
    
    if (error) throw error
    return data
  }

  static async getPlansWithFeatures(category = null) {
    const client = getSupabase();
    let query = client
      .from('plans')
      .select(`
        *,
        features (
          id,
          icon_name,
          description,
          sort_order
        )
      `)
    
    if (category) {
      query = query.eq('plan_category', category)
    }
    
    const { data, error } = await query.order('price')
    
    if (error) throw error
    return data
  }

  static async createPlan(name, price, planCategory) {
    const client = getSupabase();
    const { data, error } = await client
      .from('plans')
      .insert([{ name, price, plan_category: planCategory }])
      .select()
    
    if (error) throw error
    return data[0]
  }

  // Features
  static async createFeature(planId, iconName, description, sortOrder = 0) {
    const client = getSupabase();
    const { data, error } = await client
      .from('features')
      .insert([{ 
        plan_id: planId, 
        icon_name: iconName, 
        description, 
        sort_order: sortOrder 
      }])
      .select()
    
    if (error) throw error
    return data[0]
  }

  static async getFeaturesByPlan(planId) {
    const client = getSupabase();
    const { data, error } = await client
      .from('features')
      .select('*')
      .eq('plan_id', planId)
      .order('sort_order')
    
    if (error) throw error
    return data
  }

  // Plan Availability
  static async getPlanAvailability(localityId = null, zoneTypeId = null) {
    const client = getSupabase();
    let query = client
      .from('plan_availability')
      .select(`
        *,
        plans (*),
        localities (*),
        zone_types (*)
      `)
    
    if (localityId) {
      query = query.eq('locality_id', localityId)
    }
    
    if (zoneTypeId) {
      query = query.eq('zone_type_id', zoneTypeId)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data
  }

  static async getAvailablePlans(localityId, zoneTypeId) {
    const client = getSupabase();
    const { data, error } = await client
      .from('plan_availability')
      .select(`
        plans (
          *,
          features (
            id,
            icon_name,
            description,
            sort_order
          )
        )
      `)
      .eq('locality_id', localityId)
      .eq('zone_type_id', zoneTypeId)
    
    if (error) throw error
    return data.map(item => item.plans)
  }

  static async addPlanAvailability(planId, localityId, zoneTypeId) {
    const client = getSupabase();
    const { data, error } = await client
      .from('plan_availability')
      .insert([{ 
        plan_id: planId, 
        locality_id: localityId, 
        zone_type_id: zoneTypeId 
      }])
      .select()
    
    if (error) throw error
    return data[0]
  }
} 