<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class MxEstadosController extends Controller
{
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

    /*Retorna todos los estados*/
    public function getEstados()
    {
        //cargar todos los estados
        $estados = \App\Estado::all();

        if(count($estados) == 0){
            return response()->json(['error'=>'No existen estados.'], 404);          
        }else{
            return response()->json(['estados'=>$estados], 200);
        }
    }

    /*Retorna todos los municipios del estado_id*/
    public function getMunicipios(Request $request)
    {
        if (!$request->input('estado_id')) {
            return response()->json(['error'=>'Falta el parametro estado_id.'],422);
        }

        //cargar todos los municipios del estado_id
        $municipios = \App\Municipio::where('estado_id',$request->input('estado_id'))->get();

        if(count($municipios) == 0){
            return response()->json(['error'=>'No existen municipios.'], 404);          
        }else{
            return response()->json(['municipios'=>$municipios], 200);
        }
    }

    /*Retorna todos los localidades del municipio_id*/
    public function getLocalidades(Request $request)
    {
        if (!$request->input('municipio_id')) {
            return response()->json(['error'=>'Falta el parametro municipio_id.'],422);
        }

        //cargar todas las localidades del municipio_id
        $localidades = \App\Localidad::where('municipio_id',$request->input('municipio_id'))->get();

        if(count($localidades) == 0){
            return response()->json(['error'=>'No existen localidades.'], 404);          
        }else{
            return response()->json(['localidades'=>$localidades], 200);
        }
    }

}
