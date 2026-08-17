<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark scroll-smooth">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>DzakaAl - Portofolio</title>
        <meta name="description" content="Futuristic dark-mode portfolio of EXTIZ - Creative Developer, Designer & Web3 Engineer." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        
        <!-- Google Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Allura&family=Cinzel:wght@500;700;900&family=Love+Light&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
        <!-- Google Identity Services (Sign in with Google) -->
        <script src="https://accounts.google.com/gsi/client" async defer></script>

        @viteReactRefresh
        @vite(['resources/js/main.jsx'])
    </head>
    <body class="bg-black text-slate-100 antialiased selection:bg-white selection:text-black overflow-x-hidden">
        <div id="root"></div>
    </body>
</html>
