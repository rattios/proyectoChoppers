<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Foundation\Inspiring;

//use Log;
use DB;

class NotificationInicialClientes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'clientes:notificarInicial';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Notificaciones automaticas
    anteriores a los dos ultimos dias';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        //Log::info("Notificacion enviada");

        /*DB::table('clientes')
                ->where('id', 2)
                ->update(['edad' => 21]);*/

                //cargar todos los clientes
        $clientes = \App\Cliente::with('usuario')->with('preferencias')->get();

        //cargar todas las campanas en curso
        //y que no esten en sus ultimos dos dias
        //y que no sea el dia de su lanzamiento
        $campanas = \App\Campana::
            select('id', 'nombre', 'f_fin', 'genero', 'edad', 'categorias', 'estados', 'municipios', 'localidades', 'empresa_id', DB::raw('TO_DAYS( f_fin) - TO_DAYS( DATE_FORMAT(now(),"%Y-%m-%d")) AS dias'))
            ->where('f_fin', '>=', DB::raw('DATE_FORMAT(now(),"%Y-%m-%d")'))
            ->where(DB::raw('TO_DAYS( f_fin) - TO_DAYS( DATE_FORMAT(now(),"%Y-%m-%d"))'), '>=', 2)
            ->where('f_inicio', '!=', DB::raw('DATE_FORMAT(now(),"%Y-%m-%d")'))
            ->with(['cuestionarios' => function ($query) {
                $query->select('id', 'count_notif', 'num_cuestionarios', 'estado', 'campana_id', 'descripcion', 'nombre')
                    ->where('estado', 2)
                    ->where('num_cuestionarios', '>', 0)
                    ->where('count_notif', '<', 2);

            }])
            ->with(['empresa.usuario' => function ($query) {
                $query->select('usuarios.id', 'usuarios.nombre');

            }])
            /*->whereHas('cuestionarios', function ($query) {
                    $query->where('estado', 2)
                        ->where('num_cuestionarios', '>', 0);
                })*/
            ->get();

        //Seleccionar solo las campañas con cuestionarios activos
        $auxCamp = [];
        for ($i=0; $i < count($campanas); $i++) { 
            if (count($campanas[$i]->cuestionarios) != 0) {

                /*Si la campaña esta en los ultimos 4 dias envio
                notificacion a todos los cuestionarios*/
                if($campanas[$i]->dias == 2 || $campanas[$i]->dias == 3){

                    $campanas[$i]->categorias = json_decode($campanas[$i]->categorias);
                    $campanas[$i]->estados = json_decode($campanas[$i]->estados);
                    $campanas[$i]->municipios = json_decode($campanas[$i]->municipios);
                    $campanas[$i]->localidades = json_decode($campanas[$i]->localidades);
                    
                    $campanas[$i]->cuestSelect = $campanas[$i]->cuestionarios;

                    array_push($auxCamp, $campanas[$i]);

                    //Aumentar el contador de notificaciones enviadas
                    for ($c=0; $c < count($campanas[$i]->cuestSelect); $c++) { 
                        
                        DB::table('cuestionarios')
                            ->where('id', $campanas[$i]->cuestSelect[$c]->id)
                            ->update(['count_notif' => $campanas[$i]->cuestSelect[$c]->count_notif + 1]);

                    }

                }else{

                    $cuestSelect = [];
                    for ($c=0; $c < count($campanas[$i]->cuestionarios); $c++) {

                        //Aleatorio para ver si selecciono el cuestionario para la notificacion 
                        $aletorio = rand(0, 1);

                        if ($aletorio == 1) {
                            array_push($cuestSelect, $campanas[$i]->cuestionarios[$c]);

                            //Aumentar el contador de notificaciones enviadas

                            DB::table('cuestionarios')
                            ->where('id', $campanas[$i]->cuestionarios[$c]->id)
                            ->update(['count_notif' => $campanas[$i]->cuestionarios[$c]->count_notif + 1]);
                        }
                    }

                    if (count($cuestSelect) > 0) {
                        $campanas[$i]->categorias = json_decode($campanas[$i]->categorias);
                        $campanas[$i]->estados = json_decode($campanas[$i]->estados);
                        $campanas[$i]->municipios = json_decode($campanas[$i]->municipios);
                        $campanas[$i]->localidades = json_decode($campanas[$i]->localidades);

                        $campanas[$i]->cuestSelect = $cuestSelect;

                        array_push($auxCamp, $campanas[$i]);
                    }
                }

            }
        }

        //return response()->json(['campanas'=>$auxCamp], 200);

        if (count($clientes)>0 && count($auxCamp)>0) {
            
            for ($h=0; $h < count($clientes); $h++) { 

                //Seleccionar las campañas que se adaptan a mi tipo de perfil
                $misCampanas = [];

                if ($clientes[$h]->usuario->token_notificacion && $clientes[$h]->usuario->token_notificacion != '') {

                    for ($i=0; $i < count($auxCamp); $i++) { 

                        /*$auxCamp[$i]->categorias = json_decode($auxCamp[$i]->categorias);
                        $auxCamp[$i]->estados = json_decode($auxCamp[$i]->estados);
                        $auxCamp[$i]->municipios = json_decode($auxCamp[$i]->municipios);
                        $auxCamp[$i]->localidades = json_decode($auxCamp[$i]->localidades);*/

                        if ($auxCamp[$i]->genero == 'Todos' || !$auxCamp[$i]->edad || 
                            count($auxCamp[$i]->categorias) == 0 || count($auxCamp[$i]->estados) == 0 ||
                            count($auxCamp[$i]->municipios) == 0 || count($auxCamp[$i]->localidades) == 0) {
                            
                            array_push($misCampanas, $auxCamp[$i]);

                        }else{

                            $banderaGenero = false;
                            $banderaEdad = false;
                            $banderaCategorias = false;
                            $banderaEstados = false;
                            $banderaMunicipios = false;
                            $banderaLocalidades = false;

                            if ($auxCamp[$i]->genero == $clientes[$h]->sexo) {
                                $banderaGenero = true;
                            }

                            $rangoEdades = explode("-",$auxCamp[$i]->edad);
                            if (($clientes[$h]->edad >= $rangoEdades[0]) && ( $clientes[$h]->edad <= $rangoEdades[1])) {
                            
                                $banderaEdad = true;

                            }

                            for ($j=0; $j < count($auxCamp[$i]->categorias); $j++) { 
                                /*if ($banderaCategorias) {
                                    break;
                                }*/
                                for ($k=0; $k < count($clientes[$h]->preferencias); $k++) { 
                                    if ($auxCamp[$i]->categorias[$j]->id == $clientes[$h]->preferencias[$k]->id) {
                                        $banderaCategorias = true;
                                        //break;
                                    }
                                }
                            }

                            for ($j=0; $j < count($auxCamp[$i]->estados); $j++) { 
                                if ($auxCamp[$i]->estados[$j]->id == $clientes[$h]->estado_id) {
                                    $banderaEstados = true;
                                    //break;
                                }  
                            }

                            for ($j=0; $j < count($auxCamp[$i]->municipios); $j++) { 
                                if ($auxCamp[$i]->municipios[$j]->id == $clientes[$h]->municipio_id) {
                                    $banderaMunicipios = true;
                                    //break;
                                }  
                            }

                            for ($j=0; $j < count($auxCamp[$i]->localidades); $j++) { 
                                if ($auxCamp[$i]->localidades[$j]->id == $clientes[$h]->localidad_id) {
                                    $banderaLocalidades = true;
                                    //break;
                                }  
                            }

                            if ($banderaGenero && $banderaEdad &&
                                $banderaCategorias && $banderaEstados &&
                                $banderaMunicipios && $banderaLocalidades) {
                                
                                array_push($misCampanas, $auxCamp[$i]);
                            }

                        }    
                    }//fin del for de auxCamp

                    if(count($misCampanas) != 0){
                    
                        //recuperar los cuestionarios respondidos por el usuario
                        $respuestas = \App\Respuesta::select('id', 'campana_id', 'sucursal_id', 'cliente_id', 'cuestionario_id')
                            ->where('cliente_id', $clientes[$h]->id)
                            ->get();

                        if (count($respuestas) == 0) {

                            $order   = array("\r\n", "\n", "\r", " ", "&");
                            $replace = array('%20', '%20', '%20', '%20', '%26');

                            for ($i=0; $i < count($misCampanas); $i++) {

                                // Procesa primero \r\n así no es convertido dos veces.
                                $nomCampana = str_replace($order, $replace, $misCampanas[$i]->nombre);

                                /*Enviar notificacion por cada cuestionario 
                                de misCampanas[$i]->cuestionarios*/
                                for ($j=0; $j < count($misCampanas[$i]->cuestSelect); $j++) { 
                                    
                                    // Procesa primero \r\n así no es convertido dos veces.
                                    $nomCuest = str_replace($order, $replace, $misCampanas[$i]->cuestSelect[$j]->nombre);

                                    $dias = $misCampanas[$i]->dias + 1;

                                    if($misCampanas[$i]->dias == 0){
                                        $mensaje = 'Te%20queda%20'.$dias.'%20día%20para%20responder%20la%20evaluación%20'.$nomCuest.'%20de%20la%20campaña%20'.$nomCampana;
                                    }else{
                                        $mensaje = 'Te%20quedan%20'.$dias.'%20días%20para%20responder%20la%20evaluación%20'.$nomCuest.'%20de%20la%20campaña%20'.$nomCampana;
                                    }

                                    $this->enviarNotificacion($clientes[$h]->usuario->token_notificacion, $mensaje);
                                }

                            }

                            
                        }else{

                            for ($i=0; $i < count($misCampanas); $i++) {
                                $cuestAux = []; 
                                for ($j=0; $j < count($misCampanas[$i]->cuestSelect); $j++) {
                                    //$cuestAux = [];
                                    $respondido = false; 
                                    for ($k=0; $k < count($respuestas); $k++) { 
                                        
                                        if ($misCampanas[$i]->cuestSelect[$j]->id == $respuestas[$k]->cuestionario_id) {
                                            $respondido = true;
                                            //break;
                                        }
                                    }

                                    if (!$respondido) {
                                        array_push($cuestAux, $misCampanas[$i]->cuestSelect[$j]);
                                    }

                                }

                                $misCampanas[$i]->cuest = $cuestAux;
                            }


                            

                            //Seleccionar solo las campañas con cuestionarios
                            //$auxCamp2 = [];

                            $order   = array("\r\n", "\n", "\r", " ", "&");
                            $replace = array('%20', '%20', '%20', '%20', '%26');

                            for ($i=0; $i < count($misCampanas); $i++) { 
                                if (count($misCampanas[$i]->cuest) != 0) {

                                    /*Enviar notificacion por cada 
                                    $misCampanas[$i]->cuest*/

                                    // Procesa primero \r\n así no es convertido dos veces.
                                    $nomCampana = str_replace($order, $replace, $misCampanas[$i]->nombre);

                                    /*Enviar notificacion por cada cuestionario 
                                    de misCampanas[$i]->cuest*/
                                    for ($j=0; $j < count($misCampanas[$i]->cuest); $j++) { 
                                        
                                        // Procesa primero \r\n así no es convertido dos veces.
                                        $nomCuest = str_replace($order, $replace, $misCampanas[$i]->cuest[$j]->nombre);

                                        $dias = $misCampanas[$i]->dias + 1;

                                        if($misCampanas[$i]->dias == 0){
                                            $mensaje = 'Te%20queda%20'.$dias.'%20día%20para%20responder%20la%20evaluación%20'.$nomCuest.'%20de%20la%20campaña%20'.$nomCampana;
                                        }else{
                                            $mensaje = 'Te%20quedan%20'.$dias.'%20días%20para%20responder%20la%20evaluación%20'.$nomCuest.'%20de%20la%20campaña%20'.$nomCampana;
                                        }

                                        $this->enviarNotificacion($clientes[$h]->usuario->token_notificacion, $mensaje);
                                    }
                                }
                            }

                        }

                    }//fin del if de misCampanas

                }//fin del if token_notificacion

            }//fin del for de clientes

        }//fin del if clientes y auxCamp

        //return 1;
    }

    //Enviar notificacion a un dispositivo mediante su token_notificacion
    public function enviarNotificacion($token_notificacion, $msg, $cuestionario_id='null', $accion = 0, $obj = 'null')
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://shopper.internow.com.mx/onesignal.php?contenido=".$msg."&token_notificacion=".$token_notificacion."&cuestionario_id=".$cuestionario_id."&obj=".$obj."&accion=".$accion);
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
}
