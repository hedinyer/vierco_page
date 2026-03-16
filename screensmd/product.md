<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;family=Space+Grotesk:wght@300..700&amp;display=swap" rel="stylesheet"/>
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
            borderRadius: {"DEFAULT": "0px", "lg": "0px", "xl": "0px", "full": "9999px"},
          },
        },
      }
    </script>
<style>
        body { font-family: 'Space Grotesk', sans-serif; }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #f3f3f3; }
        ::-webkit-scrollbar-thumb { background: #000; }
    </style>
</head>
<body class="bg-background text-on-surface">
<!-- TopNavBar Rendered -->
<nav class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 px-8 py-4 flex items-center justify-between">
<div class="flex items-center gap-12">
<span class="font-headline text-xl tracking-tight text-primary">Minimalista Elegante</span>
<div class="hidden md:flex gap-8">
<a class="font-label text-xs tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors" href="#">CORPORATE</a>
<a class="font-label text-xs tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors" href="#">COLLECTION</a>
</div>
</div>
<div class="flex items-center gap-6">
<span class="font-label text-xs tracking-widest text-primary">CART (0)</span>
<span class="material-symbols-outlined text-primary" data-icon="shopping_bag">shopping_bag</span>
</div>
</nav>
<!-- SideNavBar (Cart Overlay Hidden by Default Logic, but styled as a slide-out shell) -->
<aside class="fixed right-0 top-0 h-full w-[400px] bg-surface-container-lowest z-[60] border-l border-outline-variant/20 transform translate-x-full transition-transform duration-500 shadow-2xl">
<div class="p-8 flex flex-col h-full">
<div class="flex justify-between items-start mb-12">
<div>
<h2 class="font-headline text-3xl">Quick Cart</h2>
<p class="font-body text-xs text-on-surface-variant uppercase tracking-widest mt-1">Your Selection</p>
</div>
<button class="material-symbols-outlined">close</button>
</div>
<div class="flex-grow flex items-center justify-center text-on-surface-variant/40 italic">
                No items selected.
            </div>
<button class="w-full bg-primary text-on-primary py-6 font-label tracking-[0.3em] text-xs uppercase hover:bg-tertiary-container transition-all">
                Checkout
            </button>
</div>
</aside>
<main class="flex flex-col md:flex-row min-h-screen pt-20">
<!-- Left Side: Sticky Content -->
<section class="w-full md:w-1/2 relative px-8 md:px-16 lg:px-24">
<div class="sticky top-[120px] h-[calc(100vh-160px)] flex flex-col justify-between pb-12">
<div>
<span class="font-label text-[10px] tracking-[0.4em] text-secondary uppercase mb-6 block">Ref. No. 8829-X</span>
<h1 class="font-headline text-[48px] leading-[1.1] text-primary max-w-md mb-12">
                        Architectural Monolith Oxford
                    </h1>
<div class="space-y-8 max-w-xs">
<div class="border-l border-primary/20 pl-6">
<h3 class="font-label text-[13px] tracking-widest uppercase mb-2">ISO COMPLIANCE</h3>
<p class="font-body text-sm text-on-surface-variant leading-relaxed">Safety-rated structural integrity for industrial environments.</p>
</div>
<div class="border-l border-primary/20 pl-6">
<h3 class="font-label text-[13px] tracking-widest uppercase mb-2">SLIP-RESISTANCE</h3>
<p class="font-body text-sm text-on-surface-variant leading-relaxed">High-friction compound soles engineered for polished surfaces.</p>
</div>
<div class="border-l border-primary/20 pl-6">
<h3 class="font-label text-[13px] tracking-widest uppercase mb-2">MATERIAL</h3>
<p class="font-body text-sm text-on-surface-variant leading-relaxed">Full-grain matte calfskin with heat-sealed seams.</p>
</div>
</div>
</div>
<div class="mt-auto">
<button class="bg-primary text-on-primary w-full md:w-auto px-16 py-6 font-label text-xs tracking-[0.3em] uppercase transition-all hover:bg-secondary focus:outline-none">
                        Add to Procurement
                    </button>
<div class="mt-4 flex gap-8">
<span class="font-headline text-2xl text-primary">$1,240.00</span>
<span class="font-label text-[10px] self-center text-on-surface-variant uppercase tracking-tighter">Availability: Limited Batch</span>
</div>
</div>
</div>
</section>
<!-- Right Side: Scrollable Images -->
<section class="w-full md:w-1/2 bg-surface-container">
<div class="flex flex-col gap-[2px]">
<div class="w-full aspect-[4/5] bg-surface-container-highest overflow-hidden">
<img class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" data-alt="Close up architectural detail of black luxury leather footwear" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjbTNJ13LoAJ4EHp02QzxzEpVN1EZnp9sii5hllxcWo-yQTqazjyK5N8_vE1B3QWQG--we1ZjRgnfKrzA48ISmWvkDfGUgncoop7cDOYU_dj84sScta0vhTMzjOLXxRP0I2tSf620hC1KT0MxGKmfr1pNRd5yGRZuC4YN2IMBGyErHcF8ywRUcXtueNpruEpADGolx7vqBIitgTY1Ki_KWbYjZwOpDWN0fVpk1TrXW1UaPM9PgVyzTI8pxwUY4zlZiYO-ZHjkQc9k5"/>
</div>
<div class="w-full aspect-[4/5] bg-surface-container-highest overflow-hidden">
<img class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" data-alt="Side profile of sleek minimal black shoe on concrete" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgsvvbdL5J8GRim6lR75n0avIJSjJo6PM8l2Ad7PX2NwiKNqtzn6ORVqrxco7X37tB_W_duqytugpP7eR2ZYiU1INAVIqRDECk-o6mOy9bD0qdBd85WK4VsX0xVDSsHTugRilSvxtnleQH1jSA78c97qJ6vzDwXd1A-KLaNKqc0Wp7Wvp9gjz1p9j9fpgnnlVdhQ4ulI8SijZfrQLcziB2dzY7lgaAYkNUgniq4Fsfo3QyvWKNckOXjAPik7zujcPo5kfcIu0V1_aS"/>
</div>
<div class="w-full aspect-square bg-surface-container-highest overflow-hidden">
<img class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" data-alt="Bottom view of structural high-friction shoe sole" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrqphobSugbO3Jd6TKyD_47IKVBPqcAyNW8uP48CsSmhC3YG_IGZOyUa_1QplQDk3qF5sPQ5apinBchWANT1vx_ypDBG4idhOQFcrcenVPgAkFIS6gQ1mLmGxdqDkpNAVE-dI4k76iouGdiwIN1ZrnZtfb3gfOdmNCv-ebtmRWYK9ReKPoawPzs6jQGFVtp4KyR08ZmTYAGzS-j8YsAZPrhbajUq2D4eosnIEFCSh8jbrNrT-CxxVg02Zs0bq5eQ8uy-0GnhX_ES76"/>
</div>
<div class="w-full aspect-[4/5] bg-surface-container-highest overflow-hidden">
<img class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" data-alt="Detail of heat-sealed seams on matte calfskin shoe" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXT7wVd2zX_bVbL6yEdpkNqYTGyKIquNBmnughg5-YmhCmECmS--nrpRPlbN0_bweGECzL0NhjYN3j0JkcMlsZwRRrcuac92_m88f8dcVBapwJdIEyRLYQhG0JDK7Opbb66svLUwYQ0R3L85B-zrH0iSPFQw8up_0HK2NuM05uvSk30ZEQatkJGYISA8UIwx75Tu10auajzpyF-EHJTKt_FPPtODuqfH3Z1ZBnyefuoyQ4kRE097GN5PSNK5cdrWESI8BZvOSCKdom"/>
</div>
<div class="w-full aspect-[4/5] bg-surface-container-highest overflow-hidden">
<img class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" data-alt="Artistic high contrast shadow of footwear in gallery" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCR0vYDsbVJOSrJ0kwYdiAZEAD1L7v9yLBSyuBBuyWC11AG-ROUQEZwXTN-BXIKf8ybHFLXeDZDrCK3eySM7NAtEs4AnCW2ikzDZg6F_47ZmcfawlmSCu6goBB7Trn_pejw2-mBkTAKUojNLHylPkycDN2Ep_ZBMUYKC7Z48khEb6XxZeN2_rAR_zT9OcER_Vl2KYP00De9XKt4xIeLh24ADi3DpauSCTfZO7_6NRQtPmPP3m3pe08_MSQuzpxVkDbsLvxPUzHf1vpI"/>
</div>
</div>
</section>
</main>
<!-- Footer Rendered -->
<footer class="bg-surface py-20 px-8 md:px-24 border-t border-outline-variant/10">
<div class="flex flex-col md:flex-row justify-between items-start gap-12">
<div class="max-w-md">
<h4 class="font-headline text-2xl mb-4">Minimalista Elegante</h4>
<p class="font-body text-sm text-on-surface-variant leading-relaxed">
                    © 2024 Minimalista Elegante. Architectural Footwear Procurement.
                </p>
</div>
<div class="flex flex-wrap gap-x-12 gap-y-4">
<a class="font-label text-xs tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
<a class="font-label text-xs tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a class="font-label text-xs tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors" href="#">Contact</a>
</div>
</div>
<div class="mt-20 flex justify-between items-end">
<div class="flex gap-4">
<div class="w-10 h-10 border border-outline-variant/30 flex items-center justify-center">
<span class="material-symbols-outlined text-sm">public</span>
</div>
<div class="w-10 h-10 border border-outline-variant/30 flex items-center justify-center">
<span class="material-symbols-outlined text-sm">share</span>
</div>
</div>
<span class="font-label text-[10px] tracking-[0.5em] text-outline-variant uppercase">Milan / New York / Tokyo</span>
</div>
</footer>
</body></html>