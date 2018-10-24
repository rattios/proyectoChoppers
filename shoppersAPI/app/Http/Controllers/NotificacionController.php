<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use DB;

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

    /*Test de la seleccion para las notificaciones automaticas
    de los dos ultimos dias*/
    public function notificationAuto()
    {
        //Log::info("Notificacion enviada");

        /*DB::table('clientes')
                ->where('id', 2)
                ->update(['edad' => 21]);*/

        //cargar todos los clientes
        $clientes = \App\Cliente::with('usuario')->with('preferencias')->get();

        //cargar todas las campanas en curso
        //y que les queden dos o menos dias para finalizar
        $campanas = \App\Campana::
            select('id', 'nombre', 'f_fin', 'genero', 'edad', 'categorias', 'estados', 'municipios', 'localidades', 'empresa_id', DB::raw('TO_DAYS( f_fin) - TO_DAYS( DATE_FORMAT(now(),"%Y-%m-%d")) AS dias'))
            /*->select(DB::raw('TO_DAYS( f_fin) - TO_DAYS( DATE_FORMAT(now(),"%Y-%m-%d")) AS dias'))*/
            ->where('f_fin', '>=', DB::raw('DATE_FORMAT(now(),"%Y-%m-%d")'))
            ->where(DB::raw('TO_DAYS( f_fin) - TO_DAYS( DATE_FORMAT(now(),"%Y-%m-%d"))'), '>=', 0)
            ->where(DB::raw('TO_DAYS( f_fin) - TO_DAYS( DATE_FORMAT(now(),"%Y-%m-%d"))'), '<=', 1)
            ->with(['cuestionarios' => function ($query) {
                $query->select('id', 'num_cuestionarios', 'estado', 'campana_id', 'descripcion', 'nombre')
                    ->where('estado', 2)
                    ->where('num_cuestionarios', '>', 0);

            }])
            ->with(['empresa.usuario' => function ($query) {
                $query->select('usuarios.id', 'usuarios.nombre');

            }])
            /*->whereHas('cuestionarios', function ($query) {
                    $query->where('estado', 2)
                        ->where('num_cuestionarios', '>', 0);
                })*/
            ->get();

        //Seleccionar solo las campañas con cuestionarios activos
        $auxCamp = [];
        for ($i=0; $i < count($campanas); $i++) { 
            if (count($campanas[$i]->cuestionarios) != 0) {

                $campanas[$i]->categorias = json_decode($campanas[$i]->categorias);
                $campanas[$i]->estados = json_decode($campanas[$i]->estados);
                $campanas[$i]->municipios = json_decode($campanas[$i]->municipios);
                $campanas[$i]->localidades = json_decode($campanas[$i]->localidades);
                        
                array_push($auxCamp, $campanas[$i]);
            }
        }

        //return response()->json(['campanas'=>$auxCamp], 200);

        if (count($clientes)>0 && count($auxCamp)>0) {
            
            for ($h=0; $h < count($clientes); $h++) { 

                set_time_limit(300);

                //Seleccionar las campañas que se adaptan a mi tipo de perfil
                $misCampanas = [];

                if ($clientes[$h]->usuario->token_notificacion && $clientes[$h]->usuario->token_notificacion != '') {

                    for ($i=0; $i < count($auxCamp); $i++) { 

                        /*$auxCamp[$i]->categorias = json_decode($auxCamp[$i]->categorias);
                        $auxCamp[$i]->estados = json_decode($auxCamp[$i]->estados);
                        $auxCamp[$i]->municipios = json_decode($auxCamp[$i]->municipios);
                        $auxCamp[$i]->localidades = json_decode($auxCamp[$i]->localidades);*/

                        if ($auxCamp[$i]->genero == 'Todos' || !$auxCamp[$i]->edad || 
                            count($auxCamp[$i]->categorias) == 0 || count($auxCamp[$i]->estados) == 0 ||
                            count($auxCamp[$i]->municipios) == 0 || count($auxCamp[$i]->localidades) == 0) {
                            
                            array_push($misCampanas, $auxCamp[$i]);

                        }else{

                            $banderaGenero = false;
                            $banderaEdad = false;
                            $banderaCategorias = false;
                            $banderaEstados = false;
                            $banderaMunicipios = false;
                            $banderaLocalidades = false;

                            if ($auxCamp[$i]->genero == $clientes[$h]->sexo) {
                                $banderaGenero = true;
                            }

                            $rangoEdades = explode("-",$auxCamp[$i]->edad);
                            if (($clientes[$h]->edad >= $rangoEdades[0]) && ( $clientes[$h]->edad <= $rangoEdades[1])) {
                            
                                $banderaEdad = true;

                            }

                            for ($j=0; $j < count($auxCamp[$i]->categorias); $j++) { 
                                /*if ($banderaCategorias) {
                                    break;
                                }*/
                                for ($k=0; $k < count($clientes[$h]->preferencias); $k++) { 
                                    if ($auxCamp[$i]->categorias[$j]->id == $clientes[$h]->preferencias[$k]->id) {
                                        $banderaCategorias = true;
                                        //break;
                                    }
                                }
                            }

                            for ($j=0; $j < count($auxCamp[$i]->estados); $j++) { 
                                if ($auxCamp[$i]->estados[$j]->id == $clientes[$h]->estado_id) {
                                    $banderaEstados = true;
                                    //break;
                                }  
                            }

                            for ($j=0; $j < count($auxCamp[$i]->municipios); $j++) { 
                                if ($auxCamp[$i]->municipios[$j]->id == $clientes[$h]->municipio_id) {
                                    $banderaMunicipios = true;
                                    //break;
                                }  
                            }

                            for ($j=0; $j < count($auxCamp[$i]->localidades); $j++) { 
                                if ($auxCamp[$i]->localidades[$j]->id == $clientes[$h]->localidad_id) {
                                    $banderaLocalidades = true;
                                    //break;
                                }  
                            }

                            if ($banderaGenero && $banderaEdad &&
                                $banderaCategorias && $banderaEstados &&
                                $banderaMunicipios && $banderaLocalidades) {
                                
                                array_push($misCampanas, $auxCamp[$i]);
                            }

                        }    
                    }//fin del for de auxCamp

                    if(count($misCampanas) != 0){
                    
                        //recuperar los cuestionarios respondidos por el usuario
                        $respuestas = \App\Respuesta::select('id', 'campana_id', 'sucursal_id', 'cliente_id', 'cuestionario_id')
                            ->where('cliente_id', $clientes[$h]->id)
                            ->get();

                        if (count($respuestas) == 0) {

                            $order   = array("\r\n", "\n", "\r", " ", "&");
                            $replace = array('%20', '%20', '%20', '%20', '%26');

                            for ($i=0; $i < count($misCampanas); $i++) {

                                // Procesa primero \r\n así no es convertido dos veces.
                                $nomCampana = str_replace($order, $replace, $misCampanas[$i]->nombre);

                                /*Enviar notificacion por cada cuestionario 
                                de misCampanas[$i]->cuestionarios*/
                                for ($j=0; $j < count($misCampanas[$i]->cuestionarios); $j++) { 
                                    
                                    // Procesa primero \r\n así no es convertido dos veces.
                                    $nomCuest = str_replace($order, $replace, $misCampanas[$i]->cuestionarios[$j]->nombre);

                                    $dias = $misCampanas[$i]->dias + 1;

                                    if($misCampanas[$i]->dias == 0){
                                        $mensaje = 'Te%20queda%20'.$dias.'%20día%20para%20responder%20la%20evaluación%20'.$nomCuest.'%20de%20la%20campaña%20'.$nomCampana;
                                    }else{
                                        $mensaje = 'Te%20quedan%20'.$dias.'%20días%20para%20responder%20la%20evaluación%20'.$nomCuest.'%20de%20la%20campaña%20'.$nomCampana;
                                    }

                                    $this->enviarNotificacion($clientes[$h]->usuario->token_notificacion, $mensaje);
                                }

                            }

                            
                        }else{

                            for ($i=0; $i < count($misCampanas); $i++) {
                                $cuestAux = []; 
                                for ($j=0; $j < count($misCampanas[$i]->cuestionarios); $j++) {
                                    //$cuestAux = [];
                                    $respondido = false; 
                                    for ($k=0; $k < count($respuestas); $k++) { 
                                        
                                        if ($misCampanas[$i]->cuestionarios[$j]->id == $respuestas[$k]->cuestionario_id) {
                                            $respondido = true;
                                            //break;
                                        }
                                    }

                                    if (!$respondido) {
                                        array_push($cuestAux, $misCampanas[$i]->cuestionarios[$j]);
                                    }

                                }

                                $misCampanas[$i]->cuest = $cuestAux;
                            }


                            

                            //Seleccionar solo las campañas con cuestionarios
                            //$auxCamp2 = [];

                            $order   = array("\r\n", "\n", "\r", " ", "&");
                            $replace = array('%20', '%20', '%20', '%20', '%26');

                            for ($i=0; $i < count($misCampanas); $i++) { 
                                if (count($misCampanas[$i]->cuest) != 0) {

                                    /*Enviar notificacion por cada 
                                    $misCampanas[$i]->cuest*/

                                    // Procesa primero \r\n así no es convertido dos veces.
                                    $nomCampana = str_replace($order, $replace, $misCampanas[$i]->nombre);

                                    /*Enviar notificacion por cada cuestionario 
                                    de misCampanas[$i]->cuest*/
                                    for ($j=0; $j < count($misCampanas[$i]->cuest); $j++) { 
                                        
                                        // Procesa primero \r\n así no es convertido dos veces.
                                        $nomCuest = str_replace($order, $replace, $misCampanas[$i]->cuest[$j]->nombre);

                                        $dias = $misCampanas[$i]->dias + 1;

                                        if($misCampanas[$i]->dias == 0){
                                            $mensaje = 'Te%20queda%20'.$dias.'%20día%20para%20responder%20la%20evaluación%20'.$nomCuest.'%20de%20la%20campaña%20'.$nomCampana;
                                        }else{
                                            $mensaje = 'Te%20quedan%20'.$dias.'%20días%20para%20responder%20la%20evaluación%20'.$nomCuest.'%20de%20la%20campaña%20'.$nomCampana;
                                        }

                                        $this->enviarNotificacion($clientes[$h]->usuario->token_notificacion, $mensaje);
                                    }
                                }
                            }

                        }

                    }//fin del if de misCampanas

                }//fin del if token_notificacion

            }//fin del for de clientes

        }//fin del if clientes y auxCamp

        return 1;
    }

    /*Test de la seleccion para las notificaciones automaticas
    anteriores a los dos ultimos dias*/
    public function notificationAuto2()
    {

        //cargar todos los clientes
        $clientes = \App\Cliente::with('usuario')->with('preferencias')->get();

        //cargar todas las campanas en curso
        //y que no esten en sus ultimos dos dias
        //y que no sea el dia de su lanzamiento
        $campanas = \App\Campana::
            select('id', 'nombre', 'f_fin', 'genero', 'edad', 'categorias', 'estados', 'municipios', 'localidades', 'empresa_id', DB::raw('TO_DAYS( f_fin) - TO_DAYS( DATE_FORMAT(now(),"%Y-%m-%d")) AS dias'))
            ->where('f_fin', '>=', DB::raw('DATE_FORMAT(now(),"%Y-%m-%d")'))
            ->where(DB::raw('TO_DAYS( f_fin) - TO_DAYS( DATE_FORMAT(now(),"%Y-%m-%d"))'), '>=', 2)
            ->where('f_inicio', '!=', DB::raw('DATE_FORMAT(now(),"%Y-%m-%d")'))
            ->with(['cuestionarios' => function ($query) {
                $query->select('id', 'count_notif', 'num_cuestionarios', 'estado', 'campana_id', 'descripcion', 'nombre')
                    ->where('estado', 2)
                    ->where('num_cuestionarios', '>', 0)
                    ->where('count_notif', '<', 2);

            }])
            ->with(['empresa.usuario' => function ($query) {
                $query->select('usuarios.id', 'usuarios.nombre');

            }])
            /*->whereHas('cuestionarios', function ($query) {
                    $query->where('estado', 2)
                        ->where('num_cuestionarios', '>', 0);
                })*/
            ->get();

        //Seleccionar solo las campañas con cuestionarios activos
        $auxCamp = [];
        for ($i=0; $i < count($campanas); $i++) { 
            if (count($campanas[$i]->cuestionarios) != 0) {

                /*Si la campaña esta en los ultimos 4 dias envio
                notificacion a todos los cuestionarios*/
                if($campanas[$i]->dias == 2 || $campanas[$i]->dias == 3){

                    $campanas[$i]->categorias = json_decode($campanas[$i]->categorias);
                    $campanas[$i]->estados = json_decode($campanas[$i]->estados);
                    $campanas[$i]->municipios = json_decode($campanas[$i]->municipios);
                    $campanas[$i]->localidades = json_decode($campanas[$i]->localidades);
                    
                    $campanas[$i]->cuestSelect = $campanas[$i]->cuestionarios;

                    array_push($auxCamp, $campanas[$i]);

                    //Aumentar el contador de notificaciones enviadas
                    for ($c=0; $c < count($campanas[$i]->cuestSelect); $c++) { 
                        
                        DB::table('cuestionarios')
                            ->where('id', $campanas[$i]->cuestSelect[$c]->id)
                            ->update(['count_notif' => $campanas[$i]->cuestSelect[$c]->count_notif + 1]);

                    }

                }else{

                    $cuestSelect = [];
                    for ($c=0; $c < count($campanas[$i]->cuestionarios); $c++) {

                        //Aleatorio para ver si selecciono el cuestionario para la notificacion 
                        $aletorio = rand(0, 1);

                        if ($aletorio == 1) {
                            array_push($cuestSelect, $campanas[$i]->cuestionarios[$c]);

                            //Aumentar el contador de notificaciones enviadas

                            DB::table('cuestionarios')
                            ->where('id', $campanas[$i]->cuestionarios[$c]->id)
                            ->update(['count_notif' => $campanas[$i]->cuestionarios[$c]->count_notif + 1]);
                        }
                    }

                    if (count($cuestSelect) > 0) {
                        $campanas[$i]->categorias = json_decode($campanas[$i]->categorias);
                        $campanas[$i]->estados = json_decode($campanas[$i]->estados);
                        $campanas[$i]->municipios = json_decode($campanas[$i]->municipios);
                        $campanas[$i]->localidades = json_decode($campanas[$i]->localidades);

                        $campanas[$i]->cuestSelect = $cuestSelect;

                        array_push($auxCamp, $campanas[$i]);
                    }
                }

            }
        }

        //return response()->json(['campanas'=>$auxCamp], 200);

        if (count($clientes)>0 && count($auxCamp)>0) {
            
            for ($h=0; $h < count($clientes); $h++) { 

                set_time_limit(300);

                //Seleccionar las campañas que se adaptan a mi tipo de perfil
                $misCampanas = [];

                if ($clientes[$h]->usuario->token_notificacion && $clientes[$h]->usuario->token_notificacion != '') {

                    for ($i=0; $i < count($auxCamp); $i++) { 

                        /*$auxCamp[$i]->categorias = json_decode($auxCamp[$i]->categorias);
                        $auxCamp[$i]->estados = json_decode($auxCamp[$i]->estados);
                        $auxCamp[$i]->municipios = json_decode($auxCamp[$i]->municipios);
                        $auxCamp[$i]->localidades = json_decode($auxCamp[$i]->localidades);*/

                        if ($auxCamp[$i]->genero == 'Todos' || !$auxCamp[$i]->edad || 
                            count($auxCamp[$i]->categorias) == 0 || count($auxCamp[$i]->estados) == 0 ||
                            count($auxCamp[$i]->municipios) == 0 || count($auxCamp[$i]->localidades) == 0) {
                            
                            array_push($misCampanas, $auxCamp[$i]);

                        }else{

                            $banderaGenero = false;
                            $banderaEdad = false;
                            $banderaCategorias = false;
                            $banderaEstados = false;
                            $banderaMunicipios = false;
                            $banderaLocalidades = false;

                            if ($auxCamp[$i]->genero == $clientes[$h]->sexo) {
                                $banderaGenero = true;
                            }

                            $rangoEdades = explode("-",$auxCamp[$i]->edad);
                            if (($clientes[$h]->edad >= $rangoEdades[0]) && ( $clientes[$h]->edad <= $rangoEdades[1])) {
                            
                                $banderaEdad = true;

                            }

                            for ($j=0; $j < count($auxCamp[$i]->categorias); $j++) { 
                                /*if ($banderaCategorias) {
                                    break;
                                }*/
                                for ($k=0; $k < count($clientes[$h]->preferencias); $k++) { 
                                    if ($auxCamp[$i]->categorias[$j]->id == $clientes[$h]->preferencias[$k]->id) {
                                        $banderaCategorias = true;
                                        //break;
                                    }
                                }
                            }

                            for ($j=0; $j < count($auxCamp[$i]->estados); $j++) { 
                                if ($auxCamp[$i]->estados[$j]->id == $clientes[$h]->estado_id) {
                                    $banderaEstados = true;
                                    //break;
                                }  
                            }

                            for ($j=0; $j < count($auxCamp[$i]->municipios); $j++) { 
                                if ($auxCamp[$i]->municipios[$j]->id == $clientes[$h]->municipio_id) {
                                    $banderaMunicipios = true;
                                    //break;
                                }  
                            }

                            for ($j=0; $j < count($auxCamp[$i]->localidades); $j++) { 
                                if ($auxCamp[$i]->localidades[$j]->id == $clientes[$h]->localidad_id) {
                                    $banderaLocalidades = true;
                                    //break;
                                }  
                            }

                            if ($banderaGenero && $banderaEdad &&
                                $banderaCategorias && $banderaEstados &&
                                $banderaMunicipios && $banderaLocalidades) {
                                
                                array_push($misCampanas, $auxCamp[$i]);
                            }

                        }    
                    }//fin del for de auxCamp

                    if(count($misCampanas) != 0){
                    
                        //recuperar los cuestionarios respondidos por el usuario
                        $respuestas = \App\Respuesta::select('id', 'campana_id', 'sucursal_id', 'cliente_id', 'cuestionario_id')
                            ->where('cliente_id', $clientes[$h]->id)
                            ->get();

                        if (count($respuestas) == 0) {

                            $order   = array("\r\n", "\n", "\r", " ", "&");
                            $replace = array('%20', '%20', '%20', '%20', '%26');

                            for ($i=0; $i < count($misCampanas); $i++) {

                                // Procesa primero \r\n así no es convertido dos veces.
                                $nomCampana = str_replace($order, $replace, $misCampanas[$i]->nombre);

                                /*Enviar notificacion por cada cuestionario 
                                de misCampanas[$i]->cuestionarios*/
                                for ($j=0; $j < count($misCampanas[$i]->cuestSelect); $j++) { 
                                    
                                    // Procesa primero \r\n así no es convertido dos veces.
                                    $nomCuest = str_replace($order, $replace, $misCampanas[$i]->cuestSelect[$j]->nombre);

                                    $dias = $misCampanas[$i]->dias + 1;

                                    if($misCampanas[$i]->dias == 0){
                                        $mensaje = 'Te%20queda%20'.$dias.'%20día%20para%20responder%20la%20evaluación%20'.$nomCuest.'%20de%20la%20campaña%20'.$nomCampana;
                                    }else{
                                        $mensaje = 'Te%20quedan%20'.$dias.'%20días%20para%20responder%20la%20evaluación%20'.$nomCuest.'%20de%20la%20campaña%20'.$nomCampana;
                                    }

                                    $this->enviarNotificacion($clientes[$h]->usuario->token_notificacion, $mensaje);
                                }

                            }

                            
                        }else{

                            for ($i=0; $i < count($misCampanas); $i++) {
                                $cuestAux = []; 
                                for ($j=0; $j < count($misCampanas[$i]->cuestSelect); $j++) {
                                    //$cuestAux = [];
                                    $respondido = false; 
                                    for ($k=0; $k < count($respuestas); $k++) { 
                                        
                                        if ($misCampanas[$i]->cuestSelect[$j]->id == $respuestas[$k]->cuestionario_id) {
                                            $respondido = true;
                                            //break;
                                        }
                                    }

                                    if (!$respondido) {
                                        array_push($cuestAux, $misCampanas[$i]->cuestSelect[$j]);
                                    }

                                }

                                $misCampanas[$i]->cuest = $cuestAux;
                            }


                            

                            //Seleccionar solo las campañas con cuestionarios
                            //$auxCamp2 = [];

                            $order   = array("\r\n", "\n", "\r", " ", "&");
                            $replace = array('%20', '%20', '%20', '%20', '%26');

                            for ($i=0; $i < count($misCampanas); $i++) { 
                                if (count($misCampanas[$i]->cuest) != 0) {

                                    /*Enviar notificacion por cada 
                                    $misCampanas[$i]->cuest*/

                                    // Procesa primero \r\n así no es convertido dos veces.
                                    $nomCampana = str_replace($order, $replace, $misCampanas[$i]->nombre);

                                    /*Enviar notificacion por cada cuestionario 
                                    de misCampanas[$i]->cuest*/
                                    for ($j=0; $j < count($misCampanas[$i]->cuest); $j++) { 
                                        
                                        // Procesa primero \r\n así no es convertido dos veces.
                                        $nomCuest = str_replace($order, $replace, $misCampanas[$i]->cuest[$j]->nombre);

                                        $dias = $misCampanas[$i]->dias + 1;

                                        if($misCampanas[$i]->dias == 0){
                                            $mensaje = 'Te%20queda%20'.$dias.'%20día%20para%20responder%20la%20evaluación%20'.$nomCuest.'%20de%20la%20campaña%20'.$nomCampana;
                                        }else{
                                            $mensaje = 'Te%20quedan%20'.$dias.'%20días%20para%20responder%20la%20evaluación%20'.$nomCuest.'%20de%20la%20campaña%20'.$nomCampana;
                                        }

                                        $this->enviarNotificacion($clientes[$h]->usuario->token_notificacion, $mensaje);
                                    }
                                }
                            }

                        }

                    }//fin del if de misCampanas

                }//fin del if token_notificacion

            }//fin del for de clientes

        }//fin del if clientes y auxCamp

        return 1;
    }
}
