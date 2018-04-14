<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UsuariosMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->increments('id');
            $table->string('email')->nullable();
            $table->string('password')->nullable();
            $table->string('nombre')->nullable();
            $table->integer('tipo_usuario')->nullable(); //1=cliente 2=empresa 3=empleado
            $table->string('codigo_verificacion')->nullable();
            $table->integer('tipo_registro')->nullable(); //1=normal 2=facebook 3=twitter
            $table->string('id_facebook')->nullable();
            $table->string('id_twitter')->nullable();

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
        Schema::drop('usuarios');
    }
}
