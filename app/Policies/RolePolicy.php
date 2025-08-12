<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class RolePolicy
{
    use HandlesAuthorization;

    public function create(User $user): bool
    {
        return $user->isSuperAdmin();
    }

    public function assignRoles(User $user): bool
    {
        return $user->isAdmin() || $user->isSuperAdmin();
    }
}
