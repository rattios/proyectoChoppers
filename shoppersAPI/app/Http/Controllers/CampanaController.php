<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

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
        $campanas = \App\Campana::with('sucursal')->get();

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
                // Primero comprobaremos si estamos recibiendo todos los campos.
        if ( !$request->input('sucursal_id') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro sucursal_id.'],422);
        }

        $sucursal = \App\Sucursal::find($request->input('sucursal_id'));
        if(count($sucursal)==0){
            //Devolvemos un código 404. 
                return response()->json(['error'=>'No existe la sucursal con id '.$request->input('sucursal_id')], 404);
        }

        if($campana=\App\Campana::create($request->all())){
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
        $campana = \App\Campana::with('sucursal')->find($id);

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
        //
    }
}
