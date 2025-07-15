<?php

namespace App\Http\Controllers;

use App\Models\Clients;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('clients/index', [
            'clients' => Clients::all()
        ]);
    }

    public function indexmobile()
    {
        return Clients::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('clients/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'fullname' => 'required|string|max:255',
            'cuit' => 'required|string|unique:clients,cuit',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
        ]);

        $validated['user_id'] = Auth::id();
        Clients::create($validated);

        return redirect()->route('clients.index')
            ->with('message', 'Client created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Clients $client)
    {
        return Inertia::render('clients/show', [
            'client' => $client
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Clients $client)
    {
        return Inertia::render('clients/edit', [
            'client' => $client
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Clients $client)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'fullname' => 'required|string|max:255',
            'cuit' => 'required|string|unique:clients,cuit,' . $client->id,
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
        ]);

        $client->update($validated);

        return redirect()->route('clients.index')
            ->with('message', 'Client updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Clients $client)
    {
        $client->delete();

        return redirect()->route('clients.index')
            ->with('message', 'Client deleted successfully.');
    }
}
