<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
	/**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'empresas';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['imagen', 'token_sucursal', 'user_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    // Relación de empresa con usuario:
    public function usuario()
    {
        // 1 empresa pertenece a un usuario
        return $this->belongsTo('App\User', 'user_id');
    }

    // Relación de empresa con empleados:
    public function empleados()
    {
        // 1 empresa puede tener varios empleados
        return $this->hasMany('App\Empleado', 'empresa_id');
    }

    // Relación de empresa con categorias:
    public function categorias(){
        // 1 empresa contiene muchas categorias
        return $this->belongsToMany('\App\Categoria','empresa_categorias','empresa_id','categoria_id')
            /*->withPivot('')->withTimestamps()*/; 
    }

    // Relación de empresa con sucursales:
    public function sucursales()
    {
        // 1 empresa puede tener varias sucursales
        return $this->hasMany('App\Sucursal', 'empresa_id');
    }
}
