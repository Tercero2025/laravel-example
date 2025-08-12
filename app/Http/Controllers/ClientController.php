<?php

namespace App\Http\Controllers;

use App\Models\Clients;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filter = $request->header('X-Request-Filter');

        $search = $request->input('search');

        $query = Clients::orderBy('razonsocial', 'asc');

        if ($search) {
            $query->where('razonsocial', 'like', "%{$search}%");
        }

        if ($filter == 'other') {
            return response()->json([
                'success' => true,
                'data' => $query->paginate(10)->appends(['search' => $search]),
                'message' => 'Clients fetched successfully'
            ]);
        } else {
            return Inertia::render('clients/index', [
                'clients' => $query->paginate(10)->appends(['search' => $search])
            ]);
        }
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
            'cuit' => 'required|string|max:11|unique:clientes,cuit',
            'razonsocial' => 'required|string|max:50|unique:clientes,razonsocial',
            'domicilio' => 'nullable|string|max:50',
            'localidad' => 'nullable|string|max:45',
            'telefono' => 'nullable|string|max:15',
            'mail' => 'nullable|string|max:45',
        ]);

        Clients::create($validated);

        return redirect()->route('clients.index')
            ->with('message', 'Cliente creado correctamente.');
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
        // Validación con reglas unique que excluyen el registro actual
        // La sintaxis es: unique:tabla,columna,valor_a_ignorar,columna_para_ignorar
        // Usamos cuit como columna_para_ignorar ya que es la clave primaria
        $validated = $request->validate([
            'cuit' => 'required|string|max:11|unique:clientes,cuit,' . $client->cuit . ',cuit',
            'razonsocial' => 'required|string|max:50|unique:clientes,razonsocial,' . $client->cuit . ',cuit',
            'domicilio' => 'nullable|string|max:50',
            'localidad' => 'nullable|string|max:45',
            'telefono' => 'nullable|string|max:15',
            'mail' => 'nullable|string|max:45',
        ]);

        $client->update($validated);

        return redirect()->route('clients.index')
            ->with('message', 'Cliente actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Clients $client)
    {
        $client->delete();

        return redirect()->route('clients.index')
            ->with('message', 'Cliente eliminado correctamente.');
    }

    /**
     * API method to get client data by CUIT.
     */
    public function getClientByCuit($cuit)
    {
        try {
            $client = Clients::where('cuit', $cuit)->first();

            if (!$client) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cliente no encontrado',
                    'data' => null
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'cuit' => $client->cuit,
                    'razonsocial' => $client->razonsocial,
                    'domicilio' => $client->domicilio,
                    'localidad' => $client->localidad,
                    'telefono' => $client->telefono,
                    'mail' => $client->mail,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener datos del cliente: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }
}
