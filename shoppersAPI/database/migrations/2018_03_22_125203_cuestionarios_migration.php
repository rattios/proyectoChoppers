<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CuestionariosMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cuestionarios', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre')->nullable();
            $table->text('cuestionario')->nullable();

            $table->integer('num_cuestionarios')->nullable();
            $table->float('pagoxcuest')->nullable();
            $table->float('comision')->nullable();
            $table->float('total')->nullable();
            $table->integer('estado_pago')->nullable();
             $table->integer('estado')->nullable();

            $table->integer('campana_id')->unsigned();
            $table->foreign('campana_id')->references('id')->on('campanas');

            $table->text('descripcion')->nullable();

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
        Schema::drop('cuestionarios');
    }
}
