<?php

namespace App\Models;

use App\Casts\Utf8EncodingCast;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Clients extends Model
{
    use SoftDeletes;

    protected $table = 'clientes';
    protected $primaryKey = 'cuit';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = true;

    protected $fillable = [
        'razonsocial',
        'cuit',
        'domicilio',
        'localidad',
        'telefono',
        'mail',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'razonsocial' => Utf8EncodingCast::class,
        'domicilio' => Utf8EncodingCast::class,
        'localidad' => Utf8EncodingCast::class,
    ];

    protected $dates = ['deleted_at', 'created_at', 'updated_at'];
}
