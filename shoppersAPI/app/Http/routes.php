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
    Route::post('/validar/token','LoginController@validarToken');
    Route::get('/login/pruebas','LoginController@prueba');

    //----Pruebas PasswordController
    Route::get('/password/usuario/{correo}','PasswordController@generarCodigo');
    Route::get('/password/codigo/{codigo}','PasswordController@validarCodigo');

        Route::put('/password/update/{usuario_id}','PasswordController@updatePassword'); 

        //----Pruebas UploadImagenController
        Route::post('/imagenes','UploadImagenController@store');
        Route::get('/respuestas/{id}','RespuestaController@respuesta');

        //----Pruebas ClienteController
        Route::get('/clientes','ClienteController@index');
        Route::post('/clientes','ClienteController@store');
        Route::put('/clientes/{id}','ClienteController@update');
        //Route::delete('/clientes/{id}','ClienteController@destroy');
        Route::get('/clientes/{id}','ClienteController@show');
        Route::get('/clientes/campanas/pendientes/{cliente_id}','ClienteController@campanasPendientes');
        Route::put('/clientes/tokennotificacion/{usuario_id}','ClienteController@setTokenNotificaion');
        Route::get('/clientes/estadistica/{cliente_id}','ClienteController@conteoEvaluaciones');

        //----Pruebas EmpresaController
        Route::get('/empresas','EmpresaController@index');
        Route::post('/empresas','EmpresaController@store');
        Route::put('/empresas/{id}','EmpresaController@update');
        //Route::delete('/empresas/{id}','EmpresaController@destroy');
        Route::get('/empresas/{id}','EmpresaController@show');
        Route::get('/empresas/{id}/empleados','EmpresaController@empresaEmpleados');
        Route::get('/empresas/{id}/sucursales','EmpresaController@empresaSucursales');
        Route::get('/empresas/{id}/campanas','EmpresaController@empresaCampanas');

        //----Pruebas EmpresaController
        Route::get('/empleados','EmpleadoController@index');
        Route::post('/empleados','EmpleadoController@store');
        Route::put('/empleados/{id}','EmpleadoController@update');
        Route::delete('/empleados/{id}','EmpleadoController@destroy');
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
        Route::get('/sucursales/{id}/campanas','SucursalController@sucursalCampanas');
        Route::get('/sucursales/{id}/campanas/nuevas','SucursalController@sucursalCampanasNuevas');
        Route::get('/sucursales/{id}/empleados','SucursalController@sucursalEmpleados');
        Route::get('/sucursales/{id}/campanas/sineditar','SucursalController@sucursalCampanasSinEditar');
        //------
        Route::get('/sucursales/{id}/campanas/activas','SucursalController@sucursalCampanasActivas');
        Route::get('/sucursales/{id}/campanas/finalizadas','SucursalController@sucursalCampanasFinalizadas');

        //----Pruebas CampanaController
        Route::get('/campanas','CampanaController@index');
        Route::post('/campanas','CampanaController@store');
        Route::put('/campanas/{id}','CampanaController@update');
        Route::delete('/campanas/{id}','CampanaController@destroy');
        Route::get('/campanas/{id}','CampanaController@show');
        //Route::post('/campanas/notificar/empleados','CampanaController@notificarEmpleados');

        //----Pruebas MxEstadosController
        Route::get('/mx/get/estados','MxEstadosController@getEstados');
        Route::get('/mx/get/municipios','MxEstadosController@getMunicipios');
        Route::get('/mx/get/localidades','MxEstadosController@getLocalidades');
        Route::get('/mx/get/localidades/plus','MxEstadosController@getLocalidadesPlus');

        //----Pruebas CuestionarioController
        Route::get('/cuestionarios','CuestionarioController@index');
        Route::post('/cuestionarios','CuestionarioController@store');
        Route::put('/cuestionarios/{id}','CuestionarioController@update');
        Route::delete('/cuestionarios/{id}','CuestionarioController@destroy');
        Route::get('/cuestionarios/{id}','CuestionarioController@show');
        Route::get('/cuestionarios/campana/{campana_id}','CuestionarioController@filterCuest');
        Route::get('/cuestionarios/sucursal/{sucursal_id}','CuestionarioController@filterCuest2');
        //-----
        Route::get('/cuestionarios/activos/sucursal/{sucursal_id}','CuestionarioController@filterCuestActivos');
        Route::get('/cuestionarios/finalizados/sucursal/{sucursal_id}','CuestionarioController@filterCuestFinalizados');

        //----Pruebas CuestionarioPlantillaController
        Route::get('/plantillas','CuestionarioPlantillaController@index');
        Route::post('/plantillas','CuestionarioPlantillaController@store');
        Route::put('/plantillas/{id}','CuestionarioPlantillaController@update');
        Route::delete('/plantillas/{id}','CuestionarioPlantillaController@destroy');
        Route::get('/plantillas/{id}','CuestionarioPlantillaController@show');

        //----Pruebas CuestionarioRespuestaController
        Route::get('/pre/respuestas','CuestionarioRespuestaController@index');
        Route::post('/pre/respuestas','CuestionarioRespuestaController@store');
        Route::put('/pre/respuestas/{id}','CuestionarioRespuestaController@update');
        Route::delete('/pre/respuestas/{id}','CuestionarioRespuestaController@destroy');
        Route::get('/pre/respuestas/{id}','CuestionarioRespuestaController@show');

        //----Pruebas RespuestaController
        Route::get('/evaluaciones','RespuestaController@index');
        Route::post('/evaluaciones','RespuestaController@store');
        Route::put('/evaluaciones/{id}','RespuestaController@update');
        Route::delete('/evaluaciones/{id}','RespuestaController@destroy');
        Route::get('/evaluaciones/{id}','RespuestaController@show');
        Route::get('/evaluaciones/respondidas/{cliente_id}','RespuestaController@evaluacionesRespondidas');
        Route::post('/evaluaciones/pagar/{cliente_id}/{empresa_id}/{cuestionario_id}','RespuestaController@generatePago');

        //----Pruebas NotificacionController
        Route::post('/notificaciones/crear/campanas','NotificacionController@notificarCrearCamp');
        Route::post('/notificaciones/crear/cuestionarios','NotificacionController@notificarCrearCuest');
        Route::post('/notificaciones/notificar/clientes','NotificacionController@fiterUsersNotifications');
        Route::get('/notificaciones/auto/finales','NotificacionController@notificationAuto');
        Route::get('/notificaciones/auto/iniciales','NotificacionController@notificationAuto2');

        //----Pruebas TarjetaController
        Route::get('/tarjetas/empresa/{empresa_id}','TarjetaController@index');
        Route::post('/tarjetas','TarjetaController@store');
        Route::put('/tarjetas/{id}','TarjetaController@update');
        Route::delete('/tarjetas/{id}','TarjetaController@destroy');
        Route::get('/tarjetas/{id}','TarjetaController@show');

        //----Pruebas PagoController
        Route::get('/pagos/empresa/{empresa_id}','PagoController@index');
        Route::get('/pagos/cliente/{cliente_id}','PagoController@index2');
        Route::post('/pagos/empresa','PagoController@store');
        Route::post('/pagos/cliente','PagoController@store2');
        Route::put('/pagos/{id}','PagoController@update');
        Route::delete('/pagos/{id}','PagoController@destroy');
        Route::get('/pagos/{id}','PagoController@show');

        //----Pruebas CuentaController
        Route::get('/cuentas/cliente/{cliente_id}','CuentaController@index');
        Route::post('/cuentas','CuentaController@store');
        Route::put('/cuentas/{id}','CuentaController@update');
        Route::delete('/cuentas/{id}','CuentaController@destroy');
        Route::get('/cuentas/{id}','CuentaController@show');

    Route::group(['middleware' => 'jwt-auth'], function(){



        

 

    });
});
