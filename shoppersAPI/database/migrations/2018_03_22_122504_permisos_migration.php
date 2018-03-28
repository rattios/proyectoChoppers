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
            $table->integer('camp_crear')->nullable(); //campañas
            $table->integer('camp_editar')->nullable();
            $table->integer('camp_ver')->nullable();
            $table->integer('camp_eliminar')->nullable();
            $table->integer('cuest_crear')->nullable(); //cuestionarios
            $table->integer('cuest_eidtar')->nullable();
            $table->integer('cuest_ver')->nullable();
            $table->integer('cuest_eliminar')->nullable();
            $table->integer('est_crear')->nullable(); //estadisticas
            $table->integer('est_editar')->nullable();
            $table->integer('est_ver')->nullable();
            $table->integer('est_eliminar')->nullable();

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
