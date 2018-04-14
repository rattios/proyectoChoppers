<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CampanaSucursalesMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('campana_sucursales', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('campana_id')->unsigned();
            $table->foreign('campana_id')->references('id')->on('campanas');

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
        Schema::drop('campana_sucursales');
    }
}
