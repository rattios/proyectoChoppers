<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Encryption;
use Illuminate\Support\Facades\Crypt;

class TarjetaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($empresa_id)
    {
        //cargar un empresa
        $empresa = \App\Empresa::find($empresa_id);
        if(count($empresa)==0){
            return response()->json(['error'=>'No existe la empresa con id '.$empresa_id], 404);          
        }

        //Cargar las tarjetas de una empresa_id
        $tarjetas = \App\Tarjeta::
            with(['empresa' => function ($query) {
                $query->select('id', 'customer_id', 'user_id');
            }])
            ->where('empresa_id', $empresa_id)
            ->get();

        for ($i=0; $i < count($tarjetas) ; $i++) { 
            $tarjetas[$i]->tarjeta = Crypt::decrypt($tarjetas[$i]->tarjeta);
            $tarjetas[$i]->fecha_vencimiento = Crypt::decrypt($tarjetas[$i]->fecha_vencimiento);
        }

        return response()->json(['tarjetas'=>$tarjetas], 200);

        /*if(count($tarjetas) == 0){
            return response()->json(['error'=>'La empresa no tiene tarjetas.'], 404);          
        }else{
            return response()->json(['tarjetas'=>$tarjetas], 200);
        }*/
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
        if ( !$request->input('empresa_id'))
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Falta el parámetro empresa_id.'],422);
        }
        if ( !$request->input('tarjeta'))
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Falta el parámetro tarjeta.'],422);
        }
        if ( !$request->input('tipo'))
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Falta el parámetro tipo.'],422);
        }
        if ( !$request->input('fecha_vencimiento'))
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Falta el parámetro fecha_vencimiento.'],422);
        }

        //cargar un empresa
        $empresa = \App\Empresa::find($request->input('empresa_id'));
        if(count($empresa)==0){
            return response()->json(['error'=>'No existe la empresa con id '.$request->input('empresa_id')], 404);          
        }

        if ($request->has('tarjeta')) {
            if ($request->input('tarjeta') != 'null' && $request->input('tarjeta') != null && $request->input('tarjeta') != '') {

                $auxTarjetas = \App\Tarjeta::
                    where('empresa_id', $request->input('empresa_id'))
                    ->get();

                for ($i=0; $i < count($auxTarjetas); $i++) { 
                    $auxTarjetas[$i]->tarjeta = Crypt::decrypt($auxTarjetas[$i]->tarjeta);

                    if ($auxTarjetas[$i]->tarjeta == $request->input('tarjeta') && $auxTarjetas[$i]->tipo == $request->input('tipo')) {
                        // Devolvemos un código 409 Conflict. 
                        return response()->json(['error'=>'La tarjeta '.$request->input('tarjeta').' ya está asociada a esta empresa.'], 409);
                    }
                }

            }
        }

        /*Primero creo una instancia en la tabla tarjetas*/
        $nuevaTarjeta = new \App\Tarjeta;
        $nuevaTarjeta->token_id=$request->input('token_id');
        $nuevaTarjeta->tarjeta=Crypt::encrypt($request->input('tarjeta'));
        $nuevaTarjeta->fecha_vencimiento=Crypt::encrypt($request->input('fecha_vencimiento'));
        $nuevaTarjeta->tipo=$request->input('tipo');
        $nuevaTarjeta->empresa_id=$request->input('empresa_id');

        if($nuevaTarjeta->save()){
           return response()->json(['message'=>'Tarjeta creada con éxito.',
             'tarjeta'=>$nuevaTarjeta], 200);
        }else{
            return response()->json(['error'=>'Error al crear la tarjeta.'], 500);
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
        //cargar un tarjeta
        $tarjetaObj = \App\Tarjeta::
            with(['empresa' => function ($query) {
                $query->select('id', 'customer_id', 'user_id');
            }])
            ->find($id);

        if(count($tarjetaObj)==0){
            return response()->json(['error'=>'No existe la tarjeta con id '.$id], 404);          
        }else{

            $tarjetaObj->tarjeta = Crypt::decrypt($tarjetaObj->tarjeta);
            $tarjetaObj->fecha_vencimiento = Crypt::decrypt($tarjetaObj->fecha_vencimiento);

            return response()->json(['tarjeta'=>$tarjetaObj], 200);
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
        // Comprobamos si la tarjeta que nos están pasando existe o no.
        $tarjetaObj=\App\Tarjeta::find($id);

        if (count($tarjetaObj)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe la tarjeta con id '.$id], 404);
        }      

        // Listado de campos recibidos teóricamente.
        $token_id=$request->input('token_id');
        $tarjeta=$request->input('tarjeta');
        $fecha_vencimiento=$request->input('fecha_vencimiento');
        $tipo=$request->input('tipo');
        //$empresa_id=$request->input('empresa_id');

        // Creamos una bandera para controlar si se ha modificado algún dato.
        $bandera = false;

        // Actualización parcial de campos.
        if ($token_id != null && $token_id!='')
        {
            
            $tarjetaObj->token_id = $token_id;
            $bandera=true;
        }

        if ($tarjeta != null && $tarjeta!='')
        {

            $auxTarjetas = \App\Tarjeta::
                where('empresa_id', $tarjetaObj->empresa_id)
                ->where('id', '<>', $tarjetaObj->id)
                ->get();

            for ($i=0; $i < count($auxTarjetas); $i++) { 
                $auxTarjetas[$i]->tarjeta = Crypt::decrypt($auxTarjetas[$i]->tarjeta);

                if ($auxTarjetas[$i]->tarjeta == $tarjeta) {
                    // Devolvemos un código 409 Conflict. 
                    return response()->json(['error'=>'La tarjeta '.$tarjeta.' ya está asociada a esta empresa.'], 409);
                }
            }

            $tarjetaObj->tarjeta = Crypt::encrypt($tarjeta);
            $bandera=true;
        }

        if ($fecha_vencimiento != null && $fecha_vencimiento!='')
        {
            $tarjetaObj->fecha_vencimiento = Crypt::encrypt($fecha_vencimiento);
            $bandera=true;
        }

        if ($tipo != null && $tipo!='')
        {
            $tarjetaObj->tipo = $tipo;
            $bandera=true;
        }

        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($tarjetaObj->save()) {

                $tarjetaObj->tarjeta = Crypt::decrypt($tarjetaObj->tarjeta);
                $tarjetaObj->fecha_vencimiento = Crypt::decrypt($tarjetaObj->fecha_vencimiento);
                return response()->json(['message'=>'Tarjeta editada con éxito.',
                    'tarjeta'=>$tarjetaObj], 200);
            }else{
                return response()->json(['error'=>'Error al actualizar la tarjeta.'], 500);
            }
            
        }
        else
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato a la tarjeta.'],409);
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
        // Comprobamos si la tarjeta que nos están pasando existe o no.
        $tarjeta=\App\Tarjeta::find($id);

        if (count($tarjeta)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe la tarjeta con id '.$id], 404);
        } 

        // Eliminamos.
        $tarjeta->delete();

        return response()->json(['message'=>'Se ha eliminado correctamente la tarjeta.'], 200);
    }
}
