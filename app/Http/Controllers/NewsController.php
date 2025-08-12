<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NewsController extends Controller
{
    private $apiKey;
    private $baseUrl;

    public function __construct()
    {
        $this->apiKey = env('APITUBE_API_KEY', '');
        $this->baseUrl = 'https://api.apitube.io/v1';
    }

    /**
     * Obtiene noticias desde la API de APITube.io
     */
    public function getNews(Request $request)
    {
        try {
            $params = [
                'api_key' => $this->apiKey,
                'per_page' => $request->get('per_page', 10),
            ];

            // Agregar parámetros opcionales si están presentes
            if ($request->has('title')) {
                $params['title'] = $request->get('title');
            }

            if ($request->has('category')) {
                $params['category'] = $request->get('category');
            }

            if ($request->has('country')) {
                $params['country'] = $request->get('country');
            }

            if ($request->has('language')) {
                $params['language'] = $request->get('language');
            }

            // Realizar la petición a la API
            $response = Http::timeout(30)->get("{$this->baseUrl}/news/everything", $params);

            if ($response->successful()) {
                return response()->json($response->json());
            } else {
                Log::error('Error en la API de APITube.io', [
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);

                return response()->json([
                    'error' => 'Error al obtener las noticias',
                    'message' => 'No se pudieron obtener las noticias en este momento'
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Excepción al obtener noticias de APITube.io', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Error interno del servidor',
                'message' => 'Ocurrió un error al procesar la solicitud'
            ], 500);
        }
    }

    /**
     * Obtiene noticias específicamente sobre temas rurales
     */
    public function getRuralNews(Request $request)
    {
        $request->merge(['title' => 'Rural']);
        return $this->getNews($request);
    }

    /**
     * Obtiene noticias por categoría
     */
    public function getNewsByCategory(Request $request, $category)
    {
        $request->merge(['category' => $category]);
        return $this->getNews($request);
    }
}
