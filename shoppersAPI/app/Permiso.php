<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Permiso extends Model
{
	/**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'permisos';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['camp_crear', 'camp_editar', 'camp_ver', 'camp_eliminar',
			'cuest_crear', 'cuest_eidtar', 'cuest_ver', 'cuest_eliminar',
			'est_crear', 'est_editar', 'est_ver', 'est_eliminar',
			'empleado_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['created_at','updated_at'];

    // Relación de permiso con empleado:
    public function empleado()
    {
        // 1 permiso pertenece a un empleado
        return $this->belongsTo('App\Empleado', 'empleado_id');
    }
}
