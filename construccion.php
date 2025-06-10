<?php
// Enviar cabecera para asegurar UTF-8
header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Red Televisión</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(-45deg, #d46a6a, #a52a2a, #f5f5f5, #b0b0b0, #1a1a1a);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
        }

        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .container {
            text-align: center;
            color: #ffffff;
            text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6);
            padding: 20px;
        }

        .logo {
            margin-bottom: 2rem;
        }

        .logo img {
            width: 150px;
            height: auto;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            line-height: 1.4;
        }

        h5 {
            font-size: 1.1rem;
            font-weight: 400;
            color: #eeeeee;
            margin-top: 0.5rem;
        }

        a {
            text-decoration: none;
        }

        @media (max-width: 600px) {
            .logo img {
                width: 120px;
            }
            h1 {
                font-size: 1.7rem;
            }
            h5 {
                font-size: 0.95rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="logo.png" alt="Red TV Logo">
        </div>
        <h1>Estamos trabajando en una nueva WEB para que accedas a nuestros servicios, más cómodamente.</h1>
        <a href="https://www.instagram.com/redtvcharata/">
            <h5>Red Televisión S.R.L</h5>
        </a>
    </div>
</body>
</html>
