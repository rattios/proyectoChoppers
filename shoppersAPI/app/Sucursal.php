<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Sucursal extends Model
{
	/**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'sucursales';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['nombre', 'lat', 'lng', 'direccion',
			'email', 'horario',
			'imagenes', 'logo',
            'estado_id', 'municipio_id', 'localidad_id',
            'empresa_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['created_at','updated_at'];

    // Relación de sucursal con empresa:
    public function empresa()
    {
        // 1 sucursal pertenece a una empresa
        return $this->belongsTo('App\Empresa', 'empresa_id');
    }

    // Relación de sucursal con campañas:
    public function campanas()
    {
        // 1 sucursal puede tener varias campañas
        return $this->belongsToMany('\App\Campana','campana_sucursales','sucursal_id','campana_id')
            /*->withPivot('')->withTimestamps()*/;
    }

    // Relación de sucursales con empleados:
    public function empleados(){
        // 1 sucursal se relaciona con muchos empleados
        return $this->belongsToMany('\App\Empleado','empleado_sucursales','sucursal_id','empleado_id')
            /*->withPivot('')->withTimestamps()*/; 
    }
}
