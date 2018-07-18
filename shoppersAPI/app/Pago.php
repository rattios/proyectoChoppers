<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'pagos';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['monto', 'tipo',
    	 	'empresa_id', 'tarjeta_id',
			'cliente_id', 'cuenta_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    // Relación de pago con empresa:
    public function empresa()
    {
        // 1 pago lo puede hacer una empresa
        return $this->belongsTo('App\Empresa', 'empresa_id');
    }

    // Relación de pago con tarjeta:
    public function tarjeta()
    {
        // 1 pago puede tene una tarjeta de una empresa
        return $this->belongsTo('App\Tarjeta', 'tarjeta_id');
    }

    // Relación de pago con cliente:
    public function cliente()
    {
        // 1 pago pude ser hecho para un cliente
        return $this->belongsTo('App\Cliente', 'cliente_id');
    }

    // Relación de pago con cuenta:
    public function cuenta()
    {
        // 1 pago puede tener una cuenta de un cliente
        return $this->belongsTo('App\Cuenta', 'cuenta_id');
    }
}
