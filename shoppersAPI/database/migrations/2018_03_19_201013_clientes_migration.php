<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ClientesMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->increments('id');
            $table->string('sexo')->nullable();
            $table->integer('edad')->nullable();
            $table->string('lat')->nullable();
            $table->string('lng')->nullable();
            $table->string('direccion')->nullable();
            $table->integer('activo')->nullable(); //1=SI 2=NO
            $table->string('imagen')->nullable();

            $table->integer('estado_id')->nullable();
            $table->integer('municipio_id')->nullable();
            $table->integer('localidad_id')->nullable();

            /*$table->integer('estado_id')->unsigned()->nullable();
            $table->foreign('estado_id')->references('id')->on('estados');

            $table->integer('municipio_id')->unsigned()->nullable();
            $table->foreign('municipio_id')->references('id')->on('municipios');

            $table->integer('localidad_id')->unsigned()->nullable();
            $table->foreign('localidad_id')->references('id')->on('localidades');*/

            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('usuarios');

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
        Schema::drop('clientes');
    }
}
