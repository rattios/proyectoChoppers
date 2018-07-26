<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Foundation\Inspiring;

//use Log;
use DB;

class NotificationClientes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'clientes:notificar';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Notificar a los clientes los dias que tienen para responder una evaluacion';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        //Log::info("Notificacion enviada");

        DB::table('clientes')
                ->where('id', 2)
                ->update(['edad' => 21]);
    }
}
