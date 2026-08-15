<?php

namespace Database\Seeders;

use App\Models\About;
use App\Models\Message;
use App\Models\Project;
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
            ['email' => 'admin@portfolio.com'],
            [
                'name' => 'Admin Portfolio',
                'password' => Hash::make('password123'),
            ]
        );

        // Initial About Me Content
        About::updateOrCreate(
            ['id' => 1],
            [
                'title' => 'ABOUT ME',
                'description' => 'I am a Lead Creative Technologist & Full-Stack Architect with over 8 years of experience building high-impact digital solutions, scalable web systems, and modern interactive user experiences. My focus lies in unifying minimalist design aesthetics with robust software engineering practices to solve complex real-world problems. Throughout my journey, I have engineered diverse software applications ranging from responsive enterprise web platforms and data-driven dashboards to machine learning models and high-performance backend API services.',
                'image_url' => null,
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

        // Initial Projects
        $projectsList = [
            [
                'slug' => 'cyber-arcade',
                'title' => 'CYBER ARCADE 2099',
                'description' => 'Interactive high-speed synthwave arcade spaceship battle game engine built with React Three Fiber, custom shaders, and spatial audio.',
                'tags' => ['REACT', 'THREE.JS', 'WEBGL', 'GLSL'],
                'image' => 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
                'link' => 'https://example.com',
                'featured' => true,
                'order' => 1,
            ],
            [
                'slug' => 'neon-vault',
                'title' => 'NEON VAULT dAPP',
                'description' => 'Decentralized liquidity vault management protocol featuring real-time interactive charts, dark mode glassmorphism UI, and smart contract integration.',
                'tags' => ['REACT', 'ETHERS.JS', 'SOLIDITY', 'TAILWIND'],
                'image' => 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
                'link' => 'https://example.com',
                'featured' => true,
                'order' => 2,
            ],
            [
                'slug' => 'aether-engine',
                'title' => 'AETHER 3D STUDIO',
                'description' => 'Browser-based node renderer and shader editor designed for 3D artists, game creators, and visual experience designers.',
                'tags' => ['REACT', 'WEBGPU', 'CANVAS', 'TYPESCRIPT'],
                'image' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                'link' => 'https://example.com',
                'featured' => true,
                'order' => 3,
            ],
        ];

        foreach ($projectsList as $proj) {
            Project::updateOrCreate(
                ['slug' => $proj['slug']],
                $proj
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
