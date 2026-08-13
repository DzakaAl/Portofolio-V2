const projects = [
  {
    id: 'cyber-arcade',
    title: 'CYBER ARCADE 2099',
    description:
      'Interactive high-speed synthwave arcade spaceship battle game engine built with React Three Fiber, custom shaders, and spatial audio.',
    tags: ['REACT', 'THREE.JS', 'WEBGL', 'GLSL'],
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    link: 'https://example.com',
    featured: true,
  },
  {
    id: 'neon-vault',
    title: 'NEON VAULT dAPP',
    description:
      'Decentralized liquidity vault management protocol featuring real-time interactive charts, dark mode glassmorphism UI, and smart contract integration.',
    tags: ['REACT', 'ETHERS.JS', 'SOLIDITY', 'TAILWIND'],
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
    link: 'https://example.com',
    featured: true,
  },
  {
    id: 'aether-engine',
    title: 'AETHER 3D STUDIO',
    description:
      'Browser-based node renderer and shader editor designed for 3D artists, game creators, and visual experience designers.',
    tags: ['REACT', 'WEBGPU', 'CANVAS', 'TYPESCRIPT'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    link: 'https://example.com',
    featured: true,
  },
  {
    id: 'quantum-os',
    title: 'QUANTUM OS DASHBOARD',
    description:
      'Next-generation AI operations dashboard monitoring cloud clusters, real-time telemetry data, and predictive metrics.',
    tags: ['NEXT.JS', 'TAILWIND', 'RECHARTS', 'AI'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    link: 'https://example.com',
    featured: false,
  },
  {
    id: 'synthwave-viz',
    title: 'SYNTHWAVE AUDIO VISUALIZER',
    description:
      'Audio spectrum analyzer creating reactive 3D visual landscapes synced to real-time audio frequencies.',
    tags: ['WEB AUDIO API', 'THREE.JS', 'REACT'],
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    link: 'https://example.com',
    featured: false,
  },
  {
    id: 'hyperion-commerce',
    title: 'HYPERION COMMERCE',
    description:
      'Futuristic e-commerce store experience with 3D product configurator and smooth scroll transitions.',
    tags: ['REACT', 'GLTF', 'GSAP', 'TAILWIND'],
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    link: 'https://example.com',
    featured: false,
  },
  {
    id: 'oracle-voice',
    title: 'ORACLE VOICE ENGINE',
    description:
      'Realtime voice command engine powering hands-free control with custom wake words, intent parsing, and spatial audio feedback.',
    tags: ['WHISPER', 'FASTAPI', 'REACT', 'WEBSOCKET'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    link: 'https://example.com',
    featured: false,
  },
  {
    id: 'nebula-motion',
    title: 'NEBULA MOTION IDENTITY',
    description:
      'Procedural motion identity system generating endless brand animations from a single GLSL shader signature.',
    tags: ['BLENDER', 'GLSL', 'WEBGL', 'GSAP'],
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    link: 'https://example.com',
    featured: false,
  },
  {
    id: 'hologram-hud',
    title: 'HOLOGRAM HUD DESIGN',
    description:
      'Interactive holographic head-up display system designed for autonomous drone piloting interfaces.',
    tags: ['FIGMA', 'THREE.JS', 'SHADERS'],
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    link: 'https://example.com',
    featured: false,
  },
  {
    id: 'neural-matrix',
    title: 'NEURAL MATRIX ENGINE',
    description:
      'Exploration tool allowing users to traverse generative neural latent spaces using gesture controls.',
    tags: ['PYTHON', 'WEBGPU', 'PYTORCH'],
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    link: 'https://example.com',
    featured: false,
  },
  {
    id: 'astro-sphere',
    title: 'ASTRO SPHERE VR',
    description:
      'Virtual reality space flight simulation with N-body gravitational physics and procedurally generated stars.',
    tags: ['WEBXR', 'THREE.JS', 'MATH'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    link: 'https://example.com',
    featured: false,
  },
  {
    id: 'pulse-synth',
    title: 'PULSE MODULAR SYNTH',
    description:
      'Browser-based drag-and-drop patching modular synthesizer with custom DSP sound node blocks.',
    tags: ['WEB AUDIO', 'CANVAS', 'REACT'],
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
    link: 'https://example.com',
    featured: false,
  },
];

export function getProjects() {
  return Promise.resolve(projects);
}

export function getFeaturedProjects() {
  return Promise.resolve(projects.filter((p) => p.featured));
}

export default projects;