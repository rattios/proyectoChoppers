<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Respuesta extends Model
{
	/**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'respuestas';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['cuestionario', 'imagen_factura',
    	 	'estado_pagado', 'monto_pagado',
			'campana_id', 'sucursal_id', 'cliente_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    // Relación de respuesta con campana:
    public function campana()
    {
        // 1 respuesta pertenece a una campana
        return $this->belongsTo('App\Campana', 'campana_id');
    }

    // Relación de respuesta con sucursal:
    public function sucursal()
    {
        // 1 respuesta pertenece a una sucursal
        return $this->belongsTo('App\Sucursal', 'sucursal_id');
    }

    // Relación de respuesta con cliente:
    public function cliente()
    {
        // 1 respuesta pertenece a un cliente
        return $this->belongsTo('App\Cliente', 'cliente_id');
    }
}
