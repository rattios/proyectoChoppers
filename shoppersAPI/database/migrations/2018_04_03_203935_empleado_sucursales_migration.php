<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class EmpleadoSucursalesMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('empleado_sucursales', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('empleado_id')->unsigned();
            $table->foreign('empleado_id')->references('id')->on('empleados');

            $table->integer('sucursal_id')->unsigned();
            $table->foreign('sucursal_id')->references('id')->on('sucursales');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('empleado_sucursales');
    }
}
