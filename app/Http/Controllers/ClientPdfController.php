<?php

namespace App\Http\Controllers;

use App\Models\Clients;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\View;

class ClientPdfController extends Controller
{
    public function generate()
    {
        // Aumentar límite de memoria y tiempo de ejecución
        ini_set('memory_limit', '512M');
        set_time_limit(300); // 5 minutos
        
        // Obtener el total de clientes primero
        $totalClients = Clients::count();
        
        // Si hay muchos clientes, procesar en chunks para optimizar memoria
        if ($totalClients > 1000) {
            $clients = collect();
            
            Clients::orderBy('razonsocial', 'asc')
                ->select(['razonsocial', 'domicilio', 'telefono', 'localidad'])
                ->chunk(500, function ($chunk) use (&$clients) {
                    $clients = $clients->merge($chunk);
                });
        } else {
            $clients = Clients::orderBy('razonsocial', 'asc')->get(['razonsocial', 'domicilio', 'telefono', 'localidad']);
        }

        $html = View::make('pdf.clients', [
            'clients' => $clients,
            'totalClients' => $totalClients,
        ])->render();

        // Liberar memoria de la colección de clientes
        unset($clients);

        $pdf = PDF::loadHTML($html);
        $pdf->setPaper('a4', 'landscape');
        $pdf->setOptions([
            'defaultFont' => 'sans-serif',
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
            'margin_top' => 10,
            'margin_bottom' => 10,
            'margin_left' => 10,
            'margin_right' => 10
        ]);

        // Liberar memoria del HTML
        unset($html);

        return $pdf->stream('listado-clientes.pdf');
    }

    /**
     * Generar PDF con paginación para datasets muy grandes
     */
    public function generatePaginated($page = 1, $perPage = 100)
    {
        // Aumentar límite de memoria y tiempo de ejecución
        ini_set('memory_limit', '512M');
        set_time_limit(300);
        
        $totalClients = Clients::count();
        $totalPages = ceil($totalClients / $perPage);
        
        $clients = Clients::orderBy('razonsocial', 'asc')
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get(['razonsocial', 'domicilio', 'telefono', 'localidad']);

        $html = View::make('pdf.clients-paginated', [
            'clients' => $clients,
            'totalClients' => $totalClients,
            'currentPage' => $page,
            'totalPages' => $totalPages,
            'perPage' => $perPage,
        ])->render();

        unset($clients);

        $pdf = PDF::loadHTML($html);
        $pdf->setPaper('a4', 'landscape');
        $pdf->setOptions([
            'defaultFont' => 'sans-serif',
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
            'margin_top' => 10,
            'margin_bottom' => 10,
            'margin_left' => 10,
            'margin_right' => 10
        ]);

        unset($html);

        $filename = "listado-clientes-pagina-{$page}-de-{$totalPages}.pdf";
        return $pdf->stream($filename);
    }

    /**
     * Generar PDF optimizado para memoria con procesamiento en chunks
     */
    public function generateOptimized()
    {
        // Configuración de memoria más agresiva
        ini_set('memory_limit', '1G');
        set_time_limit(600); // 10 minutos
        
        $totalClients = Clients::count();
        
        // Para datasets grandes, usar una aproximación diferente
        if ($totalClients > 2000) {
            // Procesar en chunks más pequeños
            $allClients = [];
            $chunkSize = 200; // Chunks más pequeños
            
            Clients::orderBy('razonsocial', 'asc')
                ->select(['razonsocial', 'domicilio', 'telefono', 'localidad'])
                ->chunk($chunkSize, function ($chunk) use (&$allClients) {
                    foreach ($chunk as $client) {
                        $allClients[] = [
                            'razonsocial' => $client->razonsocial,
                            'domicilio' => $client->domicilio,
                            'telefono' => $client->telefono,
                            'localidad' => $client->localidad,
                        ];
                    }
                    // Forzar garbage collection después de cada chunk
                    gc_collect_cycles();
                });
            
            $clients = collect($allClients);
            unset($allClients);
        } else {
            $clients = Clients::orderBy('razonsocial', 'asc')->get(['razonsocial', 'domicilio', 'telefono', 'localidad']);
        }

        $html = View::make('pdf.clients', [
            'clients' => $clients,
            'totalClients' => $totalClients,
        ])->render();

        unset($clients);
        gc_collect_cycles();

        $pdf = PDF::loadHTML($html);
        $pdf->setPaper('a4', 'landscape');
        $pdf->setOptions([
            'defaultFont' => 'sans-serif',
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
            'margin_top' => 5,
            'margin_bottom' => 5,
            'margin_left' => 5,
            'margin_right' => 5
        ]);

        unset($html);
        gc_collect_cycles();

        return $pdf->stream('listado-clientes-optimizado.pdf');
    }

    /**
     * Generar múltiples PDFs divididos por rangos alfabéticos
     */
    public function generateByRange($letter = 'A')
    {
        ini_set('memory_limit', '256M');
        set_time_limit(180);
        
        // Obtener clientes que empiecen con la letra especificada
        $nextLetter = chr(ord(strtoupper($letter)) + 1);
        
        $clients = Clients::whereRaw("UPPER(LEFT(razonsocial, 1)) >= ?", [strtoupper($letter)])
            ->whereRaw("UPPER(LEFT(razonsocial, 1)) < ?", [$nextLetter])
            ->orderBy('razonsocial', 'asc')
            ->get(['razonsocial', 'domicilio', 'telefono', 'localidad']);
            
        $totalClients = $clients->count();
        
        if ($totalClients == 0) {
            return response()->json(['message' => "No hay clientes que empiecen con la letra {$letter}"], 404);
        }

        $html = View::make('pdf.clients', [
            'clients' => $clients,
            'totalClients' => $totalClients,
            'rangeInfo' => "Clientes que empiezan con la letra: " . strtoupper($letter),
        ])->render();

        unset($clients);

        $pdf = PDF::loadHTML($html);
        $pdf->setPaper('a4', 'landscape');
        $pdf->setOptions([
            'defaultFont' => 'sans-serif',
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
            'margin_top' => 10,
            'margin_bottom' => 10,
            'margin_left' => 10,
            'margin_right' => 10
        ]);

        unset($html);

        $filename = "listado-clientes-{$letter}.pdf";
        return $pdf->stream($filename);
    }
}
