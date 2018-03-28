<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class CategoriaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //cargar todas las categorias
        $categorias = \App\Categoria::all();

        if(count($categorias) == 0){
            return response()->json(['error'=>'No existen categorías.'], 404);          
        }else{
            return response()->json(['categorias'=>$categorias], 200);
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
        if ( !$request->input('nombre') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro nombre.'],422);
        }

        /*$aux = \App\Categoria::where('nombre', $request->input('nombre'))->get();
        if(count($aux)!=0){
            //Devolvemos un código 409 Conflict. 
                return response()->json(['error'=>'Ya existe una categoría con ese nombre.'], 409);
        }*/

        if($categoria=\App\Categoria::create($request->all())){
           return response()->json(['message'=>'Categoría creada con éxito.',
             'categoria'=>$categoria], 200);
        }else{
            return response()->json(['error'=>'Error al crear la categoría.'], 500);
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
        //cargar una categoria
        $categoria = \App\Categoria::find($id);

        if(count($categoria)==0){
            return response()->json(['error'=>'No existe la categoría con id '.$id], 404);          
        }else{

            return response()->json(['categoria'=>$categoria], 200);
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
        // Comprobamos si la categoria que nos están pasando existe o no.
        $categoria=\App\Categoria::find($id);

        if (count($categoria)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe la categoría con id '.$id], 404);
        }      

        // Listado de campos recibidos teóricamente.
        $nombre=$request->input('nombre');
        $imagen=$request->input('imagen');

        // Creamos una bandera para controlar si se ha modificado algún dato.
        $bandera = false;

        // Actualización parcial de campos.
        if ($nombre != null && $nombre!='')
        {
            /*$aux = \App\Categoria::where('nombre', $request->input('nombre'))
            ->where('id', '<>', $categoria->id)->get();

            if(count($aux)!=0){
               // Devolvemos un código 409 Conflict. 
                return response()->json(['error'=>'Ya existe otra categoría con ese nombre.'], 409);
            }*/

            $categoria->nombre = $nombre;
            $bandera=true;
        }

        if ($imagen != null && $imagen!='')
        {
            $categoria->imagen = $imagen;
            $bandera=true;
        }

        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($categoria->save()) {
                return response()->json(['message'=>'Categoría editada con éxito.',
                    'categoria'=>$categoria], 200);
            }else{
                return response()->json(['error'=>'Error al actualizar la categoría.'], 500);
            }
            
        }
        else
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato a la categoría.'],409);
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
