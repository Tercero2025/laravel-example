# Guía para consultar el endpoint de clientes desde Postman

## Resumen del Problema

El proyecto **sellados-web** utiliza Laravel con autenticación basada en sesiones y protección CSRF. Para consultar el endpoint de clientes desde Postman, necesitas manejar la autenticación de sesión y obtener el token CSRF necesario.

## Endpoints Disponibles

### Rutas Web (requieren autenticación de sesión)
- `GET /clients` - Lista de clientes (vista web)
- `POST /clients` - Crear cliente
- `GET /clients/{client}` - Ver cliente específico
- `PUT /clients/{client}` - Actualizar cliente
- `DELETE /clients/{client}` - Eliminar cliente

### Rutas API (requieren auth:sanctum - actualmente no funcional)
- `GET /api/clients/{cuit}` - Obtener cliente por CUIT

## Problema Actual con la API

El proyecto tiene configuradas rutas API con `auth:sanctum`, pero **Laravel Sanctum no está instalado** en el proyecto (no aparece en composer.json). Esto significa que las rutas API actualmente no funcionarán.

## Solución Recomendada: Usar rutas Web con autenticación de sesión

### Paso 1: Configurar Postman para manejar cookies de sesión

1. En Postman, crea una nueva colección
2. Ve a la pestaña **Settings** de la colección
3. Habilita **"Automatically follow redirects"**
4. Habilita **"Update cookies automatically"**

### Paso 2: Realizar Login y obtener cookies de sesión

1. **GET** - Obtener la página de login para generar la sesión inicial:
```
GET {{base_url}}/login
```

2. **Extraer el token CSRF** de la respuesta HTML:
   - En la respuesta, busca el meta tag: `<meta name="csrf-token" content="TOKEN_AQUI">`
   - O busca un input hidden: `<input type="hidden" name="_token" value="TOKEN_AQUI">`

3. **POST** - Realizar login:
```
POST {{base_url}}/login
Content-Type: application/x-www-form-urlencoded

email={{user_email}}&password={{user_password}}&_token={{csrf_token}}
```

### Paso 3: Consultar el endpoint de clientes

Una vez autenticado, puedes hacer peticiones a los endpoints de clientes:

```
GET {{base_url}}/clients
Headers:
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: {{csrf_token}}
Cookie: [se maneja automáticamente por Postman]
```

Para obtener datos JSON en lugar de la vista HTML, puedes agregar el header:
```
X-Request-Filter: other
```

## Variables de Postman sugeridas

Crea estas variables en tu colección de Postman:

```
base_url: http://localhost:8000 (o tu URL de desarrollo)
user_email: tu_email@ejemplo.com
user_password: tu_contraseña
csrf_token: [se obtiene dinámicamente]
```

## Script para automatizar la obtención del token CSRF

En el **Pre-request Script** de tu petición de login, puedes agregar:

```javascript
pm.sendRequest({
    url: pm.environment.get("base_url") + "/login",
    method: 'GET'
}, function (err, res) {
    if (err) {
        console.log(err);
    } else {
        var responseBody = res.text();
        var csrfToken = responseBody.match(/name="csrf-token" content="([^"]+)"/);
        if (csrfToken) {
            pm.environment.set("csrf_token", csrfToken[1]);
        }
    }
});
```

En el **Tests** de tu petición de login, agrega:

```javascript
// Verificar que el login fue exitoso
pm.test("Login successful", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 302]);
});

// Extraer CSRF token si está en la respuesta
var responseBody = pm.response.text();
var csrfToken = responseBody.match(/name="csrf-token" content="([^"]+)"/);
if (csrfToken) {
    pm.environment.set("csrf_token", csrfToken[1]);
}
```

## Alternativa: Implementar API sin CSRF

Si prefieres una API más tradicional, puedes:

1. **Instalar Laravel Sanctum**:
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

2. **Configurar Sanctum** en `config/sanctum.php`

3. **Crear tokens de API** para los usuarios

4. **Usar Bearer tokens** en lugar de cookies de sesión

## Endpoint de prueba alternativo

Como alternativa temporal, puedes modificar las rutas de clientes para que funcionen sin CSRF en ciertas condiciones (solo para desarrollo):

```php
// En routes/api.php (sin middleware auth:sanctum por ahora)
Route::get('/clients/test/{cuit}', [ClientController::class, 'getClientByCuit']);
```

Esto te permitiría probar el endpoint sin autenticación mientras implementas la solución completa.

## Notas importantes

1. **Seguridad**: La protección CSRF es importante para producción
2. **Cookies**: Laravel maneja automáticamente las cookies de sesión
3. **Headers**: Siempre incluye `X-Requested-With: XMLHttpRequest` para requests AJAX
4. **CORS**: Si haces requests desde otro dominio, necesitarás configurar CORS

## Ejemplo de petición completa en Postman

```
Method: GET
URL: {{base_url}}/clients
Headers:
  X-Requested-With: XMLHttpRequest
  X-CSRF-TOKEN: {{csrf_token}}
  X-Request-Filter: other
  Accept: application/json
  Content-Type: application/json
```

Esta configuración debería permitirte consultar exitosamente el endpoint de clientes desde Postman.
