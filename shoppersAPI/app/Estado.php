<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Estado extends Model
{
	/**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'estados';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['clave', 'nombre',
            'abrev', 'activo'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['clave',
            'abrev', 'activo'];

    // Relación de estado con municipios:
    public function municipios()
    {
        // 1 estado puede tener varios municipios
        return $this->hasMany('App\Municipio', 'estado_id');
    }


}
