<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use Exception;
use DB;

class CuestionarioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //cargar todos los cuestionarios
        $cuestionarios = \App\Cuestionario::get();

        if(count($cuestionarios) == 0){
            return response()->json(['error'=>'No existen cuestionarios.'], 404);          
        }else{
            return response()->json(['cuestionarios'=>$cuestionarios], 200);
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

                    if (!$permisos || $permisos->cuest_crear != 1 ) {
                        return response()->json(['error'=>'Este usuario no tiene permisos para crear cuestionarios.'], 401);
                    }
                }        
                
            }else{        
                return response()->json(['error'=>'Usuario no autenticado.'], 500);        
            }

        } catch (Exception $e) {
            return response()->json(['error'=>'Usuario no autenticado.'], 500);
        }

        // Primero comprobaremos si estamos recibiendo todos los campos.
        if ( !$request->input('campana_id') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro campana_id.'],422);
        }

        $campana = \App\Campana::find($request->input('campana_id'));
        if(count($campana) == 0){
           // Devolvemos un código 409 Conflict. 
            return response()->json(['error'=>'No existe la campaña con id '.$request->input('campana_id')], 409);
        }

        if($cuestionario=\App\Cuestionario::create($request->all())){

           return response()->json(['message'=>'Cuestionario creado con éxito.',
             'cuestionario'=>$cuestionario], 200);
        }else{
            return response()->json(['error'=>'Error al crear el cuestionario.'], 500);
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
        //cargar un cuestionario
        $cuestionario = \App\Cuestionario::find($id);

        if(count($cuestionario)==0){
            return response()->json(['error'=>'No existe el cuestionario con id '.$id], 404);          
        }else{

            return response()->json(['cuestionario'=>$cuestionario], 200);
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
        // Comprobamos si el cuestionario que nos están pasando existe o no.
        $cuestionario=\App\Cuestionario::find($id);

        if (count($cuestionario)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el cuestionario con id '.$id], 404);
        }  

        $cuestionario->fill($request->all());

        // Almacenamos en la base de datos el registro.
        if ($cuestionario->save()) {
            return response()->json(['message'=>'Cuestionario editado con éxito.',
                'cuestionario'=>$cuestionario], 200);
        }else{
            return response()->json(['error'=>'Error al actualizar el cuestionario.'], 500);
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
        // Comprobamos si el cuestionario que nos están pasando existe o no.
        $cuestionario=\App\Cuestionario::find($id);

        if (count($cuestionario)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el cuestionario con id '.$id], 404);
        } 

        // Eliminamos.
        $cuestionario->delete();

        return response()->json(['message'=>'Se ha eliminado correctamente el cuestionario.'], 200);
    }

    /*Recuperar los cuestionarios de una campaña_id*/
    public function filterCuest($campana_id)
    {
        //cargar los cuestionarios
        $cuestionarios = \App\Cuestionario::where('campana_id', $campana_id)->get();

        if(count($cuestionarios)==0){
            return response()->json(['error'=>'No existen el cuestionarios en la campaña.'], 404);          
        }else{

            return response()->json(['cuestionarios'=>$cuestionarios], 200);
        }
    }

    /*Recuperar los cuestionarios de una sucursal_id*/
    public function filterCuest2($sucursal_id)
    {
        //cargar los cuestionarios
        $cuestionarios = \App\Cuestionario::
            whereHas('campana.sucursales', function ($query) use ($sucursal_id) {
                    $query->where('campana_sucursales.sucursal_id', $sucursal_id);
                })
            ->get();

        if(count($cuestionarios)==0){
            return response()->json(['error'=>'No existen el cuestionarios en la sucursal.'], 404);          
        }else{

            return response()->json(['cuestionarios'=>$cuestionarios], 200);
        }
    }

    /*Recuperar los cuestionarios activos de una sucursal_id*/
    public function filterCuestActivos($sucursal_id)
    {
        //cargar los cuestionarios
        $cuestionarios = \App\Cuestionario::
            whereHas('campana.sucursales', function ($query) use ($sucursal_id) {
                    $query->where('campana_sucursales.sucursal_id', $sucursal_id)
                        ->where('campanas.f_fin', '>=', DB::raw("now()"))
                        ;
                })
            ->where(function ($query) {
                    $query
                        ->where('estado', '!=', 3)
                        ->orWhere('num_cuestionarios', '>', 0);
                })
            ->get();

        if(count($cuestionarios)==0){
            return response()->json(['error'=>'No existen el cuestionarios activos en la sucursal.'], 404);          
        }else{

            return response()->json(['cuestionarios'=>$cuestionarios], 200);
        }
    }

    /*Recuperar los cuestionarios finalizados de una sucursal_id*/
    public function filterCuestFinalizados($sucursal_id)
    {
        //cargar los cuestionarios
        $cuestionarios = \App\Cuestionario::
            whereHas('campana.sucursales', function ($query) use ($sucursal_id) {
                    $query->where('campana_sucursales.sucursal_id', $sucursal_id)
                        /*->where('campanas.f_fin', '<', DB::raw("now()"))*/
                        ;
                })
            ->where(function ($query) {
                    $query
                        ->where('estado', 3)
                        ->orWhere('num_cuestionarios', 0);
                })
            ->get();

        if(count($cuestionarios)==0){
            return response()->json(['error'=>'No existen el cuestionarios finalizados en la sucursal.'], 404);          
        }else{

            return response()->json(['cuestionarios'=>$cuestionarios], 200);
        }
    }
}
