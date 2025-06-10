// Sample data seeding script for your Supabase database
import { DatabaseService } from './supabase.js'

// Sample data
const sampleData = {
  localities: [
    'Resistencia',
    'Fontana',
    'Barranqueras',
    'Puerto Vilelas',
    'Charata',
    'Presidencia Roque Sáenz Peña'
  ],
  
  zoneTypes: [
    'Urbano',
    'Rural'
  ],
  
  plans: [
    {
      name: 'Internet 50MB Fibra',
      price: 8500.00,
      category: 'internet',
      features: [
        { icon: 'speed', description: '50 Mbps Bajada', order: 0 },
        { icon: 'upload', description: '25 Mbps Subida', order: 1 },
        { icon: 'wifi', description: 'WiFi Gratis', order: 2 },
        { icon: 'router', description: 'Router en Comodato', order: 3 }
      ]
    },
    {
      name: 'Internet 100MB Fibra',
      price: 12500.00,
      category: 'internet',
      features: [
        { icon: 'speed', description: '100 Mbps Bajada', order: 0 },
        { icon: 'upload', description: '50 Mbps Subida', order: 1 },
        { icon: 'wifi', description: 'WiFi Gratis', order: 2 },
        { icon: 'router', description: 'Router en Comodato', order: 3 },
        { icon: 'support', description: 'Soporte 24/7', order: 4 }
      ]
    },
    {
      name: 'TV Digital Básico',
      price: 6500.00,
      category: 'tv',
      features: [
        { icon: 'tv', description: '80+ Canales', order: 0 },
        { icon: 'hd', description: 'Calidad HD', order: 1 },
        { icon: 'device_hub', description: 'Decodificador Incluido', order: 2 }
      ]
    },
    {
      name: 'Combo Internet 100MB + TV',
      price: 16500.00,
      category: 'combo',
      features: [
        { icon: 'speed', description: '100 Mbps Bajada', order: 0 },
        { icon: 'upload', description: '50 Mbps Subida', order: 1 },
        { icon: 'tv', description: '80+ Canales HD', order: 2 },
        { icon: 'wifi', description: 'WiFi Gratis', order: 3 },
        { icon: 'router', description: 'Router en Comodato', order: 4 },
        { icon: 'device_hub', description: 'Decodificador Incluido', order: 5 }
      ]
    }
  ]
}

// Seeding functions
export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')
    
    // 1. Seed localities
    console.log('📍 Seeding localities...')
    const localities = []
    for (const localityName of sampleData.localities) {
      try {
        const locality = await DatabaseService.createLocality(localityName)
        localities.push(locality)
        console.log(`✅ Created locality: ${localityName}`)
      } catch (error) {
        if (error.message.includes('duplicate')) {
          console.log(`⚠️  Locality already exists: ${localityName}`)
          // Get existing locality
          const existingLocalities = await DatabaseService.getLocalities()
          const existing = existingLocalities.find(l => l.name === localityName)
          if (existing) localities.push(existing)
        } else {
          throw error
        }
      }
    }
    
    // 2. Seed zone types
    console.log('🏘️  Seeding zone types...')
    const zoneTypes = []
    for (const zoneTypeName of sampleData.zoneTypes) {
      try {
        const zoneType = await DatabaseService.createZoneType(zoneTypeName)
        zoneTypes.push(zoneType)
        console.log(`✅ Created zone type: ${zoneTypeName}`)
      } catch (error) {
        if (error.message.includes('duplicate')) {
          console.log(`⚠️  Zone type already exists: ${zoneTypeName}`)
          // Get existing zone type
          const existingZoneTypes = await DatabaseService.getZoneTypes()
          const existing = existingZoneTypes.find(zt => zt.name === zoneTypeName)
          if (existing) zoneTypes.push(existing)
        } else {
          throw error
        }
      }
    }
    
    // 3. Seed plans and features
    console.log('📋 Seeding plans and features...')
    const plans = []
    for (const planData of sampleData.plans) {
      try {
        const plan = await DatabaseService.createPlan(
          planData.name, 
          planData.price, 
          planData.category
        )
        plans.push(plan)
        console.log(`✅ Created plan: ${planData.name}`)
        
        // Add features for this plan
        for (const feature of planData.features) {
          await DatabaseService.createFeature(
            plan.id,
            feature.icon,
            feature.description,
            feature.order
          )
          console.log(`  ✅ Added feature: ${feature.description}`)
        }
      } catch (error) {
        console.error(`❌ Error creating plan ${planData.name}:`, error.message)
      }
    }
    
    // 4. Seed plan availability (make all plans available in all localities and zone types)
    console.log('🗺️  Seeding plan availability...')
    for (const plan of plans) {
      for (const locality of localities) {
        for (const zoneType of zoneTypes) {
          try {
            await DatabaseService.addPlanAvailability(plan.id, locality.id, zoneType.id)
            console.log(`✅ Added availability: ${plan.name} in ${locality.name} (${zoneType.name})`)
          } catch (error) {
            if (error.message.includes('duplicate')) {
              console.log(`⚠️  Availability already exists: ${plan.name} in ${locality.name} (${zoneType.name})`)
            } else {
              console.error(`❌ Error adding availability:`, error.message)
            }
          }
        }
      }
    }
    
    console.log('🎉 Database seeding completed successfully!')
    
    return {
      localities,
      zoneTypes,
      plans
    }
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Function to clear all data (use with caution!)
export async function clearDatabase() {
  console.log('🧹 Clearing database...')
  // Note: Due to CASCADE deletes, we only need to delete from parent tables
  // The schema will automatically delete related records
  
  // This would require admin privileges, so it's commented out
  // You would need to use the service role key for this
  console.log('⚠️  Database clearing requires admin privileges')
  console.log('   Run this in your Supabase SQL editor:')
  console.log('   DELETE FROM plan_availability;')
  console.log('   DELETE FROM features;')
  console.log('   DELETE FROM plans;')
  console.log('   DELETE FROM zone_types;')
  console.log('   DELETE FROM localities;')
}

// Example usage function
export async function testDatabaseConnection() {
  try {
    console.log('🔌 Testing database connection...')
    
    const localities = await DatabaseService.getLocalities()
    console.log(`✅ Found ${localities.length} localities`)
    
    const zoneTypes = await DatabaseService.getZoneTypes()
    console.log(`✅ Found ${zoneTypes.length} zone types`)
    
    const plans = await DatabaseService.getPlans()
    console.log(`✅ Found ${plans.length} plans`)
    
    console.log('🎉 Database connection test successful!')
    
    return true
  } catch (error) {
    console.error('❌ Database connection test failed:', error)
    return false
  }
} 