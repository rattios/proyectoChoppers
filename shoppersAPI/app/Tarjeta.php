<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tarjeta extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'tarjetas';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['token_id', 'tarjeta',
    	'fecha_vencimiento', 'tipo', 'empresa_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['created_at','updated_at'];

    // Relación de tarjeta con empresa:
    public function empresa()
    {
        // 1 tarjeta pertenece a una empresa
        return $this->belongsTo('App\Empresa', 'empresa_id');
    }

}
