-- ============================================
-- ART GALLERY DATABASE
-- ============================================

CREATE DATABASE IF NOT EXISTS art_gallery;

USE art_gallery;


-- ============================================
-- ARTISTS TABLE
-- ============================================

CREATE TABLE artists (
    artist_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    instagram VARCHAR(150),
    location VARCHAR(150),
    bio TEXT,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- CATEGORIES TABLE
-- ============================================

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);


-- ============================================
-- ARTWORKS TABLE
-- ============================================

CREATE TABLE artworks (
    artwork_id INT AUTO_INCREMENT PRIMARY KEY,

    artist_id INT NOT NULL,
    category_id INT,

    title VARCHAR(200) NOT NULL,
    image VARCHAR(255) NOT NULL,

    price DECIMAL(10,2),

    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    medium VARCHAR(100),
    dimensions VARCHAR(100),

    description TEXT,
    location VARCHAR(150),

    availability ENUM('Available', 'Sold')
        DEFAULT 'Available',

    featured BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (artist_id)
        REFERENCES artists(artist_id)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE SET NULL
);


-- ============================================
-- ADMINS TABLE
-- ============================================

CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- DEFAULT ADMIN ACCOUNT
-- ============================================
-- Login: saifiaksam02@gmail.com / Saifi@02
-- (password is bcrypt-hashed below — change it any time via SQL)

INSERT INTO admins (name, email, password)
VALUES (
    'NewAdmin',
    'saifiaksam02@gmail.com',
    '$2b$10$NR3Wmu.y9enHRG0UqhB0NevrIk3OJSOfEXOuQYdgGLAO/c5spxcIi'
);


-- ============================================
-- DEFAULT CATEGORIES
-- ============================================

INSERT INTO categories (category_name)
VALUES
('Painting'),
('Sketch'),
('Digital Art'),
('Portrait'),
('Landscape'),
('Abstract'),
('Handmade');