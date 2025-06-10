// Supabase configuration
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_CONFIG } from './config.js'

export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey)

// Database service functions for your schema
export class DatabaseService {
  
  // Localities
  static async getLocalities() {
    const { data, error } = await supabase
      .from('localities')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  }

  static async createLocality(name) {
    const { data, error } = await supabase
      .from('localities')
      .insert([{ name }])
      .select()
    
    if (error) throw error
    return data[0]
  }

  // Zone Types
  static async getZoneTypes() {
    const { data, error } = await supabase
      .from('zone_types')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  }

  static async createZoneType(name) {
    const { data, error } = await supabase
      .from('zone_types')
      .insert([{ name }])
      .select()
    
    if (error) throw error
    return data[0]
  }

  // Plans
  static async getPlans(category = null) {
    let query = supabase
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
    const { data, error } = await supabase
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
    let query = supabase
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
    const { data, error } = await supabase
      .from('plans')
      .insert([{ name, price, plan_category: planCategory }])
      .select()
    
    if (error) throw error
    return data[0]
  }

  // Features
  static async createFeature(planId, iconName, description, sortOrder = 0) {
    const { data, error } = await supabase
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
    const { data, error } = await supabase
      .from('features')
      .select('*')
      .eq('plan_id', planId)
      .order('sort_order')
    
    if (error) throw error
    return data
  }

  // Plan Availability
  static async getPlanAvailability(localityId = null, zoneTypeId = null) {
    let query = supabase
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
    const { data, error } = await supabase
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
    const { data, error } = await supabase
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