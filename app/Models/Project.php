<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'description',
        'tags',
        'image',
        'link',
        'featured',
        'order',
    ];

    protected $casts = [
        'tags' => 'array',
        'featured' => 'boolean',
    ];
}
