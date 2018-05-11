<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use Exception;

class CampanaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //cargar todas las campanas
        $campanas = \App\Campana::with('sucursales')->get();

        if(count($campanas) == 0){
            return response()->json(['error'=>'No existen campañas.'], 404);          
        }else{
            return response()->json(['campanas'=>$campanas], 200);
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

        try{ 
            $currentUser = JWTAuth::parseToken()->authenticate();

            if ($currentUser) {       
           
                if ($currentUser->tipo_usuario == 3) {
                    $permisos = $currentUser->empleado->permisos;

                    if (!$permisos || $permisos->camp_crear != 1 ) {
                        return response()->json(['error'=>'Este usuario no tiene permisos para crear campañas.'], 401);
                    }
                }        
                
            }else{        
                return response()->json(['error'=>'Usuario no autenticado.'], 500);        
            }

        } catch (Exception $e) {
            return response()->json(['error'=>'Usuario no autenticado.'], 500);
        }
        

        // Primero comprobaremos si estamos recibiendo todos los campos.
        if ( !$request->input('sucursales') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro sucursales.'],422);
        }

        $sucursales = null;
        if ($request->input('sucursales')) {
            //Verificar que todas las sucursales existen
            $sucursales = json_decode($request->input('sucursales'));
            for ($i=0; $i < count($sucursales) ; $i++) { 
                $aux2 = \App\Sucursal::find($sucursales[$i]->id);
                if(count($aux2) == 0){
                   // Devolvemos un código 409 Conflict. 
                    return response()->json(['error'=>'No existe la sucursal con id '.$sucursales[$i]->id], 409);
                }   
            } 
        }

        if($campana=\App\Campana::create($request->all())){

            if ($sucursales) {
                //Crear las relaciones (sucursales) en la tabla pivote
                for ($i=0; $i < count($sucursales) ; $i++) { 

                    $campana->sucursales()->attach($sucursales[$i]->id);
                       
                }
            }

            //Enviar notificacion al dueño de la empresa
            $empresa = \App\Empresa::with('usuario')
                ->find($sucursales[0]->empresa_id);

            if ($empresa->usuario->token_notificacion) {

                $explode1 = explode(" ",$request->input('nombre_empleado'));
                $nomEmpleado = null;
                for ($i=0; $i < count($explode1); $i++) { 
                    $nomEmpleado = $nomEmpleado.$explode1[$i].'%20'; 
                }

                $explode2 = explode(" ",$request->input('nombre'));
                $nomCampana = null;
                for ($i=0; $i < count($explode2); $i++) { 
                    $nomCampana = $nomCampana.$explode2[$i].'%20'; 
                }

                $this->enviarNotificacion($empresa->usuario->token_notificacion, $nomEmpleado.'ha%20creado%20la%20campaña:%20'.$nomCampana);
            }

           return response()->json(['message'=>'Campaña creada con éxito.',
             'campana'=>$campana], 200);
        }else{
            return response()->json(['error'=>'Error al crear la campaña.'], 500);
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
        //cargar una campaña
        $campana = \App\Campana::with('sucursales')->find($id);

        if(count($campana)==0){
            return response()->json(['error'=>'No existe la campaña con id '.$id], 404);          
        }else{

            return response()->json(['campana'=>$campana], 200);
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
        // Comprobamos si la campana que nos están pasando existe o no.
        $campana=\App\Campana::find($id);

        if (count($campana)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe la campaña con id '.$id], 404);
        }

        // Listado de campos recibidos teóricamente.
        $sucursales=$request->input('sucursales');

        if ($sucursales) {
            $sucursales = json_decode($request->input('sucursales'));

            //Eliminar las relaciones(sucursales) en la tabla pivote
            $campana->sucursales()->detach();

            //Agregar las nuevas relaciones(sucursales) en la tabla pivote
            for ($i=0; $i < count($sucursales) ; $i++) { 
                  $campana->sucursales()->attach($sucursales[$i]->id);
            }

        }   

        $campana->fill($request->all());

        // Almacenamos en la base de datos el registro.
        if ($campana->save()) {
            return response()->json(['message'=>'Campaña editada con éxito.',
                'campana'=>$campana], 200);
        }else{
            return response()->json(['error'=>'Error al actualizar la campaña.'], 500);
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
        // Comprobamos si la campaña que nos están pasando existe o no.
        $campana=\App\Campana::find($id);

        if (count($campana)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe la campaña con id '.$id], 404);
        }

        $cuestionarios = $campana->cuestionarios;
        if (sizeof($cuestionarios) > 0)
        {
            // Eliminamos los cuestionarios.
            for ($i=0; $i < count($cuestionarios) ; $i++) { 
                $cuestionarios[$i]->delete();
            }
        }

        $respuestas = $campana->respuestas;
        if (sizeof($respuestas) > 0)
        {
            // Eliminamos las respuestas.
            for ($i=0; $i < count($respuestas) ; $i++) { 
                $respuestas[$i]->delete();
            }
        } 
       
        //Eliminar las relaciones(sucursales) en la tabla pivote
        $campana->sucursales()->detach();

        // Eliminamos el campana.
        $campana->delete();

        return response()->json(['message'=>'Se ha eliminado correctamente la campaña.'], 200);
    }

    /*filtrar los clientes para enviar las notificaciones*/
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

        return $cliente->with(['usuario' => function ($query) {
                $query->select('id', 'nombre', 'email', 'tipo_usuario');
            }])->get();

        //return $cliente->select('id', 'token_notificacion')->get();
    }

    //Enviar notificacion a un dispositivo mediante su token_notificacion
    public function enviarNotificacion($token_notificacion, $msg)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://shopper.internow.com.mx/onesignal.php?contenido=".$msg."&token_notificacion=".$token_notificacion);
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

    public function notificarEmpleados(Request $request)
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

            $explode2 = explode(" ",$request->input('nombre_campana'));
            $nomCampana = null;
            for ($i=0; $i < count($explode2); $i++) { 
                $nomCampana = $nomCampana.$explode2[$i].'%20'; 
            }

            for ($i=0; $i < count($empleados); $i++) { 
                if ($empleados[$i]->usuario->token_notificacion) {

                    $this->enviarNotificacion($empleados[$i]->usuario->token_notificacion, 'El%20presupuesto%20de%20la%20campaña%20'.$nomCampana.'ha%20sido%20asignado');
                }
            }

            return response()->json(['message'=>'Los empleados han sido notificados.'], 200);
        }
    }
}
