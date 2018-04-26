<?php

namespace App\Http\Controllers;

use Hash;
use App\Http\Requests;
use App\User;
use App\Empresa;
use App\Empleado;
use App\Usuario;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use DB;

class LoginController extends Controller
{

    /*Funcion para verificar la valides de un token que se pasa en el request*/
    public function validarToken(Request $request)
    {

        try {
            $user = JWTAuth::toUser($request->input('token'));
        } catch (Exception $e) {
            if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException){
                return 0;
            }else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException){
                return 0;
            }else if ($e instanceof \Tymon\JWTAuth\Exceptions\JWTException){
                return 0;
            }else{
                return 0;
            }
        }

        return 1;
    }
    

    public function loginWeb(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $token = null;
        $user = null;

        try {

            $user = User::where('email', $request->input('email'))->first();
            if (empty($user)) {
                return response()->json(['error' => 'Email inválido.'], 401);
            }

            //En el panel solo se logean empresas y empleados
            if ($user->tipo_usuario != 2 && $user->tipo_usuario != 3) {
                return response()->json(['error' => 'Credenciales inválidas.'], 401);
            }

            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Password inválido.'], 401);
            }

            $user = JWTAuth::toUser($token);
            

        } catch (JWTException $ex) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        //return response()->json(compact('token', 'user'));

        if ($user->tipo_usuario == 2) {
            //$user->empresa = Empresa::where('user_id', $user->id)->first();
            $user->empresa = $user->empresa;
            $user->empresa->sucursales = $user->empresa->sucursales;
        }
        else if ($user->tipo_usuario == 3) {
            //$user->empleado = Empleado::where('user_id', $user->id)->first();
            $user->empleado = $user->empleado;
            $user->empleado->permisos = $user->empleado->permisos;

            $idsSucursales = DB::select("SELECT sucursal_id FROM empleado_sucursales WHERE
                 empleado_id = ".$user->empleado->id);

            $aux = [];
            for ($i=0; $i < count($idsSucursales); $i++) { 
                array_push($aux, \App\Sucursal::select('id', 'nombre')->find($idsSucursales[$i]->sucursal_id));
            }

            $user->empleado->sucursales = $aux;
        }


        return response()
            ->json([
                'token' => $token,
                'user' => $user
            ]);
    }

    public function loginApp(Request $request)
    {    
        $credentials = $request->only('email', 'password');
        $token = null;
        $user = null;
        $bandera = false;

        try {

            if ($request->input('email') && $request->input('password')) {

                $credentials = $request->only('email', 'password');

                $user = User::where('email', $request->input('email'))->first();
                if (empty($user)) {
                    return response()->json(['error' => 'Email inválido.'], 401);
                }

                //En la app solo se logean usuarios clientes
                if ($user->tipo_usuario != 1) {
                    return response()->json(['error' => 'Credenciales inválidas.'], 401);
                }
                
                if ($request->input('password') == null || $request->input('password') == '') {
                    return response()->json(['error' => 'Password inválido!'], 401);
                }

                if (!$token = JWTAuth::attempt($credentials)) {
                    return response()->json(['error' => 'Password inválido.'], 401);
                }

                $token = JWTAuth::fromUser($user);
                $bandera=true;
                
                if ($user->id_facebook == null && $request->input('id_facebook') != null && $request->input('id_facebook') != '') {

                    $user->id_facebook = $request->input('id_facebook');
                    $user->save();
                }
                if ($user->id_twitter == null && $request->input('id_twitter') != null && $request->input('id_twitter') != '') {

                    $user->id_twitter = $request->input('id_twitter');
                    $user->save();
                }


            }else if(!$bandera && $request->input('email') && !$request->input('password')){

                $user = User::where('email', $request->input('email'))->first();
                if (empty($user)) {
                    return response()->json(['error' => 'Usuario no encontrado.'], 401);
                }

                //En la app solo se logean usuarios clientes
                if ($user->tipo_usuario != 1 || $user->tipo_registro == 1) {
                    return response()->json(['error' => 'Credenciales inválidas.'], 401);
                }

                $token = JWTAuth::fromUser($user);
                $bandera=true;
                
                if ($user->id_facebook == null && $request->input('id_facebook') != null && $request->input('id_facebook') != '') {

                    $user->id_facebook = $request->input('id_facebook');
                    $user->save();
                }
                if ($user->id_twitter == null && $request->input('id_twitter') != null && $request->input('id_twitter') != '') {

                    $user->id_twitter = $request->input('id_twitter');
                    $user->save();
                }

            }else if(!$bandera && $request->input('id_facebook')){

                $user = User::where('id_facebook', $request->input('id_facebook'))->first();
                if (empty($user)) {
                    return response()->json(['error' => 'Usuario no encontrado.'], 401);
                }

                //En la app solo se logean usuarios clientes
                if ($user->tipo_usuario != 1) {
                    return response()->json(['error' => 'Credenciales inválidas.'], 401);
                }

                $token = JWTAuth::fromUser($user);
                $bandera=true;

            }else if(!$bandera && $request->input('id_twitter')){

                $user = User::where('id_twitter', $request->input('id_twitter'))->first();
                if (empty($user)) {
                    return response()->json(['error' => 'Usuario no encontrado.'], 401);
                }

                //En la app solo se logean usuarios clientes
                if ($user->tipo_usuario != 1) {
                    return response()->json(['error' => 'Credenciales inválidas.'], 401);
                }

                $token = JWTAuth::fromUser($user);
                $bandera=true;

            }
             
            $user = JWTAuth::toUser($token);
            

        } catch (JWTException $ex) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        //return response()->json(compact('token', 'user'));

        $user->cliente = $user->cliente;
        //$user->cliente = $user->cliente()->get();

        return response()
            ->json([
                'token' => $token,
                'user' => $user
            ]);
    }

}
