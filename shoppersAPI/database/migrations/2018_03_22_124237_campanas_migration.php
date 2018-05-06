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
            $table->string('edad')->nullable(); //rango 15-19
            $table->text('categorias')->nullable();
            $table->text('estados')->nullable(); //estados geograficos
            $table->text('municipios')->nullable();
            $table->text('localidades')->nullable();
            $table->float('presupuesto')->nullable();

            $table->float('presupuesto_max')->nullable();
            $table->integer('estado')->nullable(); //estado de la campaña (1= 2= 3=)

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
