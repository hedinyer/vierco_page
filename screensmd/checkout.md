<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;family=Space+Grotesk:wght@300..700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
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
        body {
            font-family: 'Space Grotesk', sans-serif;
            -webkit-font-smoothing: antialiased;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        input:focus {
            outline: none !important;
            box-shadow: none !important;
            border-bottom-color: #000000 !important;
        }
    </style>
</head>
<body class="bg-background text-on-background selection:bg-secondary selection:text-on-secondary">
<!-- Top Navigation Bar -->
<nav class="sticky top-0 z-50 w-full bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/20">
<div class="max-w-[1440px] mx-auto px-8 h-20 flex items-center justify-between">
<div class="flex items-center gap-12">
<span class="font-headline text-2xl tracking-tight text-primary">Minimalista Elegante</span>
<div class="hidden md:flex gap-8">
<a class="font-label text-xs tracking-[0.2em] text-on-surface hover:text-secondary transition-colors" href="#">CORPORATE</a>
<a class="font-label text-xs tracking-[0.2em] text-on-surface hover:text-secondary transition-colors" href="#">COLLECTION</a>
</div>
</div>
<div class="flex items-center gap-6">
<span class="font-label text-xs tracking-widest text-on-surface">CART (0)</span>
<span class="material-symbols-outlined text-primary" data-icon="shopping_bag">shopping_bag</span>
</div>
</div>
</nav>
<!-- Main Content Area: Checkout Flow -->
<main class="min-h-screen">
<div class="max-w-[600px] mx-auto my-[160px] px-6">
<!-- Editorial Header -->
<header class="mb-24 text-center">
<h1 class="font-headline text-6xl italic font-extralight mb-4">Checkout</h1>
<p class="font-label text-xs tracking-[0.3em] uppercase text-on-surface-variant">Procurement Manifest v1.0</p>
</header>
<form class="space-y-20">
<!-- Section 1: Entity Details -->
<section>
<div class="flex items-baseline justify-between mb-12 border-b border-outline-variant/30 pb-4">
<h2 class="font-label text-sm tracking-widest font-bold">01 — COMPANY DETAILS</h2>
<span class="font-label text-[10px] text-muted uppercase">Required Fields</span>
</div>
<div class="space-y-12">
<div class="relative group">
<label class="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">CORPORATE ENTITY NAME</label>
<input class="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant py-3 px-0 font-body text-lg focus:border-primary transition-all placeholder:text-outline-variant/50" placeholder="e.g. Architectural Studio Ltd." type="text"/>
</div>
<div class="relative group">
<label class="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">VAT / TAX IDENTIFICATION</label>
<input class="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant py-3 px-0 font-body text-lg focus:border-primary transition-all placeholder:text-outline-variant/50" placeholder="EU 123 456 789" type="text"/>
</div>
<div class="relative group">
<label class="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">OFFICE OF DELIVERY</label>
<input class="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant py-3 px-0 font-body text-lg focus:border-primary transition-all placeholder:text-outline-variant/50" placeholder="Via Montenapoleone, 27, Milan" type="text"/>
</div>
</div>
</section>
<!-- Section 2: Payment Methodology -->
<section>
<div class="flex items-baseline justify-between mb-12 border-b border-outline-variant/30 pb-4">
<h2 class="font-label text-sm tracking-widest font-bold">02 — PROCUREMENT METHOD</h2>
<span class="font-label text-[10px] text-muted uppercase">Select Terms</span>
</div>
<!-- Payment Tabs -->
<div class="grid grid-cols-3 gap-px bg-outline-variant/20 border border-outline-variant/20">
<button class="bg-surface-container-lowest py-6 px-4 group flex flex-col items-center justify-center gap-2 hover:bg-surface-container transition-colors relative" type="button">
<span class="font-label text-[10px] tracking-[0.2em] text-primary">NET 30</span>
<div class="absolute bottom-0 left-0 w-full h-1 bg-primary"></div>
</button>
<button class="bg-surface py-6 px-4 group flex flex-col items-center justify-center gap-2 hover:bg-surface-container transition-colors" type="button">
<span class="font-label text-[10px] tracking-[0.2em] text-on-surface-variant">CREDIT CARD</span>
</button>
<button class="bg-surface py-6 px-4 group flex flex-col items-center justify-center gap-2 hover:bg-surface-container transition-colors" type="button">
<span class="font-label text-[10px] tracking-[0.2em] text-on-surface-variant">BANK TRANSFER</span>
</button>
</div>
<div class="mt-8 bg-surface-container-low p-8">
<p class="font-body text-sm text-on-surface-variant leading-relaxed italic">
                            Invoice will be generated upon confirmation. Payment is required within 30 days of the fulfillment date as per the Master Service Agreement.
                        </p>
</div>
</section>
<!-- Section 3: Summary & Action -->
<section class="pt-12">
<div class="flex flex-col gap-6 mb-16">
<div class="flex justify-between items-center">
<span class="font-label text-xs tracking-widest text-on-surface-variant uppercase">Subtotal</span>
<span class="font-body text-lg">€ 2,450.00</span>
</div>
<div class="flex justify-between items-center">
<span class="font-label text-xs tracking-widest text-on-surface-variant uppercase">Logistic Fees</span>
<span class="font-body text-lg">€ 0.00</span>
</div>
<div class="flex justify-between items-center pt-6 border-t border-outline-variant/20">
<span class="font-label text-sm tracking-widest font-bold uppercase">Total Order Value</span>
<span class="font-headline text-3xl font-bold">€ 2,450.00</span>
</div>
</div>
<button class="w-full h-[56px] bg-primary text-on-primary font-label text-xs tracking-[0.4em] uppercase hover:bg-secondary transition-all flex items-center justify-center gap-3" type="submit">
                        CONFIRM PROCUREMENT
                        <span class="material-symbols-outlined text-[16px]" data-icon="arrow_forward">arrow_forward</span>
</button>
<p class="mt-8 text-center font-label text-[10px] text-on-surface-variant tracking-widest">
                        SECURE ENCRYPTED TRANSACTION • ISO 27001 COMPLIANT
                    </p>
</section>
</form>
</div>
</main>
<!-- Footer -->
<footer class="bg-surface-container-low border-t border-outline-variant/20 py-24 px-8">
<div class="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
<div class="max-w-xs">
<span class="font-headline text-xl mb-6 block">Minimalista Elegante</span>
<p class="font-label text-[10px] tracking-widest leading-loose text-on-surface-variant">© 2024 Minimalista Elegante. Architectural Footwear Procurement.</p>
</div>
<div class="flex gap-16">
<div class="flex flex-col gap-4">
<span class="font-label text-[10px] tracking-widest font-bold mb-2">LEGAL</span>
<a class="font-label text-[10px] tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
<a class="font-label text-[10px] tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
</div>
<div class="flex flex-col gap-4">
<span class="font-label text-[10px] tracking-widest font-bold mb-2">CONNECT</span>
<a class="font-label text-[10px] tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">Contact</a>
<a class="font-label text-[10px] tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">Instagram</a>
</div>
</div>
</div>
</footer>
<!-- Side Navigation Bar (Hidden on this Linear Flow per Exclusion Protocol) -->
<!-- But keeping structural integrity for reference if needed elsewhere -->
<div class="fixed right-0 top-0 h-full w-0 overflow-hidden bg-surface-container-lowest z-[60] border-l border-outline-variant/30 transition-all duration-500" id="quick-cart-drawer">
<div class="w-[400px] p-12 h-full flex flex-col">
<div class="flex justify-between items-center mb-12">
<div>
<h3 class="font-headline text-2xl italic">Quick Cart</h3>
<p class="font-label text-[10px] tracking-widest text-on-surface-variant">Your Selection</p>
</div>
<button class="material-symbols-outlined" data-icon="close">close</button>
</div>
<div class="flex-grow flex items-center justify-center text-outline-variant italic font-body">
                Drawer concept for Destination Screens
            </div>
<button class="w-full h-[56px] border border-primary font-label text-xs tracking-[0.3em]">Checkout</button>
</div>
</div>
</body></html>