<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
	/**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'clientes';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['sexo', 'edad', 'lat',
			'lng', 'direccion', 'activo', 'imagen',
            'estado_id', 'municipio_id', 'localidad_id',
			'user_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    // Relación de cliente con usuario:
    public function usuario()
    {
        // 1 cliente pertenece a un usuario
        return $this->belongsTo('App\User', 'user_id');
    }

    // Relación de cliente con categorias:
    public function preferencias(){
        // 1 cliente contiene muchas preferencias(categorias)
        return $this->belongsToMany('\App\Categoria','cliente_categorias','cliente_id','categoria_id')
            /*->withPivot('')->withTimestamps()*/; 
    }

    // Relación de cliente con respuestas:
    public function respuestas()
    {
        // 1 cliente puede tener varias respuestas a cuestionarios
        return $this->hasMany('App\Respuesta', 'cliente_id');
    }
}
