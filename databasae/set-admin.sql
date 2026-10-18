-- ============================================
-- SET UP THE ADMIN ACCOUNT
-- Use this on a database you've ALREADY set up,
-- instead of re-importing the whole art_gallery.sql file.
--
-- Login after running this:
--   Email:    saifiaksam02@gmail.com
--   Password: Saifi@02
-- ============================================

USE art_gallery;

-- Remove any existing admin rows (including ones with
-- plain-text passwords from earlier testing)
DELETE FROM admins;

-- Insert the correct admin with a properly bcrypt-hashed password
INSERT INTO admins (name, email, password)
VALUES (
    'NewAdmin',
    'saifiaksam02@gmail.com',
    '$2b$10$NR3Wmu.y9enHRG0UqhB0NevrIk3OJSOfEXOuQYdgGLAO/c5spxcIi'
);

SELECT * FROM admins;
