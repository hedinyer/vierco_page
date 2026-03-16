<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Minimalista Elegante - Catalog</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;family=Space+Grotesk:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "tertiary-container": "#1b1c1c",
                        "surface-container-high": "#e8e8e8",
                        "inverse-surface": "#2f3131",
                        "secondary-fixed": "#ffddb5",
                        "inverse-primary": "#c9c6c5",
                        "error-container": "#ffdad6",
                        "on-primary-container": "#858383",
                        "on-secondary-fixed-variant": "#5c421e",
                        "on-secondary-container": "#795c35",
                        "surface-container-lowest": "#ffffff",
                        "surface-container-low": "#f3f3f3",
                        "tertiary": "#000000",
                        "on-tertiary-container": "#848484",
                        "on-surface": "#1a1c1c",
                        "background": "#f9f9f9",
                        "on-tertiary": "#ffffff",
                        "inverse-on-surface": "#f1f1f1",
                        "primary-fixed-dim": "#c9c6c5",
                        "on-primary-fixed": "#1c1b1b",
                        "on-secondary": "#ffffff",
                        "surface-variant": "#e2e2e2",
                        "on-primary-fixed-variant": "#474646",
                        "outline-variant": "#c4c7c7",
                        "on-secondary-fixed": "#2a1800",
                        "tertiary-fixed": "#e3e2e2",
                        "secondary-container": "#fed6a6",
                        "outline": "#747878",
                        "surface-dim": "#dadada",
                        "on-error": "#ffffff",
                        "secondary-fixed-dim": "#e6c091",
                        "primary-fixed": "#e5e2e1",
                        "on-primary": "#ffffff",
                        "tertiary-fixed-dim": "#c7c6c6",
                        "on-background": "#1a1c1c",
                        "surface-tint": "#5f5e5e",
                        "error": "#ba1a1a",
                        "primary-container": "#1c1b1b",
                        "on-tertiary-fixed": "#1b1c1c",
                        "on-tertiary-fixed-variant": "#464747",
                        "primary": "#000000",
                        "on-error-container": "#93000a",
                        "surface-bright": "#f9f9f9",
                        "surface": "#f9f9f9",
                        "secondary": "#765933",
                        "surface-container-highest": "#e2e2e2",
                        "surface-container": "#eeeeee",
                        "on-surface-variant": "#444748"
                    },
                    fontFamily: {
                        "headline": ["Newsreader"],
                        "body": ["Space Grotesk"],
                        "label": ["Space Grotesk"]
                    },
                    borderRadius: { "DEFAULT": "0px", "lg": "0px", "xl": "0px", "full": "9999px" },
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
            font-size: 20px;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .architectural-grid {
            border-left: 1px solid #e2e2e2;
            border-top: 1px solid #e2e2e2;
        }
        .architectural-grid > div {
            border-right: 1px solid #e2e2e2;
            border-bottom: 1px solid #e2e2e2;
        }
    </style>
