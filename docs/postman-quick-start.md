# Instrucciones Rápidas para Postman - Endpoint de Clientes

## 🚀 Opción Más Sencilla: Usar Endpoints de Desarrollo

Para facilitar las pruebas, se han creado endpoints temporales que **NO requieren autenticación**:

### Endpoints disponibles sin autenticación:

1. **Test de API**
   ```
   GET {{base_url}}/api/test
   ```

2. **Listar todos los clientes**
   ```
   GET {{base_url}}/api/clients-dev
   ```

3. **Buscar cliente por CUIT**
   ```
   GET {{base_url}}/api/clients-dev/{cuit}
   ```
   Ejemplo: `GET http://localhost:8000/api/clients-dev/12345678901`

### Configuración básica en Postman:

1. **Crear variable de entorno**:
   - `base_url`: `http://localhost:8000` (o tu URL de desarrollo)

2. **Headers mínimos**:
   ```
   Accept: application/json
   Content-Type: application/json
   ```

### Ejemplo de respuesta exitosa:

```json
{
  "status": "success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "cuit": "12345678901",
        "razonsocial": "Empresa Ejemplo S.A.",
        "domicilio": "Av. Ejemplo 123",
        "localidad": "Ciudad Ejemplo",
        "telefono": "11-1234-5678",
        "mail": "contacto@ejemplo.com"
      }
    ],
    "total": 1
  },
  "message": "Clientes obtenidos correctamente"
}
```

---

## 🔐 Opción Completa: Usar Autenticación de Sesión

Si necesitas usar los endpoints oficiales con autenticación, sigue estos pasos:

### Configuración de variables en Postman:

```
base_url: http://localhost:8000
user_email: tu_email@ejemplo.com
user_password: tu_contraseña
csrf_token: [se obtiene automáticamente]
```

### Secuencia de peticiones:

#### 1. Obtener CSRF Token
```
GET {{base_url}}/login
```

**Script en Tests**:
```javascript
var responseBody = pm.response.text();
var csrfToken = responseBody.match(/name="csrf-token" content="([^"]+)"/);
if (csrfToken) {
    pm.collectionVariables.set("csrf_token", csrfToken[1]);
}
```

#### 2. Realizar Login
```
POST {{base_url}}/login
Content-Type: application/x-www-form-urlencoded

Body (x-www-form-urlencoded):
email: {{user_email}}
password: {{user_password}}
_token: {{csrf_token}}
```

#### 3. Consultar Clientes
```
GET {{base_url}}/clients
Headers:
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: {{csrf_token}}
X-Request-Filter: other
Accept: application/json
```

---

## 📋 Colección de Postman

Importa la colección incluida en el proyecto:
```
docs/postman-collection-sellados-clientes.json
```

Esta colección incluye:
- ✅ Variables pre-configuradas
- ✅ Scripts automáticos para CSRF
- ✅ Ejemplos de todas las peticiones
- ✅ Tests de verificación

---

## 🛠️ Troubleshooting

### Error 419 - CSRF Token Mismatch
- Asegúrate de obtener el token CSRF antes del login
- Verifica que las cookies se estén enviando automáticamente
- Habilita "Update cookies automatically" en Postman

### Error 401 - Unauthorized
- Verifica que el login haya sido exitoso (código 302)
- Asegúrate de incluir `X-CSRF-TOKEN` en los headers
- Verifica que las cookies de sesión se mantengan

### Error 500 en rutas API con Sanctum
- Las rutas `/api/clients/{cuit}` requieren Sanctum instalado
- Usa los endpoints `-dev` como alternativa temporal

### No hay datos en la respuesta
- Verifica que hay clientes en la base de datos
- Ejecuta las migraciones y seeders si es necesario

---

## 🔧 Scripts útiles para Postman

### Extraer CSRF Token automáticamente:
```javascript
// En Pre-request Script
pm.sendRequest({
    url: pm.environment.get("base_url") + "/login",
    method: 'GET'
}, function (err, res) {
    if (!err) {
        var token = res.text().match(/name="csrf-token" content="([^"]+)"/);
        if (token) {
            pm.environment.set("csrf_token", token[1]);
        }
    }
});
```

### Validar respuesta JSON:
```javascript
// En Tests
pm.test("Response is JSON", function () {
    pm.response.to.be.json;
});

pm.test("Has success status", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.status).to.eql("success");
});
```

---

## 📝 Notas importantes

- ⚠️ Los endpoints `-dev` son solo para desarrollo y deben eliminarse en producción
- 🔒 En producción, usa siempre autenticación apropiada
- 🍪 Laravel maneja automáticamente las cookies de sesión
- 🛡️ La protección CSRF es esencial para seguridad web
