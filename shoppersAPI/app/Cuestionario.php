<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cuestionario extends Model
{
	/**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'cuestionarios';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['nombre', 'count_notif', 'cuestionario', 'campana_id',
        'num_cuestionarios', 'pagoxcuest', 'comision',
        'total', 'estado_pago', 'estado', 'descripcion' ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['created_at','updated_at'];

    //Mutador para count_notif
    public function setCountNotifAttribute($value=0)
    {
        $this->attributes['count_notif'] = 0;
    }

    // Relación de cuestionario con campana:
    public function campana()
    {
        // 1 cuestionario pertenece a un campana
        return $this->belongsTo('App\Campana', 'campana_id');
    }
}
