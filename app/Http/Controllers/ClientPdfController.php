<?php

namespace App\Http\Controllers;

use App\Models\Clients;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\View;

class ClientPdfController extends Controller
{
    public function generate()
    {
        $clients = Clients::all()->map(function($client) {
            return [
                'name' => $client->name,
                'fullname' => $client->fullname,
                'cuit' => $client->cuit,
                'city' => $client->city,
            ];
        });

        // Crear el contenido HTML usando una vista blade simple
        $html = View::make('pdf.clients', ['clients' => $clients])->render();

        // Crear PDF
        $pdf = PDF::loadHTML($html);
        $pdf->setPaper('a4', 'landscape');
        $pdf->setOptions([
            'defaultFont' => 'sans-serif',
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true
        ]);

        return $pdf->stream('clients-list.pdf');
    }
}
