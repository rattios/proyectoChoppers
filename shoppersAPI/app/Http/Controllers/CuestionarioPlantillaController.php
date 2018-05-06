<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class CuestionarioPlantillaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //cargar todos los cuestionarios
        $cuestionarios = \App\CuestionarioPlantilla::get();

        if(count($cuestionarios) == 0){
            return response()->json(['error'=>'No existen cuestionarios plantilla.'], 404);          
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
        if($cuestionario=\App\CuestionarioPlantilla::create($request->all())){

           return response()->json(['message'=>'Cuestionario plantilla creado con éxito.',
             'cuestionario'=>$cuestionario], 200);
        }else{
            return response()->json(['error'=>'Error al crear el cuestionario plantilla.'], 500);
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
        $cuestionario = \App\CuestionarioPlantilla::find($id);

        if(count($cuestionario)==0){
            return response()->json(['error'=>'No existe el cuestionario plantilla con id '.$id], 404);          
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
        $cuestionario=\App\CuestionarioPlantilla::find($id);

        if (count($cuestionario)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el cuestionario plantilla con id '.$id], 404);
        }  

        $cuestionario->fill($request->all());

        // Almacenamos en la base de datos el registro.
        if ($cuestionario->save()) {
            return response()->json(['message'=>'Cuestionario plantilla editado con éxito.',
                'cuestionario'=>$cuestionario], 200);
        }else{
            return response()->json(['error'=>'Error al actualizar el cuestionario plantilla.'], 500);
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
        $cuestionario=\App\CuestionarioPlantilla::find($id);

        if (count($cuestionario)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el cuestionario plantilla con id '.$id], 404);
        } 

        // Eliminamos.
        $cuestionario->delete();

        return response()->json(['message'=>'Se ha eliminado correctamente el cuestionario plantilla.'], 200);
    }
}
