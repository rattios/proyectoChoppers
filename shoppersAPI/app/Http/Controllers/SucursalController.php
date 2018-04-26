<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class SucursalController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //cargar todas las sucursales
        $sucursales = \App\Sucursal::with('empresa.usuario')->get();

        if(count($sucursales) == 0){
            return response()->json(['error'=>'No existen sucursales.'], 404);          
        }else{
            return response()->json(['sucursales'=>$sucursales], 200);
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
        if ( !$request->input('empresa_id') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro empresa_id.'],422);
        }

        $empresa = \App\Empresa::find($request->input('empresa_id'));
        if(count($empresa)==0){
            //Devolvemos un código 404. 
                return response()->json(['error'=>'No existe la empresa con id '.$request->input('empresa_id')], 404);
        }

        /*if ( $request->input('nombre') )
        {
            if ($request->input('nombre') != null && $request->input('nombre') != '') {
                $aux1=\App\Sucursal::where('nombre', $request->input('nombre'))->get();
                if(count($aux1) != 0){
                    //Devolvemos un código 409. 
                        return response()->json(['error'=>'Ya existe una sucursal con el nombre '.$request->input('nombre')], 409);
                }
            }
        }

        if ( $request->input('email') )
        {
            if ($request->input('email') != null && $request->input('email') != '') {
                $aux2=\App\Sucursal::where('email', $request->input('email'))->get();
                if(count($aux2) != 0){
                    //Devolvemos un código 409. 
                        return response()->json(['error'=>'Ya existe una sucursal con el email '.$request->input('email')], 409);
                }
            }
        }*/

        if($sucursal=\App\Sucursal::create($request->all())){
           return response()->json(['message'=>'Sucursal creada con éxito.',
             'sucursal'=>$sucursal], 200);
        }else{
            return response()->json(['error'=>'Error al crear la sucursal.'], 500);
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
        //cargar una sucursal
        $sucursal = \App\Sucursal::with('empresa.usuario')->find($id);

        if(count($sucursal)==0){
            return response()->json(['error'=>'No existe la sucursal con id '.$id], 404);          
        }else{

            return response()->json(['sucursal'=>$sucursal], 200);
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
        // Comprobamos si la sucursal que nos están pasando existe o no.
        $sucursal=\App\Sucursal::find($id);

        if (count($sucursal)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe la sucursal con id '.$id], 404);
        }

        /*if ( $request->input('nombre') )
        {
            if ($request->input('nombre') != null && $request->input('nombre') != '') {
                $aux1=\App\Sucursal::where('id', '<>', $sucursal->id)
                    ->where('nombre', $request->input('nombre'))->get();
                if(count($aux1) != 0){
                    //Devolvemos un código 409. 
                        return response()->json(['error'=>'Ya existe otra sucursal con el nombre '.$request->input('nombre')], 409);
                }
            }
        }

        if ( $request->input('email') )
        {
            if ($request->input('email') != null && $request->input('email') != '') {
                $aux2=\App\Sucursal::where('id', '<>', $sucursal->id)
                    ->where('email', $request->input('email'))->get();
                if(count($aux2) != 0){
                    //Devolvemos un código 409. 
                        return response()->json(['error'=>'Ya existe otra sucursal con el email '.$request->input('email')], 409);
                }
            }
        }   */   

        $sucursal->fill($request->all());

        // Almacenamos en la base de datos el registro.
        if ($sucursal->save()) {
            return response()->json(['message'=>'Sucursal editada con éxito.',
                'sucursal'=>$sucursal], 200);
        }else{
            return response()->json(['error'=>'Error al actualizar la sucursal.'], 500);
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

    public function sucursalCampanas($id)
    {
        //cargar una sucursal
        $sucursal = \App\Sucursal::with('campanas')->find($id);

        if(count($sucursal)==0){
            return response()->json(['error'=>'No existe la sucursal con id '.$id], 404);          
        }else{

            return response()->json(['sucursal'=>$sucursal], 200);
        }
    }
}
