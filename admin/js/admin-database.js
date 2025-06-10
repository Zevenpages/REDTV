// Admin Database Service for Plan Management
// This extends the main database service with admin-specific functionality

import { DatabaseService, getSupabase } from './supabase-cdn.js';

export class AdminDatabaseService extends DatabaseService {
  
  // Enhanced plan management for admin
  static async createPlanWithFeatures(planData) {
    try {
      // Create the plan first
      const plan = await this.createPlan(
        planData.name,
        planData.price,
        planData.category
      );

      // Add features if provided
      if (planData.features && planData.features.length > 0) {
        for (let i = 0; i < planData.features.length; i++) {
          const feature = planData.features[i];
          await this.createFeature(
            plan.id,
            feature.icon || 'check_circle',
            feature.description,
            i
          );
        }
      }

      // Add availability if provided
      if (planData.availability && planData.availability.length > 0) {
        for (const availability of planData.availability) {
          await this.addPlanAvailability(
            plan.id,
            availability.localityId,
            availability.zoneTypeId
          );
        }
      }

      return plan;
    } catch (error) {
      console.error('Error creating plan with features:', error);
      throw error;
    }
  }

  // Update plan with features and availability
  static async updatePlanWithFeatures(planId, planData) {
    try {
      const client = getSupabase();
      
      // Update the plan basic info
      const { data: updatedPlan, error: planError } = await client
        .from('plans')
        .update({
          name: planData.name,
          price: planData.price,
          plan_category: planData.category
        })
        .eq('id', planId)
        .select()
        .single();

      if (planError) throw planError;

      // Delete existing features and recreate them
      await client
        .from('features')
        .delete()
        .eq('plan_id', planId);

      // Add new features
      if (planData.features && planData.features.length > 0) {
        for (let i = 0; i < planData.features.length; i++) {
          const feature = planData.features[i];
          await this.createFeature(
            planId,
            feature.icon || 'check_circle',
            feature.description,
            i
          );
        }
      }

      // Delete existing availability and recreate
      await client
        .from('plan_availability')
        .delete()
        .eq('plan_id', planId);

      // Add new availability
      if (planData.availability && planData.availability.length > 0) {
        for (const availability of planData.availability) {
          await this.addPlanAvailability(
            planId,
            availability.localityId,
            availability.zoneTypeId
          );
        }
      }

      return updatedPlan;
    } catch (error) {
      console.error('Error updating plan:', error);
      throw error;
    }
  }

  // Delete plan and all related data
  static async deletePlan(planId) {
    try {
      const client = getSupabase();
      
      // Delete the plan (features and availability will be deleted by CASCADE)
      const { error } = await client
        .from('plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw error;
    }
  }

  // Get plan with full details for editing
  static async getPlanForEdit(planId) {
    try {
      const client = getSupabase();
      
      // Get plan with features
      const { data: plan, error: planError } = await client
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
        .single();

      if (planError) throw planError;

      // Get plan availability
      const { data: availability, error: availabilityError } = await client
        .from('plan_availability')
        .select(`
          *,
          localities (id, name),
          zone_types (id, name)
        `)
        .eq('plan_id', planId);

      if (availabilityError) throw availabilityError;

      return {
        ...plan,
        availability: availability || []
      };
    } catch (error) {
      console.error('Error getting plan for edit:', error);
      throw error;
    }
  }

  // Parse availability from form checkboxes
  static async parseAvailabilityFromForm(formData) {
    const availability = [];
    const localities = await this.getLocalities();
    const zoneTypes = await this.getZoneTypes();

    // Create lookup maps
    const localityMap = {};
    const zoneTypeMap = {};
    
    localities.forEach(locality => {
      localityMap[locality.name.toLowerCase()] = locality.id;
    });
    
    zoneTypes.forEach(zoneType => {
      zoneTypeMap[zoneType.name.toLowerCase()] = zoneType.id;
    });

    // Parse the form data
    for (const item of formData) {
      const parts = item.split('-');
      if (parts.length === 2) {
        const localityName = parts[0];
        const zoneTypeName = parts[1];
        
        const localityId = localityMap[localityName];
        const zoneTypeId = zoneTypeMap[zoneTypeName];
        
        if (localityId && zoneTypeId) {
          availability.push({
            localityId,
            zoneTypeId
          });
        }
      }
    }

    return availability;
  }

  // Get dashboard statistics
  static async getDashboardStats() {
    try {
      const [plans, localities, zoneTypes] = await Promise.all([
        this.getPlans(),
        this.getLocalities(),
        this.getZoneTypes()
      ]);

      const plansByCategory = {};
      plans.forEach(plan => {
        plansByCategory[plan.plan_category] = (plansByCategory[plan.plan_category] || 0) + 1;
      });

      return {
        totalPlans: plans.length,
        totalLocalities: localities.length,
        totalZoneTypes: zoneTypes.length,
        plansByCategory,
        plans: plans.slice(0, 5) // Recent plans
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }

  // Search plans
  static async searchPlans(searchTerm) {
    try {
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
        .or(`name.ilike.%${searchTerm}%,plan_category.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error searching plans:', error);
      throw error;
    }
  }

  // Bulk operations
  static async bulkDeletePlans(planIds) {
    try {
      const client = getSupabase();
      
      const { error } = await client
        .from('plans')
        .delete()
        .in('id', planIds);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error bulk deleting plans:', error);
      throw error;
    }
  }

  // Export plans data
  static async exportPlansData() {
    try {
      const plans = await this.getPlansWithFeatures();
      const localities = await this.getLocalities();
      const zoneTypes = await this.getZoneTypes();

      return {
        plans,
        localities,
        zoneTypes,
        exportDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error exporting plans data:', error);
      throw error;
    }
  }
} 