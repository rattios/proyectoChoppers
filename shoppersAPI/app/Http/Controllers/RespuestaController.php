<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class RespuestaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //cargar todos las respuestas
        $respuestas = \App\Respuesta::get();

        if(count($respuestas) == 0){
            return response()->json(['error'=>'No existen respuestas.'], 404);          
        }else{
            return response()->json(['respuestas'=>$respuestas], 200);
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
        if ( !$request->input('campana_id') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parámetro campana_id.'],422);
        }

        if ( !$request->input('sucursal_id') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parámetro sucursal_id.'],422);
        }

        if ( !$request->input('cliente_id') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parámetro cliente_id.'],422);
        }

        if ( !$request->input('cuestionario_id') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parámetro cuestionario_id.'],422);
        }

        $campana = \App\Campana::find($request->input('campana_id'));
        if(count($campana) == 0){
           // Devolvemos un código 409 Conflict. 
            return response()->json(['error'=>'No existe la campaña con id '.$request->input('campana_id')], 409);
        }

        $sucursal = \App\Sucursal::find($request->input('sucursal_id'));
        if(count($sucursal) == 0){
           // Devolvemos un código 409 Conflict. 
            return response()->json(['error'=>'No existe la sucursal con id '.$request->input('sucursal_id')], 409);
        }

        $cliente = \App\User::find($request->input('cliente_id'));
        if(count($cliente) == 0){
           // Devolvemos un código 409 Conflict. 
            return response()->json(['error'=>'No existe el cliente con id '.$request->input('cliente_id')], 409);
        }

        $cuestionario = \App\Cuestionario::find($request->input('cuestionario_id'));
        if(count($cuestionario) == 0){
           // Devolvemos un código 409 Conflict. 
            return response()->json(['error'=>'No existe el cuestionario con id '.$request->input('cuestionario_id')], 409);
        }

        if ($cuestionario->num_cuestionarios <= 0) {
            // Devolvemos un código 409 Conflict. 
            return response()->json(['error'=>'Lo sentimos, ya se ha alcanzado el límite de respuestas para este cuestionario.'], 409);
        }else{
            if ($cuestionario->num_cuestionarios == 1) {
                $cuestionario->num_cuestionarios = 0;
            }else{
                $cuestionario->num_cuestionarios = $cuestionario->num_cuestionarios - 1;
            }
        }

        if($respuesta=\App\Respuesta::create($request->all())){

            $cuestionario->save();

           return response()->json(['message'=>'Respuesta creada con éxito.',
             'respuesta'=>$respuesta], 200);
        }else{
            return response()->json(['error'=>'Error al crear la respuesta.'], 500);
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
        //cargar una respuesta
        $respuesta = \App\Respuesta::
            with(['campana' => function ($query) {
                $query->select('id', 'nombre', 'empresa_id');
            }])
            ->with(['sucursal' => function ($query) {
                $query->select('id', 'nombre', 'direccion', 'logo', 'empresa_id');
            }])
            ->with(['cuest' => function ($query) {
                $query->select('id', 'nombre', 'descripcion', 'campana_id');
            }])
            ->find($id);


        if(count($respuesta)==0){
            return response()->json(['error'=>'No existe la respuesta con id '.$id], 404);          
        }else{

            return response()->json(['respuesta'=>$respuesta], 200);
        }
    }

    public function respuesta($id)
    {
        //cargar una respuestaº
        $respuesta = \App\Respuesta::where('cuestionario_id',$id)->get();

        for ($i=0; $i < count($respuesta); $i++) { 
            $respuesta[$i]->cuestionario=json_decode($respuesta[$i]->cuestionario);
        }

        if(count($respuesta)==0){
            return response()->json(['error'=>'No existe la respuesta con id '.$id], 404);          
        }else{

            return response()->json(['respuesta'=>$respuesta], 200);
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
        // Comprobamos si la respuesta que nos están pasando existe o no.
        $respuesta=\App\Respuesta::find($id);

        if (count($respuesta)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe la respuesta con id '.$id], 404);
        }  

        $respuesta->fill($request->all());

        // Almacenamos en la base de datos el registro.
        if ($respuesta->save()) {
            return response()->json(['message'=>'Respuesta editada con éxito.',
                'respuesta'=>$respuesta], 200);
        }else{
            return response()->json(['error'=>'Error al actualizar la respuesta.'], 500);
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
        // Comprobamos si la respuesta que nos están pasando existe o no.
        $respuesta=\App\Respuesta::find($id);

        if (count($respuesta)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe la respuesta con id '.$id], 404);
        } 

        // Eliminamos.
        $respuesta->delete();

        return response()->json(['message'=>'Se ha eliminado correctamente la respuesta.'], 200);
    }

    public function evaluacionesRespondidas($cliente_id)
    {
        //cargar las evaluaciones del cliente
        $respuestas = \App\Respuesta::select('id', 'imagen_factura', 'estado_pagado', 'monto_pagado', 'campana_id', 'sucursal_id', 'cliente_id', 'cuestionario_id', 'created_at', 'updated_at')
            ->with(['campana' => function ($query) {
                $query->select('id', 'nombre', 'empresa_id');
            }])
            ->with(['sucursal' => function ($query) {
                $query->select('id', 'nombre', 'direccion', 'logo', 'empresa_id');
            }])
            ->with(['cuest' => function ($query) {
                $query->select('id', 'nombre', 'descripcion', 'campana_id');
            }])
            ->where('cliente_id', $cliente_id)
            ->get();

        if(count($respuestas)==0){
            return response()->json(['error'=>'No has respondido evaluaciones.'], 404);          
        }else{

            return response()->json(['respuestas'=>$respuestas], 200);
        }
    }
}
