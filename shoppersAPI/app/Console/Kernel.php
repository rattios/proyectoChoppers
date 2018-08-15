<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        Commands\Inspire::class,
        Commands\NotificationFinalClientes::class,
        Commands\NotificationInicialClientes::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('inspire')
                 ->hourly();

        /*$schedule->command('clientes:notificarFinal')
                 ->everyMinute();

        $schedule->command('clientes:notificarInicial')
                 ->everyMinute();*/

        $schedule->command('clientes:notificarFinal')
                 ->dailyAt('10:00');

        $schedule->command('clientes:notificarInicial')
                 ->dailyAt('08:00');
    }
}
