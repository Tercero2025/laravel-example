<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f3f4f6; }
    </style>
</head>
<body>
    <h1>Clients Lista</h1>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Full Name</th>
                <th>CUIT</th>
                <th>City</th>
            </tr>
        </thead>
        <tbody>
            @foreach($clients as $client)
                <tr>
                    <td>{{ $client['name'] }}</td>
                    <td>{{ $client['fullname'] }}</td>
                    <td>{{ $client['cuit'] }}</td>
                    <td>{{ $client['city'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
