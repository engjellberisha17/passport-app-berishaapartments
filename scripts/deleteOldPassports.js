// deleteOldPassports.js
import { supabase } from './lib/supabaseClient';

async function deleteOldPassports() {
  try {
    // 1. Calculate date 30 days ago
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - 30);

    // 2. Fetch rows older than 30 days
    const { data: oldPassports, error: fetchError } = await supabase
      .from('passports')
      .select('id, photo_url')
      .lt('created_at', dateThreshold.toISOString());

    if (fetchError) throw fetchError;

    if (!oldPassports || oldPassports.length === 0) {
      console.log('No old passports to delete.');
      return;
    }

    // 3. Delete photos from storage
    for (const passport of oldPassports) {
      const filePath = passport.photo_url.split('/storage/v1/object/public/')[1];
      if (filePath) {
        const { error: delError } = await supabase.storage
          .from('passport-photos')
          .remove([filePath]);
        if (delError) console.error('Error deleting photo:', delError);
      }
    }

    // 4. Delete rows from table
    const { error: dbError } = await supabase
      .from('passports')
      .delete()
      .lt('created_at', dateThreshold.toISOString());

    if (dbError) throw dbError;

    console.log(`Deleted ${oldPassports.length} old passport records.`);
  } catch (err) {
    console.error('Error in deleteOldPassports:', err);
  }
}

// Run script
deleteOldPassports();