</head>
<body class="bg-background text-on-surface font-body selection:bg-secondary selection:text-white">
<!-- TopNavBar -->
<nav class="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/20 px-6 py-6 lg:px-12">
<div class="flex items-center justify-between">
<div class="flex items-center gap-12">
<span class="font-headline text-2xl font-semibold tracking-tight">Minimalista Elegante</span>
<div class="hidden md:flex gap-8">
<a class="font-label text-xs tracking-[0.2em] hover:text-secondary transition-colors" href="#">CORPORATE</a>
<a class="font-label text-xs tracking-[0.2em] hover:text-secondary transition-colors" href="#">COLLECTION</a>
</div>
</div>
<div class="flex items-center gap-6">
<button class="flex items-center gap-2 group">
<span class="font-label text-xs tracking-[0.2em] group-hover:text-secondary transition-colors">CART (0)</span>
<span class="material-symbols-outlined text-primary group-hover:text-secondary transition-colors" data-icon="shopping_bag">shopping_bag</span>
</button>
</div>
</div>
</nav>
<!-- Sidebar / Quick Cart (Destination Screen Logic) -->
<aside class="fixed right-0 top-0 h-screen w-80 bg-surface-container-lowest z-[60] border-l border-outline-variant/30 translate-x-full lg:translate-x-0 hidden lg:flex flex-col">
<div class="p-8 border-b border-outline-variant/20">
<div class="flex items-center gap-4 mb-2">
<span class="material-symbols-outlined text-primary" data-icon="shopping_bag">shopping_bag</span>
<h2 class="font-headline text-xl italic">Quick Cart</h2>
</div>
<p class="font-label text-[10px] tracking-widest text-on-surface-variant uppercase">Your Selection</p>
</div>
<div class="flex-grow p-8 flex flex-col justify-center items-center text-center opacity-40">
<span class="material-symbols-outlined text-4xl mb-4" data-icon="inventory_2">inventory_2</span>
<p class="text-sm">Your gallery is currently empty.</p>
</div>
<div class="p-8">
<button class="w-full bg-primary text-on-primary py-5 font-label text-xs tracking-[0.3em] hover:bg-secondary transition-all duration-500">
                CHECKOUT
            </button>
</div>
</aside>
<main class="lg:mr-80 min-h-screen">
<!-- Hero Header -->
<header class="px-6 py-20 lg:px-24 bg-surface-container-low">
<div class="max-w-4xl">
<h1 class="font-headline text-6xl lg:text-8xl leading-none mb-8">Architectural <br/><span class="italic">Footwear</span></h1>
<p class="text-on-surface-variant max-w-md leading-relaxed font-light text-lg">
                    A curated selection of corporate silhouettes designed for the modern structuralist. No compromises on form or function.
                </p>
