<?php

namespace App\Http\Controllers;

use App\Models\Clients;

class ApiTestController extends Controller
{
    /**
     * Test simple para verificar que podemos devolver JSON
     */
    public function test()
    {
        return response()->json([
            'status' => 'success',
            'message' => 'La API está funcionando correctamente',
            'timestamp' => now()->toDateTimeString(),
        ]);
    }

    /**
     * Método temporal para consultar clientes sin autenticación (solo para desarrollo)
     */
    public function getClients()
    {
        try {
            $clients = Clients::select('cuit', 'razonsocial', 'domicilio', 'localidad', 'telefono', 'mail')
                ->orderBy('razonsocial', 'asc')
                ->paginate(10);

            return response()->json([
                'status' => 'success',
                'data' => $clients,
                'message' => 'Clientes obtenidos correctamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener clientes: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }

    /**
     * Método temporal para obtener cliente por CUIT sin autenticación (solo para desarrollo)
     */
    public function getClientByCuit($cuit)
    {
        try {
            $client = Clients::where('cuit', $cuit)->first();
            
            if (!$client) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cliente no encontrado',
                    'data' => null
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => [
                    'cuit' => $client->cuit,
                    'razonsocial' => $client->razonsocial,
                    'domicilio' => $client->domicilio,
                    'localidad' => $client->localidad,
                    'telefono' => $client->telefono,
                    'mail' => $client->mail,
                ],
                'message' => 'Cliente obtenido correctamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener cliente: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }
}
