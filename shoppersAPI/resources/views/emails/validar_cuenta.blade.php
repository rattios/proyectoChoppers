<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Mouvers</title>

	<!-- <link href="https://fonts.googleapis.com/css?family=Lato:100" rel="stylesheet" type="text/css"> -->

    <style>
        html, body {
            height: 100%;
        }

        body {
            margin: 0;
            padding: 0;
            width: 100%;
            display: table;
            font-weight: 100;
            /* font-family: 'Lato'; */
        }

        .container {
            text-align: center;
            display: table-cell;
            vertical-align: middle;
        }

        .content {
            text-align: center;
            display: inline-block;
        }

        .title {
            font-size: 96px;
        }
    </style>

</head>
<body>

	<div class="container">
        <div class="content">
            <!-- <div class="title">Laravel 5</div> -->

            <p>
				<strong>Entra en el siguiente enlace para validar tu cuenta: </strong>
				<br><br>
				<a target="_blank" href="{{$enlace}}">{{$enlace}}</a>
				
			</p>

			<br>
			<p>Si no validas tu cuenta, es posible que no puedas acceder a ciertas funciones de Mouvers.</p>

			<br>
			<p>Saludos cordiales, el equipo de Mouvers.</p>
        </div>
    </div>

	
</body>
</html>