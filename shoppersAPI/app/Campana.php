<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Campana extends Model
{
	/**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'campanas';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['nombre', 'f_inicio', 'f_fin', 'genero',
			'edad', 'categorias', 'ciudades', 'colonias',
			'num_cuestionarios', 'presupuesto', 'reembolso', 'sucursal_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['created_at','updated_at'];

    // Relación de campaña con sucursal:
    public function sucursal()
    {
        // 1 campaña pertenece a una sucursal
        return $this->belongsTo('App\Sucursal', 'sucursal_id');
    }

    // Relación de campaña con respuestas:
    public function respuestas()
    {
        // 1 campaña puede tener varias respuestas a cuestionarios
        return $this->hasMany('App\Respuesta', 'campana_id');
    }

    // Relación de campaña con cuestionarios:
    public function cuestionarios()
    {
        // 1 campaña puede tener varios cuestionarios
        return $this->hasMany('App\Cuestionario', 'campana_id');
    }
}
