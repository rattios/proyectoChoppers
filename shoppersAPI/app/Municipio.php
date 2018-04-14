<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Municipio extends Model
{
	/**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'municipios';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['clave','nombre',
            'activo','estado_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    // Relación de municipio con estado:
    public function estado()
    {
        // 1 municipio pertenece a un estado
        return $this->belongsTo('App\Estado', 'estado_id');
    }

    // Relación de municipio con localidades:
    public function localidades()
    {
        // 1 municipio puede tener varias localidades
        return $this->hasMany('App\Localidad', 'municipio_id');
    }
   
}
