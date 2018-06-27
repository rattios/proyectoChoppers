<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Hash;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use DB;

class ClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //cargar todos los clientes
        $clientes = \App\Cliente::with('usuario')->with('preferencias')->get();

        if(count($clientes) == 0){
            return response()->json(['error'=>'No existen clientes.'], 404);          
        }else{
            return response()->json(['clientes'=>$clientes], 200);
        } 
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
        // Primero comprobaremos si estamos recibiendo todos los campos.
        if ( !$request->input('email') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro email.'],422);
        }
        if ( !$request->input('tipo_registro') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro tipo_registro.'],422);
        }

        $aux = \App\User::where('email', $request->input('email'))->with('cliente')->get();
        if(count($aux)!=0){

            if ($request->input('tipo_registro') == 1) {
                //Devolvemos un código 409 Conflict. 
                return response()->json(['error'=>'Ya existe un usuario con esas credenciales.'], 409);
            }else{

                if ($request->input('preferencias')) {
                    //Verificar que todas las preferencias (categorias) existen
                    $preferencias = json_decode($request->input('preferencias'));
                    for ($i=0; $i < count($preferencias) ; $i++) { 
                        $aux2 = \App\Categoria::find($preferencias[$i]->categoria_id);
                        if(count($aux2) == 0){
                           // Devolvemos un código 409 Conflict. 
                            return response()->json(['error'=>'No existe la categoría con id '.$preferencias[$i]->categoria_id], 409);
                        }   
                    } 
                }

                $auxUser = $aux[0];
                $auxUser->email = $request->input('email');
                //$auxUser->password = Hash::make($request->input('password'));
                $auxUser->nombre = $request->input('nombre');
                //$usuario->tipo_usuario = 1;
                $auxUser->tipo_registro = $request->input('tipo_registro');

                if ($request->input('tipo_registro') == 2) {
                    $auxUser->id_facebook = $request->input('id_facebook');
                }else if ($request->input('tipo_registro') == 3) {
                    $auxUser->id_twitter = $request->input('id_twitter');
                }

                if ($request->has('token_notificacion')) {
                    if ($request->input('token_notificacion') != 'null' && $request->input('token_notificacion') != null && $request->input('token_notificacion') != '') {

                        $auxUser->token_notificacion = $request->input('token_notificacion');
                    }
                }
                
                // Almacenamos en la base de datos el registro.
                if ($auxUser->save()) {

                    if ($preferencias) {
                        //Eliminar las relaciones(preferencias) en la tabla pivote
                        $auxUser->cliente->preferencias()->detach();

                        //Crear las relaciones (preferencias) en la tabla pivote
                        for ($i=0; $i < count($preferencias) ; $i++) { 

                            $auxUser->cliente->preferencias()->attach($preferencias[$i]->categoria_id);
                               
                        }
                    }

                    if (!$token = JWTAuth::fromUser($auxUser)) {
                        return response()->json(['error' => 'could_not_create_token'], 401);
                    }

                    $auxUser = JWTAuth::toUser($token);

                    return response()->json(['message'=>'Cliente actualizado con éxito.', 'usuario'=>$auxUser, 'cliente'=>$auxUser->cliente, 'token' => $token], 200);
                }else{
                    return response()->json(['error'=>'Error al actualizar el cliente.'], 500);
                }
                
                
            }
        }

        if ($request->input('preferencias')) {
            //Verificar que todas las preferencias (categorias) existen
            $preferencias = json_decode($request->input('preferencias'));
            for ($i=0; $i < count($preferencias) ; $i++) { 
                $aux2 = \App\Categoria::find($preferencias[$i]->categoria_id);
                if(count($aux2) == 0){
                   // Devolvemos un código 409 Conflict. 
                    return response()->json(['error'=>'No existe la categoría con id '.$preferencias[$i]->categoria_id], 409);
                }   
            } 
        }

        /*Primero creo una instancia en la tabla usuarios*/
        $usuario = new \App\User;
        $usuario->email = $request->input('email');

        if ($request->input('password') != null && $request->input('password') != '')
        {
            $usuario->password = Hash::make($request->input('password'));
        }
        
        $usuario->nombre = $request->input('nombre');
        $usuario->tipo_usuario = 1;
        $usuario->tipo_registro = $request->input('tipo_registro');
        $usuario->id_facebook = $request->input('id_facebook');
        $usuario->id_twitter = $request->input('id_twitter');

        if ($request->has('token_notificacion')) {
            if ($request->input('token_notificacion') != 'null' && $request->input('token_notificacion') != null && $request->input('token_notificacion') != '') {

                $usuario->token_notificacion = $request->input('token_notificacion');
            }
        }

        if($usuario->save()){

            //Creamos el cliente asociado al usuario
            $cliente = $usuario->cliente()->create($request->all());

            if ($request->input('preferencias')) {
                //Crear las relaciones (preferencias) en la tabla pivote
                for ($i=0; $i < count($preferencias) ; $i++) { 

                    $cliente->preferencias()->attach($preferencias[$i]->categoria_id);
                       
                }
            }

            if (!$token = JWTAuth::fromUser($usuario)) {
                return response()->json(['error' => 'could_not_create_token'], 401);
            }

            $usuario = JWTAuth::toUser($token);

           return response()->json(['message'=>'Cliente creado con éxito.', 'usuario'=>$usuario, 'cliente'=>$usuario->cliente, 'token' => $token], 200);
        }else{
            return response()->json(['error'=>'Error al crear el cliente.'], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //cargar un cliente
        $cliente = \App\Cliente::with('usuario')->with('preferencias')->find($id);

        if(count($cliente)==0){
            return response()->json(['error'=>'No existe el cliente con id '.$id], 404);          
        }else{

            return response()->json(['cliente'=>$cliente], 200);
        }
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
        // Comprobamos si el cliente que nos están pasando existe o no.
        $cliente = \App\Cliente::find($id);

        if (count($cliente)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el cliente con id '.$id], 404);
        }  

        $usuario = \App\User::find($cliente->user_id);    

        // Listado de campos recibidos teóricamente.
        //usuario
        $email=$request->input('email'); 
        $password=$request->input('password');  
        $nombre=$request->input('nombre');
        $codigo_verificacion=$request->input('codigo_verificacion');
        //cliente
        $sexo = $request->input('sexo');
        $edad = $request->input('edad');
        $lat = $request->input('lat');
        $lng=$request->input('lng');
        $direccion=$request->input('direccion');
        $ciudad=$request->input('ciudad');
        $colonia=$request->input('colonia');
        $activo=$request->input('activo');
        $imagen = $request->input('imagen');
        $token_notificacion=$request->input('token_notificacion');
        $preferencias=$request->input('preferencias');

        // Creamos una bandera para controlar si se ha modificado algún dato.
        $bandera = false;

        // Actualización parcial de campos.

        //usuario

        if ($email != null && $email!='')
        {
            $aux = \App\User::where('email', $request->input('email'))
            ->where('id', '<>', $usuario->id)->get();

            if(count($aux)!=0){
               // Devolvemos un código 409 Conflict. 
                return response()->json(['error'=>'Ya existe otro usuario con ese email.'], 409);
            }

            $usuario->email = $email;
            $bandera=true;
        }

        if ($password != null && $password!='')
        {
            $usuario->password = Hash::make($request->input('password'));
            $bandera=true;
        }

        if ($nombre != null && $nombre!='')
        {
            $usuario->nombre = $nombre;
            $bandera=true;
        }

        if ($codigo_verificacion != null && $codigo_verificacion!='')
        {
            $usuario->codigo_verificacion = $codigo_verificacion;
            $bandera=true;
        }

        //cliente

        if ($sexo != null && $sexo!='')
        {
            $cliente->sexo = $sexo;
            $bandera=true;
        }

        if ($edad != null && $edad!='')
        {
            $cliente->edad = $edad;
            $bandera=true;
        }

        if ($lat != null && $lat!='')
        {
            $cliente->lat = $lat;
            $bandera=true;
        }

        if ($lng != null && $lng!='')
        {
            $cliente->lng = $lng;
            $bandera=true;
        }

        if ($direccion != null && $direccion!='')
        {
            $cliente->direccion = $direccion;
            $bandera=true;
        }

        if ($ciudad != null && $ciudad!='')
        {
            $cliente->ciudad = $ciudad;
            $bandera=true;
        }

        if ($colonia != null && $colonia!='')
        {
            $cliente->colonia = $colonia;
            $bandera=true;
        }

        if ($activo != null && $activo!='')
        {
            $cliente->activo = $activo;
            $bandera=true;
        }

        if ($imagen != null && $imagen!='')
        {
            $cliente->imagen = $imagen;
            $bandera=true;
        }

        if ($token_notificacion != null && $token_notificacion!='')
        {
            $cliente->token_notificacion = $token_notificacion;
            $bandera=true;
        }

        if ($preferencias) {
            $preferencias = json_decode($request->input('preferencias'));

            //Eliminar las relaciones(preferencias) en la tabla pivote
            $cliente->preferencias()->detach();

            //Agregar las nuevas relaciones(preferencias) en la tabla pivote
            for ($i=0; $i < count($preferencias) ; $i++) { 
                  $cliente->preferencias()->attach($preferencias[$i]->categoria_id);
            }

            $bandera=true; 
        }

        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($cliente->save() && $usuario->save()) {
                return response()->json(['message'=>'Cliente actualizado con éxito.', 'cliente'=>$cliente], 200);
            }else{
                return response()->json(['error'=>'Error al actualizar el cliente.'], 500);
            }
        }
        else
        {
            // Se devuelve un array error con los error encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato del cliente.'],409);
        }
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

    /*Retorna las campañas que no ha respondido el cliente_id*/
    public function campanasPendientes(Request $request, $cliente_id)
    {

        //cargar el cliente
        $cliente = \App\Cliente::with('preferencias')->find($cliente_id);

        if(count($cliente)==0){
            return response()->json(['error'=>'No existe el cliente con id '.$cliente_id], 404);          
        }

        //cargar todas las campanas en curso
        $campanas = \App\Campana::
            select('id', 'nombre', 'f_fin', 'genero', 'edad', 'categorias', 'estados', 'municipios', 'localidades', 'empresa_id')
            ->where('f_fin', '>=', DB::raw('DATE_FORMAT(now(),"%Y-%m-%d")'))
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

        if(count($campanas) == 0){
            return response()->json(['message'=>'No existen campañas en curso.', 'campanas'=>[]], 200);          
        }else{

            //Seleccionar solo las campañas con cuestionarios activos
            $auxCamp = [];
            for ($i=0; $i < count($campanas); $i++) { 
                if (count($campanas[$i]->cuestionarios) != 0) {
                    array_push($auxCamp, $campanas[$i]);
                }
            }

            if(count($auxCamp) == 0){
                return response()->json(['message'=>'No existen campañas con cuestionarios activos.', 'campanas'=>[]], 200);          
            }else{

                //Seleccionar las campañas que se adaptan a mi tipo de perfil
                $misCampanas = [];
                for ($i=0; $i < count($auxCamp) ; $i++) { 

                    $auxCamp[$i]->categorias = json_decode($auxCamp[$i]->categorias);
                    $auxCamp[$i]->estados = json_decode($auxCamp[$i]->estados);
                    $auxCamp[$i]->municipios = json_decode($auxCamp[$i]->municipios);
                    $auxCamp[$i]->localidades = json_decode($auxCamp[$i]->localidades);

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

                        if ($auxCamp[$i]->genero == $cliente->sexo) {
                            $banderaGenero = true;
                        }

                        $rangoEdades = explode("-",$auxCamp[$i]->edad);
                        if (($cliente->edad >= $rangoEdades[0]) && ( $cliente->edad <= $rangoEdades[1])) {
                        
                            $banderaEdad = true;

                        }

                        for ($j=0; $j < count($auxCamp[$i]->categorias); $j++) { 
                            /*if ($banderaCategorias) {
                                break;
                            }*/
                            for ($k=0; $k < count($cliente->preferencias); $k++) { 
                                if ($auxCamp[$i]->categorias[$j]->id == $cliente->preferencias[$k]->id) {
                                    $banderaCategorias = true;
                                    //break;
                                }
                            }
                        }

                        for ($j=0; $j < count($auxCamp[$i]->estados); $j++) { 
                            if ($auxCamp[$i]->estados[$j]->id == $cliente->estado_id) {
                                $banderaEstados = true;
                                //break;
                            }  
                        }

                        for ($j=0; $j < count($auxCamp[$i]->municipios); $j++) { 
                            if ($auxCamp[$i]->municipios[$j]->id == $cliente->municipio_id) {
                                $banderaMunicipios = true;
                                //break;
                            }  
                        }

                        for ($j=0; $j < count($auxCamp[$i]->localidades); $j++) { 
                            if ($auxCamp[$i]->localidades[$j]->id == $cliente->localidad_id) {
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

                    
                }

                if(count($misCampanas) == 0){
                    return response()->json(['message'=>'No existen campañas que se adapten al perfil del usuario.', 'campanas'=>[]], 200);          
                }else{

                    //recuperar los cuestionarios respondidos por el usuario
                    $respuestas = \App\Respuesta::select('id', 'campana_id', 'sucursal_id', 'cliente_id', 'cuestionario_id')
                        ->where('cliente_id', $cliente->id)
                        ->get();

                    if (count($respuestas) == 0) {

                        for ($i=0; $i < count($misCampanas); $i++) { 
                            $misCampanas[$i]->cuest = $misCampanas[$i]->cuestionarios;

                            //Para hacer menos denso el json
                            $misCampanas[$i]->categorias = null;
                            $misCampanas[$i]->estados = null;
                            $misCampanas[$i]->municipios = null;
                            $misCampanas[$i]->localidades = null;  
                        }

                        return response()->json(['message'=>'El cliente no ha registrado respuestas.','campanas'=>$misCampanas], 200);
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
                        $auxCamp2 = [];
                        for ($i=0; $i < count($misCampanas); $i++) { 
                            if (count($misCampanas[$i]->cuest) != 0) {

                                //Para hacer menos denso el json
                                $misCampanas[$i]->categorias = null;
                                $misCampanas[$i]->estados = null;
                                $misCampanas[$i]->municipios = null;
                                $misCampanas[$i]->localidades = null;
                            
                                array_push($auxCamp2, $misCampanas[$i]);
                            }
                        }

                    }

                    return response()->json(['message'=>'Tienes evaluaciones por responder.', /*'cliente'=>$cliente, 'respuestas'=>$respuestas,*/ 'campanas'=>$auxCamp2], 200);

                }

            }
        }
    }

    /*usuario_id id de la tabla usuarios*/
    public function setTokenNotificaion(Request $request, $usuario_id)
    {
        // Comprobamos si el usuario que nos están pasando existe o no.
        $usuario=\App\User::find($usuario_id);

        if (count($usuario)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el usuario con id '.$usuario_id], 404);
        }

        $token_notificacion=$request->input('token_notificacion');

        // Creamos una bandera para controlar si se ha modificado algún dato.
        $bandera = false;

        // Actualización parcial de campos.
        if ($token_notificacion != null && $token_notificacion!='')
        {
            $usuario->token_notificacion = $token_notificacion;
            $bandera=true;
        }

        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($usuario->save()) {
                return response()->json(['message'=>'Toke de notificación actualizado con éxito.', 'usuario'=>$usuario], 200);
            }else{
                return response()->json(['error'=>'Error al actualizar el usuario.'], 500);
            }
            
        }
        else
        {
            // Se devuelve un array error con los error encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato del usuario.'],409);
        }
    }
}
