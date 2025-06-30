// Script pour créer un utilisateur admin
// Exécutez ce script une fois pour créer votre compte admin

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL'; // Remplacez par votre URL Supabase
const supabaseServiceKey = 'YOUR_SUPABASE_SERVICE_ROLE_KEY'; // Remplacez par votre clé service role

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // 1. Create the user in auth.users
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@clicklone.com',
      password: 'admin123',
      email_confirm: true
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return;
    }

    console.log('Auth user created:', authData.user.id);

    // 2. Create/update the profile with admin role
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        role: 'admin'
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      return;
    }

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@clicklone.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createAdminUser();