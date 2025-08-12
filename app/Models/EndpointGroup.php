<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EndpointGroup extends Model
{
    protected $fillable = [
        'name',
        'base_path',
        'display_name',
        'description',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Relación con permisos
     */
    public function permissions(): HasMany
    {
        return $this->hasMany(Permission::class);
    }

    /**
     * Scope para grupos activos
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Obtener la URL completa del endpoint
     */
    public function getFullPathAttribute(): string
    {
        return rtrim($this->base_path, '/');
    }

    /**
     * Obtener permisos agrupados por acción
     */
    public function getPermissionsByAction()
    {
        return $this->permissions()
            ->select('action', 'sub_path', 'allowed_methods', 'name', 'description')
            ->get()
            ->groupBy('action');
    }
}
