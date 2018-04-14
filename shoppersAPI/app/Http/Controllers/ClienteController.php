<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Hash;

class ClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //cargar todos los clientes
        $clientes = \App\Cliente::with('usuario')->with('preferencias')->get();

        if(count($clientes) == 0){
            return response()->json(['error'=>'No existen clientes.'], 404);          
        }else{
            return response()->json(['clientes'=>$clientes], 200);
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
        if ( !$request->input('email') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro email.'],422);
        }
        if ( !$request->input('tipo_registro') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro tipo_registro.'],422);
        }

        $aux = \App\User::where('email', $request->input('email'))->with('cliente')->get();
        if(count($aux)!=0){

            if ($request->input('tipo_registro') == 1) {
                //Devolvemos un código 409 Conflict. 
                return response()->json(['error'=>'Ya existe un usuario con esas credenciales.'], 409);
            }else{

                if ($request->input('preferencias')) {
                    //Verificar que todas las preferencias (categorias) existen
                    $preferencias = json_decode($request->input('preferencias'));
                    for ($i=0; $i < count($preferencias) ; $i++) { 
                        $aux2 = \App\Categoria::find($preferencias[$i]->categoria_id);
                        if(count($aux2) == 0){
                           // Devolvemos un código 409 Conflict. 
                            return response()->json(['error'=>'No existe la categoría con id '.$preferencias[$i]->categoria_id], 409);
                        }   
                    } 
                }

                $auxUser = $aux[0];
                $auxUser->email = $request->input('email');
                //$auxUser->password = Hash::make($request->input('password'));
                $auxUser->nombre = $request->input('nombre');
                //$usuario->tipo_usuario = 1;
                $auxUser->tipo_registro = $request->input('tipo_registro');

                if ($request->input('tipo_registro') == 2) {
                    $auxUser->id_facebook = $request->input('id_facebook');
                }else if ($request->input('tipo_registro') == 3) {
                    $auxUser->id_twitter = $request->input('id_twitter');
                }
                
                // Almacenamos en la base de datos el registro.
                if ($auxUser->save()) {

                    if ($preferencias) {
                        //Eliminar las relaciones(preferencias) en la tabla pivote
                        $auxUser->cliente->preferencias()->detach();

                        //Crear las relaciones (preferencias) en la tabla pivote
                        for ($i=0; $i < count($preferencias) ; $i++) { 

                            $auxUser->cliente->preferencias()->attach($preferencias[$i]->categoria_id);
                               
                        }
                    }

                    return response()->json(['message'=>'Cliente actualizado con éxito.', 'cliente'=>$auxUser], 200);
                }else{
                    return response()->json(['error'=>'Error al actualizar el cliente.'], 500);
                }
                
                
            }
        }

        if ($request->input('preferencias')) {
            //Verificar que todas las preferencias (categorias) existen
            $preferencias = json_decode($request->input('preferencias'));
            for ($i=0; $i < count($preferencias) ; $i++) { 
                $aux2 = \App\Categoria::find($preferencias[$i]->categoria_id);
                if(count($aux2) == 0){
                   // Devolvemos un código 409 Conflict. 
                    return response()->json(['error'=>'No existe la categoría con id '.$preferencias[$i]->categoria_id], 409);
                }   
            } 
        }

        /*Primero creo una instancia en la tabla usuarios*/
        $usuario = new \App\User;
        $usuario->email = $request->input('email');

        if ($request->input('password') != null && $request->input('password') != '')
        {
            $usuario->password = Hash::make($request->input('password'));
        }
        
        $usuario->nombre = $request->input('nombre');
        $usuario->tipo_usuario = 1;
        $usuario->tipo_registro = $request->input('tipo_registro');
        $usuario->id_facebook = $request->input('id_facebook');
        $usuario->id_twitter = $request->input('id_twitter');

        if($usuario->save()){

            //Creamos el cliente asociado al usuario
            $cliente = $usuario->cliente()->create($request->all());

            if ($request->input('preferencias')) {
                //Crear las relaciones (preferencias) en la tabla pivote
                for ($i=0; $i < count($preferencias) ; $i++) { 

                    $cliente->preferencias()->attach($preferencias[$i]->categoria_id);
                       
                }
            }

           return response()->json(['message'=>'Cliente creado con éxito.', 'usuario'=>$usuario], 200);
        }else{
            return response()->json(['error'=>'Error al crear el cliente.'], 500);
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
        //cargar un cliente
        $cliente = \App\Cliente::with('usuario')->with('preferencias')->find($id);

        if(count($cliente)==0){
            return response()->json(['error'=>'No existe el cliente con id '.$id], 404);          
        }else{

            return response()->json(['cliente'=>$cliente], 200);
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
        // Comprobamos si el cliente que nos están pasando existe o no.
        $cliente = \App\Cliente::find($id);

        if (count($cliente)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el cliente con id '.$id], 404);
        }  

        $usuario = \App\User::find($cliente->user_id);    

        // Listado de campos recibidos teóricamente.
        //usuario
        $email=$request->input('email'); 
        $password=$request->input('password');  
        $nombre=$request->input('nombre');
        $codigo_verificacion=$request->input('codigo_verificacion');
        //cliente
        $sexo = $request->input('sexo');
        $edad = $request->input('edad');
        $lat = $request->input('lat');
        $lng=$request->input('lng');
        $direccion=$request->input('direccion');
        $ciudad=$request->input('ciudad');
        $colonia=$request->input('colonia');
        $activo=$request->input('activo');
        $token_notificacion=$request->input('token_notificacion');
        $preferencias=$request->input('preferencias');

        // Creamos una bandera para controlar si se ha modificado algún dato.
        $bandera = false;

        // Actualización parcial de campos.

        //usuario

        if ($email != null && $email!='')
        {
            $aux = \App\User::where('email', $request->input('email'))
            ->where('id', '<>', $usuario->id)->get();

            if(count($aux)!=0){
               // Devolvemos un código 409 Conflict. 
                return response()->json(['error'=>'Ya existe otro usuario con ese email.'], 409);
            }

            $usuario->email = $email;
            $bandera=true;
        }

        if ($password != null && $password!='')
        {
            $usuario->password = Hash::make($request->input('password'));
            $bandera=true;
        }

        if ($nombre != null && $nombre!='')
        {
            $usuario->nombre = $nombre;
            $bandera=true;
        }

        if ($codigo_verificacion != null && $codigo_verificacion!='')
        {
            $usuario->codigo_verificacion = $codigo_verificacion;
            $bandera=true;
        }

        //cliente

        if ($sexo != null && $sexo!='')
        {
            $cliente->sexo = $sexo;
            $bandera=true;
        }

        if ($edad != null && $edad!='')
        {
            $cliente->edad = $edad;
            $bandera=true;
        }

        if ($lat != null && $lat!='')
        {
            $cliente->lat = $lat;
            $bandera=true;
        }

        if ($lng != null && $lng!='')
        {
            $cliente->lng = $lng;
            $bandera=true;
        }

        if ($direccion != null && $direccion!='')
        {
            $cliente->direccion = $direccion;
            $bandera=true;
        }

        if ($ciudad != null && $ciudad!='')
        {
            $cliente->ciudad = $ciudad;
            $bandera=true;
        }

        if ($colonia != null && $colonia!='')
        {
            $cliente->colonia = $colonia;
            $bandera=true;
        }

        if ($activo != null && $activo!='')
        {
            $cliente->activo = $activo;
            $bandera=true;
        }

        if ($token_notificacion != null && $token_notificacion!='')
        {
            $cliente->token_notificacion = $token_notificacion;
            $bandera=true;
        }

        if ($preferencias) {
            $preferencias = json_decode($request->input('preferencias'));

            //Eliminar las relaciones(preferencias) en la tabla pivote
            $cliente->preferencias()->detach();

            //Agregar las nuevas relaciones(preferencias) en la tabla pivote
            for ($i=0; $i < count($preferencias) ; $i++) { 
                  $cliente->preferencias()->attach($preferencias[$i]->categoria_id);
            }

            $bandera=true; 
        }

        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($cliente->save() && $usuario->save()) {
                return response()->json(['message'=>'Cliente actualizado con éxito.', 'cliente'=>$cliente], 200);
            }else{
                return response()->json(['error'=>'Error al actualizar el cliente.'], 500);
            }
        }
        else
        {
            // Se devuelve un array error con los error encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato del cliente.'],409);
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
