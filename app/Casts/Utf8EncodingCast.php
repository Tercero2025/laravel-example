<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class Utf8EncodingCast implements CastsAttributes
{
    /**
     * Cast the given value to UTF-8 encoding.
     *
     * @param  array<string, mixed>  $attributes
     */
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
            // Convertir desde la codificación detectada a UTF-8
            return mb_convert_encoding($value, 'UTF-8', $encoding);
        }

        // Si no se puede detectar, asumir Windows-1252 como fallback
        return mb_convert_encoding($value, 'UTF-8', 'Windows-1252');
    }

    /**
     * Prepare the given value for storage.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        if (is_null($value)) {
            return null;
        }

        // Si ya está en UTF-8 válido, devolverlo tal como está
        if (mb_check_encoding($value, 'UTF-8')) {
            return $value;
        }

        // Si no está en UTF-8, convertirlo
        return mb_convert_encoding($value, 'UTF-8', 'UTF-8');
    }
}
