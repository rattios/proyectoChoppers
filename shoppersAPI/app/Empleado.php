<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Empleado extends Model
{
	/**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'empleados';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['telefono', 'imagen',
			'empresa_id', 'user_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    // Relación de empleado con usuario:
    public function usuario()
    {
        // 1 empleado pertenece a un usuario
        return $this->belongsTo('App\User', 'user_id');
    }

    // Relación de empleado con empresa:
    public function empresa()
    {
        // 1 empleado pertenece a una empresa
        return $this->belongsTo('App\Empresa', 'empresa_id');
    }

    // Relación de empleado con permisos:
    public function permisos()
    {
        // 1 empleado puede tener un permiso
        return $this->hasOne('App\Permiso', 'empleado_id');
    }

    // Relación de empleado con sucursales:
    public function sucursales(){
        // 1 empleado se relaciona con muchas sucursales
        return $this->belongsToMany('\App\Sucursal','empleado_sucursales','empleado_id','sucursal_id')
            /*->withPivot('')->withTimestamps()*/; 
    }
}
