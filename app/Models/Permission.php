<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Permission extends Model
{
    protected $fillable = [
        'name',
        'endpoint_group_id',
        'action',
        'sub_path',
        'allowed_methods',
        'description',
        // Mantener compatibilidad
        'endpoint',
        'method'
    ];

    protected $casts = [
        'allowed_methods' => 'array',
    ];

    /**
     * Relación con roles
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_permission');
    }

    /**
     * Relación con grupo de endpoints
     */
    public function endpointGroup(): BelongsTo
    {
        return $this->belongsTo(EndpointGroup::class);
    }

    /**
     * Obtener la URL completa del endpoint
     */
    public function getFullEndpointAttribute(): string
    {
        if ($this->endpointGroup) {
            $basePath = rtrim($this->endpointGroup->base_path, '/');
            $subPath = $this->sub_path ? '/' . ltrim($this->sub_path, '/') : '';
            return $basePath . $subPath;
        }
        
        // Fallback para compatibilidad
        return $this->endpoint ?? '';
    }

    /**
     * Verificar si el permiso permite un método específico
     */
    public function allowsMethod(string $method): bool
    {
        if ($this->allowed_methods) {
            return in_array(strtoupper($method), $this->allowed_methods);
        }
        
        // Fallback para compatibilidad
        return strtoupper($this->method) === strtoupper($method);
    }

    /**
     * Scope para permisos de una acción específica
     */
    public function scopeByAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    /**
     * Scope para permisos de un grupo específico
     */
    public function scopeByGroup($query, $groupId)
    {
        return $query->where('endpoint_group_id', $groupId);
    }
}
