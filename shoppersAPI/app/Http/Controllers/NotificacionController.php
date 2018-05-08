<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class NotificacionController extends Controller
{

    //Enviar notificacion a un dispositivo mediante su token_notificacion
    public function enviarNotificacion($token_notificacion, $msg)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://shopper.internow.com.mx/onesignal.php?contenido=".$msg."&token_notificacion=".$token_notificacion);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
            'Authorization: Basic YmEwZDMwMDMtODY0YS00ZTYxLTk1MjYtMGI3Nzk3N2Q1YzNi'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_POST, TRUE);
        ///curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

        $response = curl_exec($ch);
        curl_close($ch);
    }

    /*Notificar la creacion de campañas*/
    public function notificarCrearCamp(Request $request)
    {
        //cargar empleados
        $empleados = \App\Empleado::with('usuario')
            ->with(['permisos' => function ($query) {
                $query->where('camp_crear', 1);
            }])
            ->where('empresa_id', $request->input('empresa_id'))
            ->get();

        if(count($empleados)==0){
            return response()->json(['error'=>'No hay empleados con permisos para la creación de campañas.'], 404);          
        }else{

            $explode2 = explode(" ",$request->input('nombre_campana'));
            $nomCampana = null;
            for ($i=0; $i < count($explode2); $i++) { 
                $nomCampana = $nomCampana.$explode2[$i].'%20'; 
            }

            for ($i=0; $i < count($empleados); $i++) { 
                if ($empleados[$i]->usuario->token_notificacion) {

                    $this->enviarNotificacion($empleados[$i]->usuario->token_notificacion, 'El%20presupuesto%20de%20la%20campaña%20'.$nomCampana.'ha%20sido%20asignado');
                }
            }

            return response()->json(['message'=>'Los empleados han sido notificados.'], 200);
        }
    }

    /*Notificar la creacion de cuestionarios*/
    public function notificarCrearCuest(Request $request)
    {
        //cargar empleados
        $empleados = \App\Empleado::with('usuario')
            ->with(['permisos' => function ($query) {
                $query->where('cuest_crear', 1);
            }])
            ->where('empresa_id', $request->input('empresa_id'))
            ->get();

        if(count($empleados)==0){
            return response()->json(['error'=>'No hay empleados con permisos para la creación de cuestionarios.'], 404);          
        }else{

            $explode2 = explode(" ",$request->input('nombre_cuestionario'));
            $nomCuest = null;
            for ($i=0; $i < count($explode2); $i++) { 
                $nomCuest = $nomCuest.$explode2[$i].'%20'; 
            }

            for ($i=0; $i < count($empleados); $i++) { 
                if ($empleados[$i]->usuario->token_notificacion) {

                    $this->enviarNotificacion($empleados[$i]->usuario->token_notificacion, 'Ha%20sido%20asignado%20un%20presupuesto%20al%20cuestionario%20'.$nomCuest);
                }
            }

            return response()->json(['message'=>'Los empleados han sido notificados.'], 200);
        }
    }


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
}