</div>
</header>
<!-- Filter Bar -->
<div class="px-6 lg:px-24 py-8 flex justify-between items-end border-b border-outline-variant/20">
<div class="flex gap-12">
<button class="font-label text-[10px] tracking-widest border-b border-primary pb-1">ALL SERIES</button>
<button class="font-label text-[10px] tracking-widest text-on-surface-variant hover:text-primary pb-1 transition-colors">OXFORDS</button>
<button class="font-label text-[10px] tracking-widest text-on-surface-variant hover:text-primary pb-1 transition-colors">DERBIES</button>
<button class="font-label text-[10px] tracking-widest text-on-surface-variant hover:text-primary pb-1 transition-colors">LOAFERS</button>
</div>
<span class="font-label text-[10px] tracking-widest text-on-surface-variant">DISPLAYING 12 OBJECTS</span>
</div>
<!-- Product Grid -->
<section class="px-6 lg:px-24 py-16">
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-y-24 gap-x-12">
<!-- Product Card 1: Oxford Executive (Hover State) -->
<div class="group cursor-pointer">
<div class="relative aspect-[3/4] bg-[#F7F7F7] flex items-center justify-center overflow-hidden mb-4 transition-all duration-700">
<img alt="Oxford Executive Shoe" class="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" data-alt="Polished black leather oxford dress shoe" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvoMWxTQOO38R3hZ1xQmLYV-R3BVuAZx-MajXhFgeIHBD9XlyE1KzxJ47xWUnVLZHBaOqYlEMX_sARXjGlGkneTUVnDhFykhsdaHzkGPN56XiXXFNOUaejlLrVhVpuE3QOZGUf-tMVws1sDC8U7QK4drQ2cg68i1uhh_D31gEPAcK7EuRt0UTXAZGdf-7FN12BSABbjXkKdoUFUF9S40A1y9sSd4xIkDEpM_rvhxiToExkSC_oJ3mtBXzM699Qv4p9JbigsJsy9Msq"/>
<!-- Quick-Buy Matrix Overlay -->
<div class="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
<p class="font-label text-[10px] tracking-[0.3em] mb-6">SELECT SIZE</p>
<div class="grid grid-cols-3 gap-2 w-full max-w-[200px]">
<button class="border border-primary py-3 text-[10px] font-label hover:bg-primary hover:text-white transition-colors">39</button>
<button class="border border-primary py-3 text-[10px] font-label hover:bg-primary hover:text-white transition-colors">40</button>
<button class="border border-primary py-3 text-[10px] font-label hover:bg-primary hover:text-white transition-colors">41</button>
<button class="border border-primary py-3 text-[10px] font-label hover:bg-primary hover:text-white transition-colors">42</button>
<button class="border border-primary py-3 text-[10px] font-label hover:bg-primary hover:text-white transition-colors">43</button>
<button class="border border-primary py-3 text-[10px] font-label hover:bg-primary hover:text-white transition-colors">44</button>
</div>
<button class="mt-8 text-[10px] font-label tracking-[0.2em] underline underline-offset-8 decoration-1 hover:text-secondary transition-colors">ADD TO CART</button>
</div>
</div>
<div class="mt-4 flex flex-col">
<h3 class="font-headline text-xl mb-1">Oxford Executive</h3>
<p class="font-label text-xs text-on-surface-variant tracking-wider">$450.00</p>
</div>
</div>
<!-- Product Card 2 -->
<div class="group cursor-pointer">
<div class="relative aspect-[3/4] bg-[#F7F7F7] flex items-center justify-center overflow-hidden mb-4 transition-all duration-700">
<img alt="Structural Derby" class="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" data-alt="Sleek dark brown matte derby shoes" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARtMdPL5EpTpwuf8VuogK2wWseFbJYArVI4qxhvLrkQBwf5bVccI6Sw8w-01vmu5Veq8bQZB8knC37t_FPSni5duSHHVP-DVwk7EQUrLKcHw4oRktZ0hSM2nuY_EWnhg6DZCmgLQ88PjO7W2QfjhThWhV3SuWk43MKwh02vMYwWGEBD-__UobBt-zL1L4Mz3TechBvvMs1fHO6-0uFqSR04HjOBcNEG2a8JKcm1297SACZgUQrAXGSNeGaxbqqMRz0XvrE7VKkvIvJ"/>
</div>
<div class="mt-4 flex flex-col">
<h3 class="font-headline text-xl mb-1">Structural Derby</h3>
<p class="font-label text-xs text-on-surface-variant tracking-wider">$425.00</p>
</div>
</div>
<!-- Product Card 3 -->
<div class="group cursor-pointer">
<div class="relative aspect-[3/4] bg-[#F7F7F7] flex items-center justify-center overflow-hidden mb-4 transition-all duration-700">
<img alt="Monolith Loafer" class="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" data-alt="Modern black leather loafers with platform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqjKGDNbfzkwxmJ252luYxWL9w8UCY6pVSweYGZkGKNLECTf_6VVi2Fj7PGDbPlwmsxvnRIgyZcHqKwdl6DGgL6n1gZhKu0pHbaAkLIOPPqrw_IPGBUREalNIyhIxVJPrLB5fWofiOXXG6tt61RKv84BihtQUALAFT82iVqLWa3sOkw7QSK88_D4ONI4OcCx5s9q6QYndFKY4_qL-ZalLn_J6N82rqJANyMGw_uek2WVm2JVVvkuLviWSs-JZiO_9hu3DyvjH3CtDW"/>
</div>
<div class="mt-4 flex flex-col">
<h3 class="font-headline text-xl mb-1">Monolith Loafer</h3>
<p class="font-label text-xs text-on-surface-variant tracking-wider">$490.00</p>
</div>
</div>
<!-- Product Card 4 -->
<div class="group cursor-pointer">
<div class="relative aspect-[3/4] bg-[#F7F7F7] flex items-center justify-center overflow-hidden mb-4 transition-all duration-700">
<img alt="Corporate Chelsea" class="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" data-alt="Classic black leather chelsea boots minimalist" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAytM5Zku9Z4gwCVwO1sI5-ZLyeusgbUQp1TrS0FYRg2tx3a75sV2oJbEmA7AGUEob8uqmi4mU_L3Z9wuj5ZFtVqJaggvMrpza6Ts1MqpJfzAlJo5seVv5786xM94Lj1EgB6KRZpNN8hmBg--8T-bBr8vYqTGgre2tqC_R7PFN_s5YrUiHxgbiIGkAd9GnOILEqjLjSqW-M77XvTiFjsaa9VzVFQuov_M5S4zXy_opZlbupoRSPuEiSQF3pjEUhIa280U550_7LOh7T"/>
</div>
<div class="mt-4 flex flex-col">
<h3 class="font-headline text-xl mb-1">Corporate Chelsea</h3>
<p class="font-label text-xs text-on-surface-variant tracking-wider">$550.00</p>
</div>
</div>
<!-- Row 2 -->
<div class="group cursor-pointer">
<div class="relative aspect-[3/4] bg-[#F7F7F7] flex items-center justify-center overflow-hidden mb-4 transition-all duration-700">
<img alt="Symmetry Monkstrap" class="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" data-alt="Double monk strap shoes in black leather" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcQrPq091R6xTU8PAU7YH9CCTvAqBPSJCgUPjpsJ5nEz5x6N1I3bLw5zJq7T_qXdG7Exrlc9gwBA1oaEnI5AYjeejVy3-94BOOtK8d32QldEJNrSBvsg2DN6x974-3C3lOmMPdqbImQtJyUVinfRWqQ8-o9uZBvQDy9kW8f6kaAmQjmaQE8NDH4efqKr5D5Ma3DxL2mlZEqHeaVTwJFKAVhe6nTDnHI_nmhWeZxnQ1xAnbolS2oGisCGiGlU2IqqoVK5woKlHXB8Zy"/>
</div>
<div class="mt-4 flex flex-col">
<h3 class="font-headline text-xl mb-1">Symmetry Monkstrap</h3>
<p class="font-label text-xs text-on-surface-variant tracking-wider">$510.00</p>
</div>
</div>
<div class="group cursor-pointer">
<div class="relative aspect-[3/4] bg-[#F7F7F7] flex items-center justify-center overflow-hidden mb-4 transition-all duration-700">
<img alt="Linear Derby" class="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" data-alt="Light tan refined leather derby shoes" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAz7zAMc5CL8DQVskStR7pZTHyqJmYOtK8jUjANrEDa3ZHOPNlrhgjcGX1xwhlWH7eIt_LX_SJTWp0__GAteAGLeHB-VtKLwJ5aaWHGOJZDSj03k7lt6qxZ3NGYiSsSRIXSRfkBUP04PrWRpGKqnufJnh5N6QAv3eDWcbl2q9EkDdKLlKeRyMFavfSf_6a2p1afLkDkJCUX0SbqHBzCzEQJL1gdl6orMLPRAX56CLF7d1GzMNhwGMugyQFKYoFaBzSvqvsuIV9laOkg"/>
</div>
<div class="mt-4 flex flex-col">
<h3 class="font-headline text-xl mb-1">Linear Derby</h3>
<p class="font-label text-xs text-on-surface-variant tracking-wider">$395.00</p>
</div>
</div>
<div class="group cursor-pointer">
<div class="relative aspect-[3/4] bg-[#F7F7F7] flex items-center justify-center overflow-hidden mb-4 transition-all duration-700">
<img alt="Obsidian Loafer" class="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" data-alt="Deep black velvet evening loafers" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAA5LPFYA1Mky0Tpx3klNzuxc_AaKw9hrSuMlRphG3fK8-elSyv9mvRP6QoFmxzPuVdmHjkycPjnS--syPNzclEpHl6MI6Ft3j7D8DGZcQ25iGKhkU05_iwg7CVNBg9Q3vpvYZcW47kizFaT5NIpusFOE0Ypt7-iiXj0Ze_bnfBLG_jedUjx942JukwIYpThE3oRaPNID26W2Lq_pxE2uhYnpvzfPdNjyOqXULZxHLzf1tjUMvz_B6ayIR92ESReDqF3KupDL3FyBM"/>
</div>
<div class="mt-4 flex flex-col">
<h3 class="font-headline text-xl mb-1">Obsidian Loafer</h3>
<p class="font-label text-xs text-on-surface-variant tracking-wider">$620.00</p>
</div>
</div>
<div class="group cursor-pointer">
<div class="relative aspect-[3/4] bg-[#F7F7F7] flex items-center justify-center overflow-hidden mb-4 transition-all duration-700">
<img alt="Titan Boot" class="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" data-alt="Heavy sole architectural combat boots" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYXQuqJqvQIO-snEIn-cnQkhMHrKfEvzlBSnXA2ErY3X3bHLAI4Y5_Dk_fbOt_TvksrbMZq47OjaujFfJUjxrKjJ9yMMn08G-XWnansC8kdWUdf_8CVt-oyIWqCYUB8l-PmqACS2xYC2nrXnym2aDXMMt5d5B2ChvqE6LZTHjXbZR5Gs64fh3OhMzpfdddOlFhiJ46A1lnp4Lc_CokZUw61rhWbDIGb1KiESKbS_kQw_PydCbTZXMS7zT_emFM-PyANaXQZMqlD6BU"/>
</div>
<div class="mt-4 flex flex-col">
<h3 class="font-headline text-xl mb-1">Titan Boot</h3>
<p class="font-label text-xs text-on-surface-variant tracking-wider">$580.00</p>
</div>
</div>
</div>
</section>
<!-- Newsletter / Footer Section -->
<section class="border-t border-outline-variant/30 mt-32 px-6 lg:px-24 py-32 bg-surface-container-lowest">
<div class="grid grid-cols-1 lg:grid-cols-2 gap-24">
<div>
<h4 class="font-headline text-4xl mb-8 italic">Stay Informed.</h4>
<div class="flex border-b border-primary max-w-md">
<input class="bg-transparent border-none w-full py-4 px-0 focus:ring-0 font-label text-[10px] tracking-widest placeholder:text-outline" placeholder="YOUR EMAIL ADDRESS" type="email"/>
<button class="font-label text-[10px] tracking-widest hover:text-secondary transition-colors">SUBMIT</button>
</div>
</div>
<div class="flex flex-col justify-between">
<div class="grid grid-cols-2 gap-12">
<div class="flex flex-col gap-4">
<span class="font-label text-[10px] tracking-widest text-on-surface-variant">SERVICES</span>
<a class="text-sm hover:underline" href="#">SHIPPING</a>
<a class="text-sm hover:underline" href="#">RETURNS</a>
<a class="text-sm hover:underline" href="#">WARRANTY</a>
</div>
<div class="flex flex-col gap-4">
<span class="font-label text-[10px] tracking-widest text-on-surface-variant">SOCIAL</span>
<a class="text-sm hover:underline" href="#">INSTAGRAM</a>
<a class="text-sm hover:underline" href="#">LINKEDIN</a>
<a class="text-sm hover:underline" href="#">BEHANCE</a>
</div>
</div>
</div>
</div>
</section>
<!-- Footer -->
<footer class="px-6 lg:px-24 py-12 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-8">
<p class="font-label text-[10px] tracking-widest text-on-surface-variant text-center md:text-left">
                © 2024 Minimalista Elegante. Architectural Footwear Procurement.
            </p>
<div class="flex gap-12">
<a class="font-label text-[10px] tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
<a class="font-label text-[10px] tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a class="font-label text-[10px] tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">Contact</a>
</div>
</footer>
</main>
</body></html>