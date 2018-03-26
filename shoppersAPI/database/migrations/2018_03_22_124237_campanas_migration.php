<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CampanasMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('campanas', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre')->nullable();
            $table->date('f_inicio')->nullable();
            $table->date('f_fin')->nullable();
            $table->string('genero')->nullable();
            $table->integer('edad')->nullable();
            $table->text('categorias')->nullable();
            $table->text('ciudades')->nullable();
            $table->text('colonias')->nullable();
            $table->integer('num_cuestionarios')->nullable();
            $table->float('presupuesto')->nullable();
            $table->float('reembolso')->nullable();
            
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
        Schema::drop('campanas');
    }
}
