<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Localidad extends Model
{
	/**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'localidades';

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
            'latitud','longitud',
            'lat','lng',
            'altitud','activo',
            'municipio_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    // Relación de localidad con municipio:
    public function municipio()
    {
        // 1 localidad pertenece a un municipio
        return $this->belongsTo('App\Municipio', 'municipio_id');
    }

}
