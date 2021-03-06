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
    protected $fillable = ['nombre', 'saldo', 'f_inicio', 'f_fin', 'genero',
			'edad', 'categorias', 'localidades', 'municipios', 'estados',
			'presupuesto', 'presupuesto_max', 'estado', 'empresa_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['created_at','updated_at'];

    /*// Relación de campaña con sucursal:
    public function sucursal()
    {
        // 1 campaña pertenece a una sucursal
        return $this->belongsTo('App\Sucursal', 'sucursal_id');
    }*/

    // Relación de campana con sucursales:
    public function sucursales(){
        // 1 campana puede pertenecer a varias sucursales
        return $this->belongsToMany('\App\Sucursal','campana_sucursales','campana_id','sucursal_id')
            /*->withPivot('')->withTimestamps()*/; 
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

    // Relación de campaña con campana:
    public function empresa()
    {
        // 1 respuesta pertenece a una empresa
        return $this->belongsTo('App\Empresa', 'empresa_id');
    }
}
