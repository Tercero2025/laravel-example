<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\View;
use Barryvdh\DomPDF\Facade\Pdf;

class UserPdfController extends Controller
{
    public function __invoke()
    {
        // Excluir el usuario superadmin de la lista
        $users = User::with('role')
            ->where('is_superadmin', false)
            ->get();

        $html = View::make('pdf.users', [
            'users' => $users,
            'fecha' => now()->format('d/m/Y H:i:s')
        ])->render();

        $pdf = PDF::loadHTML($html);
        $pdf->setPaper('a4', 'landscape');
        $pdf->setOptions([
            'defaultFont' => 'sans-serif',
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
            'isFontSubsettingEnabled' => true,
            'isPhpEnabled' => true,
            'isJavascriptEnabled' => true,
            'isHtml5ParserEnabled' => true,
        ]);

        return $pdf->stream('listado-usuarios.pdf');
    }
}
