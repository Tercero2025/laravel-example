<!DOCTYPE html>
<html>

<head>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            margin: 0;
            padding: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 4px 6px;
            text-align: left;
            font-size: 9px;
            line-height: 1.2;
        }

        th {
            background-color: #333;
            color: white;
            font-weight: bold;
            font-size: 9px;
        }
        
        tr:nth-child(odd) {
            background-color: #f9f9f9;
        }
        
        tr:nth-child(even) {
            background-color: #ffffff;
        }
    </style>
</head>

<body style="margin: 0; padding: 0;">
    <div class="title" style="text-align:center;font-size:14px;font-weight:bold;margin-bottom:5px;">Listado de Clientes
    </div>
    @php $perPage = 27; @endphp
    @foreach ($clients->chunk($perPage) as $chunk)
        <table style="width:100%;border-collapse:collapse;margin-top:5px;">
            <thead>
                <tr>
                    <th>RAZON SOCIAL</th>
                    <th>DOMICILIO</th>
                    <th>TELEFONO</th>
                    <th>LOCALIDAD</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($chunk as $client)
                    <tr style="height: 16px;">
                        <td style="font-weight:bold;">{{ strtoupper($client->razonsocial) }}</td>
                        <td>{{ $client->domicilio }}</td>
                        <td>{{ $client->telefono }}</td>
                        <td>{{ strtoupper($client->localidad) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        @if (!$loop->last)
            <div style="page-break-after: always;"></div>
        @endif
    @endforeach
</body>

</html>
