<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Encryption;
use Illuminate\Support\Facades\Crypt;

class PagoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    /*Cargar los pagos realizados por una empresa_id*/
    public function index($empresa_id)
    {
        //cargar una empresa
        $empresa = \App\Empresa::with('usuario')->find($empresa_id);
        if(count($empresa)==0){
            return response()->json(['error'=>'No existe la empresa con id '.$empresa_id], 404);          
        }

        //Cargar los pagos de una empresa_id
        $pagos = \App\Pago::with('tarjeta')
            ->where('empresa_id', $empresa_id)
            ->get();

        for ($i=0; $i < count($pagos) ; $i++) { 
            $pagos[$i]->tarjeta->tarjeta = Crypt::decrypt($pagos[$i]->tarjeta->tarjeta);
            $pagos[$i]->tarjeta->fecha_vencimiento = Crypt::decrypt($pagos[$i]->tarjeta->fecha_vencimiento);
        }

        return response()->json(['empresa'=>$empresa, 'pagos'=>$pagos], 200);
    }

    /*Cargar los pagos realizados a un cliente_id*/
    public function index2($cliente_id)
    {
        //cargar un cliente
        $cliente = \App\Cliente::with('usuario')->find($cliente_id);
        if(count($cliente)==0){
            return response()->json(['error'=>'No existe el cliente con id '.$cliente_id], 404);          
        }

        //Cargar los pagos de una cliente_id
        $pagos = \App\Pago::with('cuenta')
            ->where('cliente_id', $cliente_id)
            ->get();

        for ($i=0; $i < count($pagos) ; $i++) { 
            $pagos[$i]->cuenta->cuenta = Crypt::decrypt($pagos[$i]->cuenta->cuenta);
        }

        return response()->json(['cliente'=>$cliente, 'pagos'=>$pagos], 200);
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

    /*Una empresa crea un pago*/
    public function store(Request $request)
    {
        // Primero comprobaremos si estamos recibiendo todos los campos.
        if ( !$request->input('monto'))
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Falta el parámetro monto.'],422);
        }
        if ( !$request->input('tipo'))
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Falta el parámetro tipo.'],422);
        }
        if ( !$request->input('empresa_id'))
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Falta el parámetro empresa_id.'],422);
        }
        if ( !$request->input('tarjeta_id'))
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Falta el parámetro tarjeta_id.'],422);
        }

        //cargar una empresa
        $empresa = \App\Empresa::find($request->input('empresa_id'));
        if(count($empresa)==0){
            return response()->json(['error'=>'No existe la empresa con id '.$request->input('empresa_id')], 404);          
        }

        //cargar una tarjeta
        $tarjeta = \App\Tarjeta::find($request->input('tarjeta_id'));
        if(count($tarjeta)==0){
            return response()->json(['error'=>'No existe la tarjeta con id '.$request->input('tarjeta_id')], 404);          
        }

        if($pago=\App\Pago::create($request->all())){
           return response()->json(['message'=>'Pago registrado con éxito.',
             'pago'=>$pago], 200);
        }else{
            return response()->json(['error'=>'Error al registrar el pago.'], 500);
        }
    }

    /*Un admin de choppers crea un pago para un cliente*/
    public function store2(Request $request)
    {
        // Primero comprobaremos si estamos recibiendo todos los campos.
        if ( !$request->input('monto'))
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Falta el parámetro monto.'],422);
        }
        if ( !$request->input('tipo'))
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Falta el parámetro tipo.'],422);
        }
        if ( !$request->input('cliente_id'))
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Falta el parámetro cliente_id.'],422);
        }
        if ( !$request->input('cuenta_id'))
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Falta el parámetro cuenta_id.'],422);
        }

        //cargar una cliente
        $cliente = \App\Cliente::find($request->input('cliente_id'));
        if(count($cliente)==0){
            return response()->json(['error'=>'No existe el cliente con id '.$request->input('cliente_id')], 404);          
        }

        //cargar una cuenta
        $cuenta = \App\Tarjeta::find($request->input('cuenta_id'));
        if(count($cuenta)==0){
            return response()->json(['error'=>'No existe la cuenta con id '.$request->input('cuenta_id')], 404);          
        }

        if($pago=\App\Pago::create($request->all())){
           return response()->json(['message'=>'Pago registrado con éxito.',
             'pago'=>$pago], 200);
        }else{
            return response()->json(['error'=>'Error al registrar el pago.'], 500);
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
        //cargar un pago
        $pago = \App\Pago::with('empresa.usuario')
            ->with('tarjeta')
            ->with('cliente.usuario')
            ->with('cuenta')
            ->find($id);

        if(count($pago)==0){
            return response()->json(['error'=>'No existe el pago con id '.$id], 404);          
        }else{

            if ($pago->tarjeta) {
                $pago->tarjeta->tarjeta = Crypt::decrypt($pago->tarjeta->tarjeta);
                $pago->tarjeta->fecha_vencimiento = Crypt::decrypt($pago->tarjeta->fecha_vencimiento);
            }

            if ($pago->cuenta) {
                $pago->cuenta->cuenta = Crypt::decrypt($pago->cuenta->cuenta);
            }
            

            return response()->json(['pago'=>$pago], 200);
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
        // Comprobamos si el pago que nos están pasando existe o no.
        $pago=\App\Pago::find($id);

        if (count($pago)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el pago con id '.$id], 404);
        }      

        $pago->fill($request->all());

        // Almacenamos en la base de datos el registro.
        if ($pago->save()) {
            return response()->json(['message'=>'Pago editado con éxito.',
                'pago'=>$pago], 200);
        }else{
            return response()->json(['error'=>'Error al actualizar el pago.'], 500);
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
        // Comprobamos si el pago que nos están pasando existe o no.
        $pago=\App\Pago::find($id);

        if (count($pago)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el pago con id '.$id], 404);
        } 

        // Eliminamos.
        $pago->delete();

        return response()->json(['message'=>'Se ha eliminado correctamente el pago.'], 200);
    }
}
