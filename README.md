# Art Gallery — Setup Guide

## What changed in this version

- **Fixed the sort & price filter bug** on the gallery page — search, category,
  price range and sort now all work together correctly (`client/js/viewer.js`
  was rewritten; the old code had two conflicting filter systems and a typo'd
  variable name that made the price filter silently do nothing).
- **Added a real Admin Login** — this didn't exist before (the old
  `admin.js` had `checkAdminAccess() { return true; }` as a placeholder).
  There's now a proper login page, a bcrypt + session-based backend, and the
  dashboard is gated behind it.
- **Fixed `admin/dashboard.html`**, which was an accidental copy of the
  artist dashboard (wrong title, wrong stats, wrong script).
- **New homepage** (`client/index.html`) with three entry points: Admin
  Login, Artist Login, and the public Viewer Gallery.
- **New visual theme** (`client/css/style.css`) — gradient hero banner,
  grid-based artwork cards with hover effects, consistent navbar across
  pages.

## 1. Install dependencies

```bash
npm install
```

## 2. Set up the database

Import the SQL file (this now also seeds a default admin account):

```bash
mysql -u root -p < databasae/art_gallery.sql
```

Update `.env` with your own MySQL credentials if needed:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=art_gallery
DB_PORT=3306
PORT=5000
SESSION_SECRET=change_this_to_something_random
```

> **Security note:** the `.env` file included here still has the DB
> password from your original project and a simple session secret.
> Change both before deploying anywhere public, and never commit `.env`
> to a public repo.

## 3. Default admin login

```
Email:    saifiaksam02@gmail.com
Password: Saifi@02
```

This is seeded automatically if you import the full `art_gallery.sql` file
on a fresh database.

**Already have a database set up and just want to fix/add the admin
without re-importing everything?** Run `databasae/set-admin.sql` instead —
it clears out any existing admin rows (including ones with plain-text
passwords left over from manual testing) and inserts this one correctly:

```bash
mysql -u root -p art_gallery < databasae/set-admin.sql
```

or just open and run it in MySQL Workbench.

There's no "change password" UI yet, so to change it later, generate a new
bcrypt hash and update the `admins` table directly — see the "Changing the
admin password" section below.

### Changing the admin password later

1. Create a file `hash.js` in the project root:
   ```js
   const bcrypt = require("bcrypt");
   const password = "YourNewPassword"; // set your password here
   bcrypt.hash(password, 10).then(hash => console.log(hash));
   ```
2. Run `node hash.js` and copy the printed hash.
3. In MySQL:
   ```sql
   UPDATE admins SET password = 'PASTE_THE_HASH_HERE' WHERE email = 'saifiaksam02@gmail.com';
   ```
4. Delete `hash.js` afterward.

**Important:** the `password` column must always hold a bcrypt hash, never
the plain password — the login compares hashes, so a plain-text value will
never match and login will fail.

## 4. Run the server

```bash
npm start
```

Then open **http://localhost:5000** — that's the new homepage with the
three login/entry sections.

## Project structure (unchanged)

- `client/` — static frontend (index, admin, artist, viewer)
- `server/` — Express backend (routes, controllers, config)
- `databasae/art_gallery.sql` — schema + seed data

## Notes on scope

I focused this pass on: the filter/sort bug, the homepage with three
sections, admin login (which was missing), and the overall visual design
of the public-facing pages (homepage, gallery, artwork details, enquiry,
login pages). The artist dashboard's upload/edit/enquiries workflows were
left functionally as they were — only their stylesheet link was added for
visual consistency — since they weren't reported as broken.
