<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class NotificacionController extends Controller
{

    //Enviar notificacion a un dispositivo mediante su token_notificacion
    public function enviarNotificacion($token_notificacion, $msg, $cuestionario_id='null', $accion = 0, $obj = 'null')
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://shopper.internow.com.mx/onesignal.php?contenido=".$msg."&token_notificacion=".$token_notificacion."&cuestionario_id=".$cuestionario_id."&obj=".$obj."&accion=".$accion);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
            'Authorization: Basic YmEwZDMwMDMtODY0YS00ZTYxLTk1MjYtMGI3Nzk3N2Q1YzNi'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_POST, TRUE);
        ///curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

        $response = curl_exec($ch);
        curl_close($ch);
    }

    /*Notificar la creacion de campañas*/
    public function notificarCrearCamp(Request $request)
    {
        //cargar empleados
        $empleados = \App\Empleado::with('usuario')
            ->with(['permisos' => function ($query) {
                $query->where('camp_crear', 1);
            }])
            ->where('empresa_id', $request->input('empresa_id'))
            ->get();

        if(count($empleados)==0){
            return response()->json(['error'=>'No hay empleados con permisos para la creación de campañas.'], 404);          
        }else{

            /*$explode2 = explode(" ",$request->input('nombre_campana'));
            $nomCampana = null;
            for ($i=0; $i < count($explode2); $i++) { 
                $nomCampana = $nomCampana.$explode2[$i].'%20'; 
            }*/

            // Orden del reemplazo
            //$str     = "Line 1\nLine 2\rLine 3\r\nLine 4\n";
            $order   = array("\r\n", "\n", "\r", " ", "&");
            $replace = array('%20', '%20', '%20', '%20', '%26');

            // Procesa primero \r\n así no es convertido dos veces.
            $nomCampana = str_replace($order, $replace, $request->input('nombre_campana'));

            for ($i=0; $i < count($empleados); $i++) { 
                if ($empleados[$i]->usuario->token_notificacion) {

                    $this->enviarNotificacion($empleados[$i]->usuario->token_notificacion, 'El%20presupuesto%20de%20la%20campaña%20'.$nomCampana.'%20ha%20sido%20asignado');
                }
            }

            return response()->json(['message'=>'Los empleados han sido notificados.'], 200);
        }
    }

    /*Notificar la creacion de cuestionarios*/
    public function notificarCrearCuest(Request $request)
    {
        //cargar empleados
        $empleados = \App\Empleado::with('usuario')
            ->with(['permisos' => function ($query) {
                $query->where('cuest_crear', 1);
            }])
            ->where('empresa_id', $request->input('empresa_id'))
            ->get();

        if(count($empleados)==0){
            return response()->json(['error'=>'No hay empleados con permisos para la creación de cuestionarios.'], 404);          
        }else{

            /*$explode2 = explode(" ",$request->input('nombre_cuestionario'));
            $nomCuest = null;
            for ($i=0; $i < count($explode2); $i++) { 
                $nomCuest = $nomCuest.$explode2[$i].'%20'; 
            }*/

            // Orden del reemplazo
            //$str     = "Line 1\nLine 2\rLine 3\r\nLine 4\n";
            $order   = array("\r\n", "\n", "\r", " ", "&");
            $replace = array('%20', '%20', '%20', '%20', '%26');

            // Procesa primero \r\n así no es convertido dos veces.
            $nomCuest = str_replace($order, $replace, $request->input('nombre_cuestionario'));

            for ($i=0; $i < count($empleados); $i++) { 
                if ($empleados[$i]->usuario->token_notificacion) {

                    $this->enviarNotificacion($empleados[$i]->usuario->token_notificacion, 'Ha%20sido%20asignado%20un%20presupuesto%20al%20cuestionario%20'.$nomCuest);
                }
            }

            return response()->json(['message'=>'Los empleados han sido notificados.'], 200);
        }
    }

    /*filtrar los clientes para enviar las notificaciones
    de evaluacion de campañas (Campañas lanzadas)*/
    public function fiterUsersNotifications(Request $request, \App\Cliente $cliente)
    {
        set_time_limit(300);

        $cliente = $cliente->newQuery();

        /*Seleccionar solo clientes activos*/
        //$cliente->where('activo', 1);

        /*Tratamiento para los estados*/
        $estados = [];
        if ($request->has('estados')) {
            $estadosAux = json_decode($request->input('estados'));

            for ($i=0; $i < count($estadosAux)  ; $i++) { 
                array_push($estados, $estadosAux[$i]->id);
            }
        }

        /*Tratamiento para los municipios*/
        $municipios = [];
        if ($request->has('municipios')) {
            $municipiosAux = json_decode($request->input('municipios'));

            for ($i=0; $i < count($municipiosAux)  ; $i++) { 
                array_push($municipios, $municipiosAux[$i]->id);
            }
        }

        /*Tratamiento para las localidades*/
        $localidades = [];
        if ($request->has('localidades')) {
            $localidadesAux = json_decode($request->input('localidades'));
        
            for ($i=0; $i < count($localidadesAux)  ; $i++) { 
                array_push($localidades, $localidadesAux[$i]->id);
            }
        }
        

        if (count($estados) > 0 || count($municipios) > 0 || count($localidades) > 0) {
            $cliente->where(function ($query) use ($estados, $municipios, $localidades) {
                if (count($estados) > 0) {
                    $query = $query->orWhere(function ($query) use ($estados) {
                        $query->whereIn('estado_id',$estados);
                    });
                }
                
                if (count($municipios) > 0) {
                    $query = $query->orWhere(function ($query) use ($municipios) {
                        $query->whereIn('municipio_id',$municipios);
                    });
                }
                
                if (count($localidades) > 0) {
                    $query = $query->orWhere(function ($query) use ($localidades) {
                        $query->whereIn('localidad_id',$localidades);
                    });
                }
                
            });            
        }

        /*Tratamiento para las categorias*/
        $categorias = [];
        if ($request->has('categorias')) {
            $categoriasAux = json_decode($request->input('categorias'));
        
            for ($i=0; $i < count($categoriasAux)  ; $i++) { 
                array_push($categorias, $categoriasAux[$i]->id);
            }
        }
        
        if (count($categorias) > 0) {
            $cliente->whereHas('preferencias', function ($query) use ($categorias) {
                $query->whereIn('cliente_categorias.categoria_id', $categorias);
            });
        }

        /*Tratamiento para el genero(sexo)*/
        if ($request->has('genero')) {
            if ($request->input('genero') != 'Todos') {
                $cliente->where('sexo', $request->input('genero'));
            }
        }

        /*Tratamiento para la edad*/
        if ($request->has('edad')) {
            if ($request->input('edad') != 'null' && $request->input('edad') != null && $request->input('edad') != '') {

                $rangoEdades = explode("-",$request->input('edad'));

                $cliente->whereBetween('edad', $rangoEdades);
            }
        }

        $filtrados = $cliente->select('id', 'user_id')
            ->with(['usuario' => function ($query) {
                $query->select('id', 'nombre', 'email', 'tipo_usuario', 'token_notificacion');
            }])->get();


        //return $filtrados;
        //return $cliente->select('id', 'token_notificacion')->get();

        $cuestionario_id = $request->input('cuestionario_id');

        // Orden del reemplazo
        //$str     = "Line 1\nLine 2\rLine 3\r\nLine 4\n";
        $order   = array("\r\n", "\n", "\r", " ", "&");
        $replace = array('%20', '%20', '%20', '%20', '%26');

        $sucursal = str_replace($order, $replace, $request->input('sucursal'));
        $logo = str_replace($order, $replace, $request->input('logo'));

        $obj = array('sucursal'=>$sucursal, 'logo'=>$logo);
        $obj = json_encode($obj);

        for ($i=0; $i < count($filtrados); $i++) { 
            if ($filtrados[$i]->usuario->token_notificacion) {

                $this->enviarNotificacion($filtrados[$i]->usuario->token_notificacion, 'Nueva%20evaluación:%20Un%20comercio%20y/o%20producto%20dentro%20de%20tus%20intereses%20desea%20ser%20evaluado.', $cuestionario_id, 1, $obj);
            }
        }

        return response()->json(['message'=>'Clientes notificados: '.count($filtrados)], 200);
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
