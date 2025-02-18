-- Clean up user profiles first (due to foreign key constraints)
DELETE FROM user_profiles;

-- Clean up auth.users
DELETE FROM auth.users; 