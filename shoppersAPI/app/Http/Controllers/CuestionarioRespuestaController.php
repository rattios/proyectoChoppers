<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class CuestionarioRespuestaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //cargar todos los cuestionarios de respuestas
        $cuestRespuesta = \App\CuestionarioRespuesta::get();

        if(count($cuestRespuesta) == 0){
            return response()->json(['error'=>'No existen cuestionarios respuesta.'], 404);          
        }else{
            return response()->json(['cuestRespuesta'=>$cuestRespuesta], 200);
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
        if($cuestRespuesta=\App\CuestionarioRespuesta::create($request->all())){

           return response()->json(['message'=>'Cuestionario respuesta creado con éxito.',
             'cuestRespuesta'=>$cuestRespuesta], 200);
        }else{
            return response()->json(['error'=>'Error al crear el cuestionario respuesta.'], 500);
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
        $cuestRespuesta = \App\CuestionarioRespuesta::find($id);

        if(count($cuestRespuesta)==0){
            return response()->json(['error'=>'No existe el cuestionario respuesta con id '.$id], 404);          
        }else{

            return response()->json(['cuestRespuesta'=>$cuestRespuesta], 200);
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
        $cuestRespuesta=\App\CuestionarioRespuesta::find($id);

        if (count($cuestRespuesta)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el cuestionario respuesta con id '.$id], 404);
        }  

        $cuestRespuesta->fill($request->all());

        // Almacenamos en la base de datos el registro.
        if ($cuestRespuesta->save()) {
            return response()->json(['message'=>'Cuestionario respuesta editado con éxito.',
                'cuestRespuesta'=>$cuestRespuesta], 200);
        }else{
            return response()->json(['error'=>'Error al actualizar el cuestionario respuesta.'], 500);
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
        $cuestRespuesta=\App\CuestionarioRespuesta::find($id);

        if (count($cuestRespuesta)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el cuestionario respuesta con id '.$id], 404);
        } 

        // Eliminamos.
        $cuestRespuesta->delete();

        return response()->json(['message'=>'Se ha eliminado correctamente el cuestionario respuesta.'], 200);
    }
}
