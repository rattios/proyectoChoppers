<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    //return view('welcome');
    
});

Route::group(  ['middleware' =>'cors'], function(){


    //----Pruebas LoginController
    Route::post('/login/web','LoginController@loginWeb');
    Route::post('/login/app','LoginController@loginApp');
    //Route::post('/validar/token','LoginController@validarToken');

    //----Pruebas PasswordController
    Route::get('/password/cliente/{correo}','PasswordController@generarCodigo');
    Route::get('/password/codigo/{codigo}','PasswordController@validarCodigo'); 

        //----Pruebas UploadImagenController
        Route::post('/imagenes','UploadImagenController@store');

        //----Pruebas ClienteController
        Route::get('/clientes','ClienteController@index');
        Route::post('/clientes','ClienteController@store');
        Route::put('/clientes/{id}','ClienteController@update');
        //Route::delete('/clientes/{id}','ClienteController@destroy');
        Route::get('/clientes/{id}','ClienteController@show');

        //----Pruebas EmpresaController
        Route::get('/empresas','EmpresaController@index');
        Route::post('/empresas','EmpresaController@store');
        Route::put('/empresas/{id}','EmpresaController@update');
        //Route::delete('/empresas/{id}','EmpresaController@destroy');
        Route::get('/empresas/{id}','EmpresaController@show');

        //----Pruebas EmpresaController
        Route::get('/empleados','EmpleadoController@index');
        Route::post('/empleados','EmpleadoController@store');
        Route::put('/empleados/{id}','EmpleadoController@update');
        //Route::delete('/empleados/{id}','EmpleadoController@destroy');
        Route::get('/empleados/{id}','EmpleadoController@show');

        //----Pruebas CategoriaController
        Route::get('/categorias','CategoriaController@index');
        Route::post('/categorias','CategoriaController@store');
        Route::put('/categorias/{id}','CategoriaController@update');
        //Route::delete('/categorias/{id}','CategoriaController@destroy');
        Route::get('/categorias/{id}','CategoriaController@show');

        //----Pruebas PermisoController
        Route::get('/permisos','PermisoController@index');
        Route::post('/permisos','PermisoController@store');
        Route::put('/permisos/{id}','PermisoController@update');
        //Route::delete('/permisos/{id}','PermisoController@destroy');
        Route::get('/permisos/{id}','PermisoController@show');

        //----Pruebas SucursalController
        Route::get('/sucursales','SucursalController@index');
        Route::post('/sucursales','SucursalController@store');
        Route::put('/sucursales/{id}','SucursalController@update');
        //Route::delete('/sucursales/{id}','SucursalController@destroy');
        Route::get('/sucursales/{id}','SucursalController@show');

        //----Pruebas CampanaController
        Route::get('/campanas','CampanaController@index');
        Route::post('/campanas','CampanaController@store');
        Route::put('/campanas/{id}','CampanaController@update');
        //Route::delete('/campanas/{id}','CampanaController@destroy');
        Route::get('/campanas/{id}','CampanaController@show');


    Route::group(['middleware' => 'jwt-auth'], function(){



        

 

    });
});
