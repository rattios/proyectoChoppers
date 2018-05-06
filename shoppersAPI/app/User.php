<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

class User extends Model implements AuthenticatableContract,
                                    AuthorizableContract,
                                    CanResetPasswordContract
{
    use Authenticatable, Authorizable, CanResetPassword;
        /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'usuarios';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['email', 'password', 'nombre',
        'tipo_usuario', 'codigo_verificacion', 'token_notificacion',
        'tipo_registro', 'id_facebook', 'id_twitter'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['password'];

    // Relación de usuario con clientes:
    public function cliente()
    {
        // 1 usuario puede tener un cliente
        return $this->hasOne('App\Cliente', 'user_id');
    }

    // Relación de usuario con empresas:
    public function empresa()
    {
        // 1 usuario puede tener una empresa
        return $this->hasOne('App\Empresa', 'user_id');
    }

    // Relación de usuario con empleados:
    public function empleado()
    {
        // 1 usuario puede tener un empleado
        return $this->hasOne('App\Empleado', 'user_id');
    }
}
