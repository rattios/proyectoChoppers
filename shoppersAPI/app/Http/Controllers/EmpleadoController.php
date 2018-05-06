<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Hash;

class EmpleadoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //cargar todos los empleados
        $empleados = \App\Empleado::with('usuario')
            ->with('empresa')->with('permisos')->get();

        if(count($empleados) == 0){
            return response()->json(['error'=>'No existen empleados.'], 404);          
        }else{
            return response()->json(['empleados'=>$empleados], 200);
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
        if ( !$request->input('empresa_id') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro empresa_id.'],422);
        }
        

        $aux = \App\User::where('email', $request->input('email'))->get();
        if(count($aux)!=0){
            //Devolvemos un código 409 Conflict. 
                return response()->json(['error'=>'Ya existe un usuario con esas credenciales.'], 409);
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

        /*Primero creo una instancia en la tabla usuarios*/
        $usuario = new \App\User;
        $usuario->email = $request->input('email');
        $usuario->password = Hash::make($request->input('password'));
        $usuario->nombre = $request->input('nombre');
        $usuario->tipo_usuario = 3;
        $usuario->tipo_registro = 1;

        if($usuario->save()){

            //Creamos el empleado asociado al usuario
            $empleado = $usuario->empleado()->create($request->all());

            //Creamos los permisos asociados al empleado
            $permisos = $empleado->permisos()->create($request->all());

            if ($sucursales) {
                //Crear las relaciones (sucursales) en la tabla pivote
                for ($i=0; $i < count($sucursales) ; $i++) { 

                    $empleado->sucursales()->attach($sucursales[$i]->id);
                       
                }
            }
            

           return response()->json(['message'=>'Empleado creado con éxito.', 'usuario'=>$usuario], 200);
        }else{
            return response()->json(['error'=>'Error al crear el empleado.'], 500);
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
        //cargar un empleado
        $empleado = \App\Empleado::with('usuario')->with('empresa')->find($id);

        if(count($empleado)==0){
            return response()->json(['error'=>'No existe el empleado con id '.$id], 404);          
        }else{

            return response()->json(['empleado'=>$empleado], 200);
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
        // Comprobamos si el empleado que nos están pasando existe o no.
        $empleado = \App\Empleado::find($id);

        if (count($empleado)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el empleado con id '.$id], 404);
        }  

        $usuario = \App\User::find($empleado->user_id);    

        // Listado de campos recibidos teóricamente.
        //usuario
        $email=$request->input('email'); 
        $password=$request->input('password');  
        $nombre=$request->input('nombre');
        $codigo_verificacion=$request->input('codigo_verificacion');
        //empleado
        $telefono = $request->input('telefono');
        $imagen = $request->input('imagen');
        $sucursales=$request->input('sucursales');

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

        //empleado

        if ($telefono != null && $telefono!='')
        {
            $empleado->telefono = $telefono;
            $bandera=true;
        }

        if ($imagen != null && $imagen!='')
        {
            $empleado->imagen = $imagen;
            $bandera=true;
        }

        if ($sucursales) {
            $sucursales = json_decode($request->input('sucursales'));

            //Eliminar las relaciones(sucursales) en la tabla pivote
            $empleado->sucursales()->detach();

            //Agregar las nuevas relaciones(sucursales) en la tabla pivote
            for ($i=0; $i < count($sucursales) ; $i++) { 
                  $empleado->sucursales()->attach($sucursales[$i]->id);
            }

            $bandera=true; 
        }

        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($empleado->save() && $usuario->save()) {
                return response()->json(['message'=>'Empleado actualizado con éxito.', 'empleado'=>$empleado], 200);
            }else{
                return response()->json(['error'=>'Error al actualizar el empleado.'], 500);
            }
        }
        else
        {
            // Se devuelve un array error con los error encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato del empleado.'],409);
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
        // Comprobamos si el empleado que nos están pasando existe o no.
        $empleado=\App\Empleado::find($id);

        if (count($empleado)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el empleado con id '.$id], 404);
        } 

        $permisos = $empleado->permisos;

        if (sizeof($permisos) > 0)
        {
            // Eliminamos los permisos.
            $permisos->delete();
        }

        $usuario = $empleado->usuario;
      
        //Eliminar las relaciones(sucursales) en la tabla pivote
        $empleado->sucursales()->detach();

        // Eliminamos el empleado.
        $empleado->delete();

        if (sizeof($usuario) > 0)
        {
            // Eliminamos el usuario.
            $usuario->delete();
        }

        return response()->json(['message'=>'Se ha eliminado correctamente el empleado.'], 200);
    }
}
