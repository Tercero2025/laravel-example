# PHP Laravel Base

Repositorio para hacer un test de conexion con Supabase

## Pasos para iniciar

*`composer install`

*`npm install`

*`npm run build`

*`php artisan migrate`

*`php artisan db:seed`

*`composer devl - Para Linux o Mac`

*`composer devw - Para Windows`

## Para conectarse con Supabase (Postgress)

Debe cambiar en el archivo .env las siguientes lineas, el DB_URL lo obtienen cuando hacen click en Connect por si no lo copian cuando crean el proyecto en supabase, tener en cuenta que no pueden usar PATCH no esta soportado, solo PUT para actualizar, todo lo relacionado con CRUD, lo tienen en CLIENTS (Model, Controller, Route, Views (Pages), Print to PDF (con blade), etc).

DB_CONNECTION=pgsql

DB_URL=postgres://postgres.xxxx:password@xxxx.pooler.supabase.com:5432/postgres

La documentacion [Docu](https://supabase.com/docs/guides/getting-started/quickstarts/laravel)

# Role and Permission Management System

## Project Structure

The project is organized into three main modules:

### 1. Roles Management

- Basic CRUD operations for roles
- Located in `/resources/js/pages/roles/`
- Routes defined in `/routes/roles.php`
- Handles role creation, editing, and deletion

### 2. Permissions Management

- Basic CRUD operations for permissions
- Located in `/resources/js/pages/permissions/`
- Routes defined in `/routes/permissions.php`
- Manages HTTP method permissions and endpoints

### 3. Role-Permissions Management

- Dedicated interface for managing role permissions
- Located in `/resources/js/pages/roles-permissions/`
- Routes defined in `/routes/roles-permissions.php`
- Allows assigning/removing permissions from roles

## Routes Structure

### Web Routes

-`/roles/*` - Role management

-`/permissions/*` - Permission management

-`/roles-permissions/*` - Role-Permission relationships

### API Routes

-`POST /roles` - Create new role

-`PUT /roles/{role}` - Update role

-`DELETE /roles/{role}` - Delete role

-`POST /permissions` - Create permission

-`PUT /permissions/{permission}` - Update permission

-`DELETE /permissions/{permission}` - Delete permission

-`PUT /roles-permissions/{role}` - Update role permissions

## Authorization

Access control is managed through middleware:

-`can:create,App\Models\Role` - Superadmin only

-`can:assignRoles,App\Models\Role` - Admin and Superadmin

## Commit Description

```bash

gitadd.

gitcommit-m"feat: Implement Role and Permission Management System


- Add CRUD operations for roles and permissions

- Create dedicated role-permissions management interface

- Implement authorization middleware for access control

- Organize routes into separate files for better maintainability

- Add React components for all management interfaces

- Remove Ziggy dependency in favor of direct URLs"

```

## Next Steps

1. Add validation messages
2. Implement error handling
3. Add success notifications
4. Enhance UI/UX with loading states
5. Add unit tests
