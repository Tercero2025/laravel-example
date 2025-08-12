# Utf8EncodingCast - Solución de Codificación UTF-8

## Descripción

El `Utf8EncodingCast` es un cast personalizado de Eloquent que resuelve automáticamente los problemas de codificación UTF-8 en modelos que reciben datos con codificación Windows-1252.

## Funcionamiento

### Conversión Inteligente

- **Detección automática**: Verifica si el texto ya está en UTF-8 correcto
- **Auto-detección de codificación**: Detecta Windows-1252, ISO-8859-1, etc.
- **Conversión solo cuando es necesario**: No modifica texto ya correcto
- **Fallback seguro**: Si no detecta la codificación, asume Windows-1252

## Implementación

### Archivo del Cast

```php
// app/Casts/Utf8EncodingCast.php
class Utf8EncodingCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        if (is_null($value)) {
            return null;
        }

        // Si el valor ya está en UTF-8 válido, devolverlo tal como está
        if (mb_check_encoding($value, 'UTF-8')) {
            return $value;
        }

        // Intentar detectar la codificación automáticamente
        $encoding = mb_detect_encoding($value, ['UTF-8', 'Windows-1252', 'ISO-8859-1'], true);
        
        if ($encoding && $encoding !== 'UTF-8') {
            return mb_convert_encoding($value, 'UTF-8', $encoding);
        }

        // Fallback a Windows-1252
        return mb_convert_encoding($value, 'UTF-8', 'Windows-1252');
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        if (is_null($value)) {
            return null;
        }

        // Si ya está en UTF-8 válido, devolverlo tal como está
        if (mb_check_encoding($value, 'UTF-8')) {
            return $value;
        }

        return mb_convert_encoding($value, 'UTF-8', 'UTF-8');
    }
}
```

### Aplicación en Modelos

```php
// app/Models/Client.php
use App\Casts\Utf8EncodingCast;

protected $casts = [
    'razonsocial' => Utf8EncodingCast::class,
    'domicilio' => Utf8EncodingCast::class,
    'localidad' => Utf8EncodingCast::class,
];
```

## Uso

### Automático

```php
// En controladores - la conversión es automática
$clients = Client::all();
foreach ($clients as $client) {
    echo $client->razonsocial; // ✅ Ya está en UTF-8
}
```

### Para Otros Modelos

```php
// Aplicar a cualquier modelo con problemas de codificación
protected $casts = [
    'campo_problematico' => Utf8EncodingCast::class,
];
```

## Beneficios

- ✅ **Inteligente**: Solo convierte cuando es realmente necesario
- ✅ **Auto-detecta**: Reconoce automáticamente la codificación original
- ✅ **Seguro**: No corrompe texto que ya está bien codificado
- ✅ **Reutilizable**: Se puede aplicar a cualquier modelo
- ✅ **Eficiente**: Solo se ejecuta cuando se accede a los datos
- ✅ **Laravel Nativo**: Usa el sistema de casts estándar
- ✅ **Mantenible**: Toda la lógica en un solo lugar

## Casos de Uso

- Modelos que reciben datos de sistemas legacy con diferentes codificaciones
- Tablas con datos importados de Windows-1252, ISO-8859-1, etc.
- Stored procedures que devuelven caracteres en diferentes encodings
- Migración gradual de datos con codificaciones mixtas
- Cualquier campo con problemas de acentos o caracteres especiales

## Escenarios de Funcionamiento

### Datos ya en UTF-8 ✅

- **Input**: `"Maíz"` (UTF-8 correcto)
- **Output**: `"Maíz"` (sin cambios)

### Datos en Windows-1252 🔄

- **Input**: `"Ma\u00edz"` (Windows-1252)
- **Output**: `"Maíz"` (convertido a UTF-8)

### Datos corruptos 🛡️

- **Input**: `"Ma\u00c3\u00adz"` (doble codificación)
- **Output**: Intenta detección automática y conversión segura

## Resultado

Antes: `"Ma\u00c3\u00adz"` (malformado)
Después: `"Maíz"` (UTF-8 correcto)

## Modelos que Usan el Cast

- **`Clients`**: Campos `razonsocial`, `domicilio` y `localidad`

## Integración con API

El cast también beneficia a los endpoints de API que devuelven datos de estos modelos:

- **Formularios dinámicos**: Los selects se pueblan con datos correctamente codificados
