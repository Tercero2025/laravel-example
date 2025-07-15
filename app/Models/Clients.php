<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Clients extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'fullname',
        'cuit',
        'address',
        'city',
        'state',
        'country',
    ];

    protected $dates = ['deleted_at'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
