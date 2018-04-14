<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SucursalesMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sucursales', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre')->nullable();
            $table->string('lat')->nullable();
            $table->string('lng')->nullable();
            $table->string('direccion')->nullable();
            $table->string('email')->nullable();
            $table->text('horario')->nullable();
            $table->text('imagenes')->nullable();
            $table->string('logo')->nullable(); //url_logo

            $table->integer('estado_id')->nullable();
            $table->integer('municipio_id')->nullable();
            $table->integer('localidad_id')->nullable();

            /*$table->integer('estado_id')->unsigned()->nullable();
            $table->foreign('estado_id')->references('id')->on('estados');

            $table->integer('municipio_id')->unsigned()->nullable();
            $table->foreign('municipio_id')->references('id')->on('municipios');

            $table->integer('localidad_id')->unsigned()->nullable();
            $table->foreign('localidad_id')->references('id')->on('localidades');*/

            $table->integer('empresa_id')->unsigned();
            $table->foreign('empresa_id')->references('id')->on('empresas');
            
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
        Schema::drop('sucursales');
    }
}
