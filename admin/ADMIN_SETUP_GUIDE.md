# 🔧 Admin Dashboard Setup Guide

## 📋 Overview

The admin dashboard now includes full database integration with Supabase for managing plans, features, and availability. This guide will help you set up and use the new functionality.

## 🚀 Quick Start

### 1. **Prerequisites**
- ✅ Supabase database with schema applied (from `supabase_schema.sql`)
- ✅ Database seeded with initial data
- ✅ Local server running (`python3 -m http.server 8080`)

### 2. **Access the Admin Dashboard**
1. Go to: http://localhost:8080/admin/index.html
2. Login with credentials: `admin` / `123`
3. You'll be redirected to the database-enabled dashboard

### 3. **Use the Database Dashboard**
- **New Dashboard**: http://localhost:8080/admin/dashboard-db.html
- **Original Dashboard**: http://localhost:8080/admin/dashboard.html (static mockup)

## 🎯 Features

### ✨ **Plan Management**
- **Create Plans**: Add new internet, TV, or combo plans
- **Edit Plans**: Modify existing plans with full feature management
- **Delete Plans**: Remove plans with confirmation
- **Search Plans**: Real-time search across plan names and features

### 🔧 **Feature Management**
- **Dynamic Features**: Add/remove features for each plan
- **Icon Selection**: Choose from predefined icons for features
- **Feature Descriptions**: Rich text descriptions for each feature

### 📍 **Availability Management**
- **Locality-based**: Set plan availability by locality and zone type
- **Flexible Zones**: Support for Urban, Rural, and Suburban zones
- **Visual Interface**: Checkbox-based selection for easy management

### 📊 **Real-time Updates**
- **Live Data**: All changes reflect immediately in the database
- **Status Indicators**: Connection status and loading states
- **Error Handling**: Comprehensive error messages and retry options

## 🗂️ File Structure

```
admin/
├── index.html              # Login page
├── dashboard.html          # Original static dashboard
├── dashboard-db.html       # NEW: Database-enabled dashboard
├── js/
│   └── admin-database.js   # NEW: Admin database service
└── ADMIN_SETUP_GUIDE.md   # This guide

js/
├── config.js              # Supabase configuration
├── supabase-cdn.js        # Main database service
└── seed-data-cdn.js       # Database seeding
```

## 🔄 How It Works

### **Database Service Architecture**
```javascript
AdminDatabaseService extends DatabaseService
├── createPlanWithFeatures()    # Create plan + features + availability
├── updatePlanWithFeatures()    # Update all plan data
├── deletePlan()               # Delete plan and related data
├── getPlanForEdit()           # Load plan with full details
└── parseAvailabilityFromForm() # Convert form data to DB format
```

### **Data Flow**
1. **Form Input** → Validation → **Database Service** → **Supabase**
2. **Supabase** → **Database Service** → **UI Update** → **User Feedback**

## 📝 Usage Examples

### **Creating a New Plan**
1. Click "Nuevo Plan" button
2. Fill in basic information:
   - Name: "Internet 200MB Fibra"
   - Category: "Internet"
   - Price: 18000
3. Add features:
   - 🚀 "200 Mbps Bajada"
   - ⬆️ "100 Mbps Subida"
   - 📶 "WiFi Gratis"
4. Select availability:
   - ✅ Resistencia → Urbano
   - ✅ Fontana → Urbano
5. Click "Guardar"

### **Editing an Existing Plan**
1. Click the edit (✏️) button on any plan
2. Modify any field as needed
3. Add/remove features using the + and - buttons
4. Update availability checkboxes
5. Click "Guardar"

### **Searching Plans**
- Type in the search box to filter plans by:
  - Plan name
  - Category
  - Feature descriptions

## 🛠️ Technical Details

### **Database Operations**
- **CRUD Operations**: Full Create, Read, Update, Delete support
- **Transactions**: Atomic operations for complex updates
- **Cascade Deletes**: Related data automatically cleaned up
- **Error Handling**: Comprehensive error catching and user feedback

### **Form Validation**
- **Required Fields**: Name, category, and price are mandatory
- **Data Types**: Proper validation for numbers and text
- **Feature Validation**: At least one feature recommended
- **Availability**: Optional but recommended for plan visibility

### **Performance Features**
- **Lazy Loading**: Data loaded only when needed
- **Caching**: Localities and zone types cached after first load
- **Debounced Search**: Search optimized to reduce database calls
- **Loading States**: Visual feedback during operations

## 🔧 Configuration

### **Supabase Settings**
Make sure your `js/config.js` has the correct credentials:
```javascript
export const SUPABASE_CONFIG = {
  url: 'https://your-project.supabase.co',
  anonKey: 'your-anon-key'
}
```

### **Database Schema**
Ensure these tables exist in your Supabase database:
- `localities` (id, name)
- `zone_types` (id, name)
- `plans` (id, name, price, plan_category)
- `features` (id, plan_id, icon_name, description, sort_order)
- `plan_availability` (id, plan_id, locality_id, zone_type_id)

## 🚨 Troubleshooting

### **Common Issues**

#### **"Error de conexión" Status**
- ✅ Check Supabase URL and key in `js/config.js`
- ✅ Verify database schema is applied
- ✅ Check browser console for detailed errors

#### **"No hay planes disponibles"**
- ✅ Run the database seeding: http://localhost:8080/test-database-fixed.html
- ✅ Click "🌱 Seed Database" button
- ✅ Refresh the admin dashboard

#### **Features Not Saving**
- ✅ Ensure feature descriptions are not empty
- ✅ Check that plan was created successfully first
- ✅ Verify foreign key relationships in database

#### **Availability Not Working**
- ✅ Confirm localities and zone types exist in database
- ✅ Check checkbox IDs match database names (lowercase)
- ✅ Verify plan_availability table structure

### **Debug Mode**
Open browser console to see detailed logs:
- ✅ Connection status
- ✅ Database operations
- ✅ Error details
- ✅ Performance metrics

## 🔄 Migration from Static Dashboard

If you were using the original static dashboard:

1. **Backup**: Export any important plan data manually
2. **Switch**: Use `dashboard-db.html` instead of `dashboard.html`
3. **Seed**: Populate database with initial data
4. **Verify**: Test all functionality with real data
5. **Update Links**: Point admin login to new dashboard

## 🎯 Next Steps

### **Recommended Enhancements**
- 📊 Add analytics and reporting
- 🔐 Implement role-based permissions
- 📱 Add mobile-responsive design
- 🔄 Add bulk operations (import/export)
- 📧 Add email notifications for plan changes

### **Integration Points**
- Connect to main website plan display
- Add API endpoints for mobile apps
- Integrate with billing systems
- Add customer notification system

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify database connection at: http://localhost:8080/test-database-fixed.html
3. Review this guide for common solutions
4. Check Supabase dashboard for database issues

---

**🎉 You're all set!** The admin dashboard now provides full database integration for managing your telecommunications plans with a professional, user-friendly interface. 