<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Listado de Usuarios</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 12px;
            color: #333;
        }
        h1 {
            text-align: center;
            margin-bottom: 20px;
            font-size: 18px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .fecha {
            text-align: right;
            margin-bottom: 20px;
            font-size: 10px;
        }
        .admin-badge {
            background-color: #ef4444;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
        }
        .regular-badge {
            background-color: #e5e7eb;
            color: #374151;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
        }
    </style>
</head>
<body>
    <div class="fecha">Generado: {{ $fecha }}</div>
    <h1>Listado de Usuarios</h1>
    
    <table>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            @foreach($users as $user)
                <tr>
                    <td>{{ $user->name }}</td>
                    <td>{{ $user->email }}</td>
                    <td>{{ $user->role ? $user->role->name : 'Sin Rol' }}</td>
                    <td>
                        @if($user->role && ($user->role->name === 'admin' || $user->is_superadmin))
                            <span class="admin-badge">Usuario Admin</span>
                        @else
                            <span class="regular-badge">Usuario Regular</span>
                        @endif
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
