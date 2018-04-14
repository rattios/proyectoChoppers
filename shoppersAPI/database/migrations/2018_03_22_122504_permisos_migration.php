<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class PermisosMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('permisos', function (Blueprint $table) {
            $table->increments('id');
            $table->boolean('camp_crear')->nullable(); //campañas
            $table->boolean('camp_editar')->nullable();
            $table->boolean('camp_ver')->nullable();
            $table->boolean('camp_eliminar')->nullable();
            $table->boolean('cuest_crear')->nullable(); //cuestionarios
            $table->boolean('cuest_eidtar')->nullable();
            $table->boolean('cuest_ver')->nullable();
            $table->boolean('cuest_eliminar')->nullable();
            $table->boolean('est_crear')->nullable(); //estadisticas
            $table->boolean('est_editar')->nullable();
            $table->boolean('est_ver')->nullable();
            $table->boolean('est_eliminar')->nullable();

            $table->integer('empleado_id')->unsigned();
            $table->foreign('empleado_id')->references('id')->on('empleados');

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
        Schema::drop('permisos');
    }
}
