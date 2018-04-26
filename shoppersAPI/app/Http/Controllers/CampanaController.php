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
       
        //Eliminar las relaciones(sucursales) en la tabla pivote
        $campana->sucursales()->detach();

        // Eliminamos el campana.
        $campana->delete();

        return response()->json(['message'=>'Se ha eliminado correctamente la campaña.'], 200);
    }
}
