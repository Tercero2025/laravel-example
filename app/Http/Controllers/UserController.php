<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Búsqueda por nombre o email
        $search = $request->input('search', '');
        
        // Excluir el usuario superadmin de la lista
        $query = User::with('role')
            ->where('is_superadmin', false);
            
        // Aplicar búsqueda si se proporciona
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        // Paginar los resultados
        $users = $query->paginate(10)
            ->withQueryString();
        
        return Inertia::render('users/index', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roles = Role::all();
        
        return Inertia::render('users/create', [
            'roles' => $roles
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', Password::defaults()],
            'role_id' => 'required|exists:roles,id',
        ]);
        
        $validated['password'] = Hash::make($validated['password']);
        // Asegurar que nunca se creen nuevos superadmins
        $validated['is_superadmin'] = false;
        
        User::create($validated);
        
        return redirect()->route('users.index')
            ->with('message', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $user->load('role');
        
        return Inertia::render('users/show', [
            'user' => $user
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $roles = Role::all();
        
        return Inertia::render('users/edit', [
            'user' => $user,
            'roles' => $roles
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        // Prevenir la edición del usuario superadmin
        if ($user->is_superadmin) {
            return redirect()->route('users.index')
                ->with('error', 'The super admin user cannot be edited.');
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', Password::defaults()],
            'role_id' => 'required|exists:roles,id',
        ]);
        
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }
        
        // Asegurarse que el estado de superadmin no cambie
        // No necesitamos incluir is_superadmin ya que no permitimos modificarlo
        
        $user->update($validated);
        
        return redirect()->route('users.index')
            ->with('message', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Prevent deleting the superadmin
        if ($user->is_superadmin) {
            return redirect()->route('users.index')
                ->with('error', 'The super admin user cannot be deleted.');
        }
        
        // Prevent deleting yourself
        if ($user->id === request()->user()->id) {
            return redirect()->route('users.index')
                ->with('error', 'You cannot delete your own account.');
        }
        
        $user->delete();
        
        return redirect()->route('users.index')
            ->with('message', 'User deleted successfully.');
    }
}
