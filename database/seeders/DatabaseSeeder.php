<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\TechStack;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        User::updateOrCreate(
            ['email' => 'dzakaal10@gmail.com'],
            [
                'name' => 'Dzaka Al Ganteng',
                'password' => Hash::make('password123'),
            ]
        );

        // Initial Tech Stacks
        $stacks = [
            ['title' => 'HTML5', 'alt' => 'HTML5', 'src' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', 'order' => 1],
            ['title' => 'CSS3', 'alt' => 'CSS3', 'src' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', 'order' => 2],
            ['title' => 'JavaScript', 'alt' => 'JavaScript', 'src' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', 'order' => 3],
            ['title' => 'PHP', 'alt' => 'PHP', 'src' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg', 'order' => 4],
            ['title' => 'Python', 'alt' => 'Python', 'src' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', 'order' => 5],
            ['title' => 'Tailwind CSS', 'alt' => 'Tailwind CSS', 'src' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', 'order' => 6],
            ['title' => 'Bootstrap', 'alt' => 'Bootstrap', 'src' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg', 'order' => 7],
            ['title' => 'MySQL', 'alt' => 'MySQL', 'src' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', 'order' => 8],
            ['title' => 'React', 'alt' => 'React', 'src' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', 'order' => 9],
            ['title' => 'Laravel', 'alt' => 'Laravel', 'src' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg', 'order' => 10],
            ['title' => 'Git', 'alt' => 'Git', 'src' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', 'order' => 11],
            ['title' => 'GitHub', 'alt' => 'GitHub', 'src' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', 'order' => 12],
            ['title' => 'Figma', 'alt' => 'Figma', 'src' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', 'order' => 13],
            ['title' => 'Pandas', 'alt' => 'Pandas', 'src' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg', 'order' => 14],
            ['title' => 'TensorFlow', 'alt' => 'TensorFlow', 'src' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg', 'order' => 15],
        ];

        foreach ($stacks as $stack) {
            TechStack::updateOrCreate(
                ['title' => $stack['title']],
                $stack
            );
        }

        // Initial Chat Messages
        $initialMessages = [
            [
                'user' => 'Alex Mercer',
                'email' => 'alex@dev.io',
                'avatar' => 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
                'text' => 'Impressed by the smooth 3D spatial animations and micro-interactions! 🔥',
                'time' => '19:40',
            ],
            [
                'user' => 'Aria Chen',
                'email' => 'aria.chen@design.co',
                'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
                'text' => 'What matrix transformation logic is driving the Lab DriftWall component?',
                'time' => '19:48',
            ],
            [
                'user' => 'DzakaAl',
                'email' => 'dzakaal10@gmail.com',
                'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
                'text' => 'Hey Aria! The DriftWall utilizes dual-axis CSS perspective displacement synced with requestAnimationFrame. Glad you liked it!',
                'time' => '19:55',
            ],
        ];

        foreach ($initialMessages as $msg) {
            Message::create($msg);
        }
    }
}
