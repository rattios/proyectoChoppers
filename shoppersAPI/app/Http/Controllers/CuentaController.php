<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Encryption;
use Illuminate\Support\Facades\Crypt;

class CuentaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($cliente_id)
    {
        //cargar un cliente
        $cliente = \App\Cliente::with('usuario')->find($cliente_id);
        if(count($cliente)==0){
            return response()->json(['error'=>'No existe el cliente con id '.$cliente_id], 404);          
        }

        //Cargar las cuentas de un cliente_id
        $cuentas = \App\Cuenta::
            where('cliente_id', $cliente_id)
            ->get();

        for ($i=0; $i < count($cuentas) ; $i++) { 
            $cuentas[$i]->cuenta = Crypt::decrypt($cuentas[$i]->cuenta);
        }

        return response()->json(['cliente'=>$cliente, 'cuentas'=>$cuentas], 200);
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
        if ( !$request->input('cliente_id'))
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Falta el parámetro cliente_id.'],422);
        }
        if ( !$request->input('cuenta'))
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Falta el parámetro cuenta.'],422);
        }


        //cargar un cliente
        $cliente = \App\Cliente::find($request->input('cliente_id'));
        if(count($cliente)==0){
            return response()->json(['error'=>'No existe el cliente con id '.$request->input('cliente_id')], 404);          
        }

        if ($request->has('cuenta')) {
            if ($request->input('cuenta') != 'null' && $request->input('cuenta') != null && $request->input('cuenta') != '') {

                $auxCuentas = \App\Cuenta::
                    where('cliente_id', $request->input('cliente_id'))
                    ->get();

                for ($i=0; $i < count($auxCuentas); $i++) { 
                    $auxCuentas[$i]->cuenta = Crypt::decrypt($auxCuentas[$i]->cuenta);

                    if ($auxCuentas[$i]->cuenta == $request->input('cuenta')) {
                        // Devolvemos un código 409 Conflict. 
                        return response()->json(['error'=>'La cuenta '.$request->input('cuenta').' ya está asociada a este cliente.'], 409);
                    }
                }

            }
        }

        if ($request->has('predeterminado')) {
            if ($request->input('predeterminado') != 'null' && $request->input('predeterminado') != null && $request->input('predeterminado') != '') {

                if ($request->input('predeterminado') == 1) {
                    $auxCuentasPre = \App\Cuenta::
                        where('cliente_id', $request->input('cliente_id'))
                        ->where('predeterminado', 1)
                        ->get();

                    if (count($auxCuentasPre) > 0) {
                        // Devolvemos un código 409 Conflict. 
                        return response()->json(['error'=>'El cliente ya tiene otra cuenta predeterminada.'], 409);
                    }
                }
                

            }
        }

        /*Primero creo una instancia en la tabla cuentas*/
        $nuevaCuenta = new \App\Cuenta;
        $nuevaCuenta->nombre_titular=$request->input('nombre_titular');
        $nuevaCuenta->cuenta=Crypt::encrypt($request->input('cuenta'));
        $nuevaCuenta->token_id=$request->input('token_id');
        $nuevaCuenta->predeterminado=$request->input('predeterminado');
        $nuevaCuenta->cliente_id=$request->input('cliente_id');

        if($nuevaCuenta->save()){
           return response()->json(['message'=>'Cuenta creada con éxito.',
             'cuenta'=>$nuevaCuenta], 200);
        }else{
            return response()->json(['error'=>'Error al crear la cuenta.'], 500);
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
        //cargar una cuenta
        $cuentaObj = \App\Cuenta::
            with('cliente.usuario')
            ->find($id);

        if(count($cuentaObj)==0){
            return response()->json(['error'=>'No existe la cuenta con id '.$id], 404);          
        }else{

            $cuentaObj->cuenta = Crypt::decrypt($cuentaObj->cuenta);

            return response()->json(['cuenta'=>$cuentaObj], 200);
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
        // Comprobamos si la cuenta que nos están pasando existe o no.
        $cuentaObj=\App\Cuenta::find($id);

        if (count($cuentaObj)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe la cuenta con id '.$id], 404);
        }      

        // Listado de campos recibidos teóricamente.
        $nombre_titular=$request->input('nombre_titular');
        $cuenta=$request->input('cuenta');
        $token_id=$request->input('token_id');
        $predeterminado=$request->input('predeterminado');
        //$cliente_id=$request->input('cliente_id');

        // Creamos una bandera para controlar si se ha modificado algún dato.
        $bandera = false;

        // Actualización parcial de campos.
        if ($nombre_titular != null && $nombre_titular!='')
        {
            
            $cuentaObj->nombre_titular = $nombre_titular;
            $bandera=true;
        }

        if ($cuenta != null && $cuenta!='')
        {

            $auxCuentas = \App\Cuenta::
                where('cliente_id', $cuentaObj->cliente_id)
                ->where('id', '<>', $cuentaObj->id)
                ->get();

            for ($i=0; $i < count($auxCuentas); $i++) { 
                $auxCuentas[$i]->cuenta = Crypt::decrypt($auxCuentas[$i]->cuenta);

                if ($auxCuentas[$i]->cuenta == $cuenta) {
                    // Devolvemos un código 409 Conflict. 
                    return response()->json(['error'=>'La cuenta '.$cuenta.' ya está asociada a este cliente.'], 409);
                }
            }

            $cuentaObj->cuenta = Crypt::encrypt($cuenta);
            $bandera=true;
        }

        if ($token_id != null && $token_id!='')
        {
            $cuentaObj->token_id = $token_id;
            $bandera=true;
        }

        if ($predeterminado != null && $predeterminado!='')
        {
            if ($predeterminado == 1) {
                $auxCuentasPre = \App\Cuenta::where('id', '<>', $cuentaObj->id)
                    ->where('cliente_id', $cuentaObj->cliente_id)
                    ->where('predeterminado', 1)
                    ->get();

                if (count($auxCuentasPre) > 0) {
                    // Devolvemos un código 409 Conflict. 
                    return response()->json(['error'=>'El cliente ya tiene otra cuenta predeterminada.'], 409);
                }
            }
            
            $cuentaObj->predeterminado = $predeterminado;
            $bandera=true;
        }

        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($cuentaObj->save()) {

                $cuentaObj->cuenta = Crypt::decrypt($cuentaObj->cuenta);
                
                return response()->json(['message'=>'Cuenta editada con éxito.',
                    'cuenta'=>$cuentaObj], 200);
            }else{
                return response()->json(['error'=>'Error al actualizar la cuenta.'], 500);
            }
            
        }
        else
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato a la cuenta.'],409);
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
        // Comprobamos si la cuenta que nos están pasando existe o no.
        $cuenta=\App\Cuenta::find($id);

        if (count($cuenta)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe la cuenta con id '.$id], 404);
        }

        $esPredeterminda = false;
        //Si estoy borrando la cuenta predeterminada
        if ($cuenta->predeterminado == 1) {
            $esPredeterminda = true;
            $cliente_id = $cuenta->cliente_id;
        }

        // Eliminamos.
        $cuenta->delete();

        //asignar otra como predeterminada
        if ($esPredeterminda) {
            $cuentas=\App\Cuenta::where('id', '<>', $id)
                ->where('cliente_id', $cliente_id)
                ->get();

            if (count($cuentas) > 0) {
                $cuentas[0]->predeterminado = 1;
                $cuentas[0]->save();
            }
        }

        return response()->json(['message'=>'Se ha eliminado correctamente la cuenta.'], 200);
    }
}
