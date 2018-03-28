<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Hash;

class EmpresaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //cargar todas las empresas
        $empresas = \App\Empresa::with('usuario')->with('categorias')->get();

        if(count($empresas) == 0){
            return response()->json(['error'=>'No existen empresas.'], 404);          
        }else{
            return response()->json(['empresas'=>$empresas], 200);
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
        if ( !$request->input('password') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro password.'],422);
        }

        $aux = \App\User::where('email', $request->input('email'))->get();
        if(count($aux)!=0){
            //Devolvemos un código 409 Conflict. 
                return response()->json(['error'=>'Ya existe un usuario con esas credenciales.'], 409);
        }

        if ($request->input('categorias')) {
            //Verificar que todas las categorias existen
            $categorias = json_decode($request->input('categorias'));
            for ($i=0; $i < count($categorias) ; $i++) { 
                $aux2 = \App\Categoria::find($categorias[$i]->categoria_id);
                if(count($aux2) == 0){
                   // Devolvemos un código 409 Conflict. 
                    return response()->json(['error'=>'No existe la categoría con id '.$categorias[$i]->categoria_id], 409);
                }   
            } 
        }

        /*Primero creo una instancia en la tabla usuarios*/
        $usuario = new \App\User;
        $usuario->email = $request->input('email');
        $usuario->password = Hash::make($request->input('password'));
        $usuario->nombre = $request->input('nombre');
        $usuario->tipo_usuario = 2;

        if($usuario->save()){

            //Creamos la empresa asociada al usuario
            $empresa = $usuario->empresas()->create($request->all());

            if ($request->input('categorias')) {
                //Crear las relaciones en la tabla pivote
                for ($i=0; $i < count($categorias) ; $i++) { 

                    $empresa->categorias()->attach($categorias[$i]->categoria_id);
                       
                }
            }

           return response()->json(['message'=>'Empresa creada con éxito.', 'usuario'=>$usuario], 200);
        }else{
            return response()->json(['error'=>'Error al crear el empresa.'], 500);
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
        //cargar una empresa
        $empresa = \App\Empresa::with('usuario')->with('categorias')->find($id);

        if(count($empresa)==0){
            return response()->json(['error'=>'No existe el empresa con id '.$id], 404);          
        }else{

            return response()->json(['empresa'=>$empresa], 200);
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
        // Comprobamos si la empresa que nos están pasando existe o no.
        $empresa = \App\Empresa::find($id);

        if (count($empresa)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe la empresa con id '.$id], 404);
        }  

        $usuario = \App\User::find($empresa->user_id);    

        // Listado de campos recibidos teóricamente.
        //usuario
        $email=$request->input('email'); 
        $password=$request->input('password');  
        $nombre=$request->input('nombre');
        $codigo_verificacion=$request->input('codigo_verificacion');
        //empresa
        $imagen = $request->input('imagen');
        $token_sucursal = $request->input('token_sucursal');

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

        //empresa

        if ($imagen != null && $imagen!='')
        {
            $empresa->imagen = $imagen;
            $bandera=true;
        }

        if ($token_sucursal != null && $token_sucursal!='')
        {
            $empresa->token_sucursal = $token_sucursal;
            $bandera=true;
        }

        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($empresa->save() && $usuario->save()) {
                return response()->json(['message'=>'Empresa actualizada con éxito.', 'empresa'=>$empresa], 200);
            }else{
                return response()->json(['error'=>'Error al actualizar la empresa.'], 500);
            }
        }
        else
        {
            // Se devuelve un array error con los error encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato a la empresa.'],409);
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
