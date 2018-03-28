<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class PermisoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //cargar todos los permisos
        $permisos = \App\Permiso::with('empleado')->get();

        if(count($permisos) == 0){
            return response()->json(['error'=>'No existen permisos.'], 404);          
        }else{
            return response()->json(['permisos'=>$permisos], 200);
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
        if ( !$request->input('empleado_id') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro empleado_id.'],422);
        }

        $empleado = \App\Empleado::find($request->input('empleado_id'));
        if(count($empleado)==0){
            //Devolvemos un código 404. 
                return response()->json(['error'=>'No existe el empleado con id '.$request->input('empleado_id')], 404);
        }

        $permisos = $empleado->permisos;
        if (sizeof($permisos) > 0)
        {
            // Devolvemos un código 409 Conflict. 
            return response()->json(['error'=>'El empleado ya posse sus permisos registrados.'], 409);
        }

        if($permiso=\App\Permiso::create($request->all())){
           return response()->json(['message'=>'Permisos creados con éxito.',
             'permiso'=>$permiso], 200);
        }else{
            return response()->json(['error'=>'Error al crear los permisos.'], 500);
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
        //cargar un permiso
        $permiso = \App\Permiso::with('empleado')->find($id);

        if(count($permiso)==0){
            return response()->json(['error'=>'No existen los permisos con id '.$id], 404);          
        }else{

            return response()->json(['permiso'=>$permiso], 200);
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
        // Comprobamos si los permisos que nos están pasando existe o no.
        $permiso=\App\Permiso::find($id);

        if (count($permiso)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existen los permisos con id '.$id], 404);
        }      

        $permiso->fill($request->all());

        // Almacenamos en la base de datos el registro.
        if ($permiso->save()) {
            return response()->json(['message'=>'Permisos editados con éxito.',
                'permiso'=>$permiso], 200);
        }else{
            return response()->json(['error'=>'Error al actualizar los permisos.'], 500);
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
}
