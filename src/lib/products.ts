export type ProductSize = { size: string; stock: number };

export interface Product {
  slug: string;
  name: string;
  price: string;
  ref: string;
  image: string;
  alt: string;
  gallery?: string[];
  features: Array<{ title: string; description: string }>;
  availability?: string;
  sizes?: ProductSize[];
}

export const PRODUCTS: Product[] = [
  {
    slug: "oxford-ejecutivo",
    name: "Oxford Ejecutivo",
    price: "$450000",
    ref: "8829-X",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCvoMWxTQOO38R3hZ1xQmLYV-R3BVuAZx-MajXhFgeIHBD9XlyE1KzxJ47xWUnVLZHBaOqYlEMX_sARXjGlGkneTUVnDhFykhsdaHzkGPN56XiXXFNOUaejlLrVhVpuE3QOZGUf-tMVws1sDC8U7QK4drQ2cg68i1uhh_D31gEPAcK7EuRt0UTXAZGdf-7FN12BSABbjXkKdoUFUF9S40A1y9sSd4xIkDEpM_rvhxiToExkSC_oJ3mtBXzM699Qv4p9JbigsJsy9Msq",
    alt: "Oxford ejecutivo negro cuero pulido",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjbTNJ13LoAJ4EHp02QzxzEpVN1EZnp9sii5hllxcWo-yQTqazjyK5N8_vE1B3QWQG--we1ZjRgnfKrzA48ISmWvkDfGUgncoop7cDOYU_dj84sScta0vhTMzjOLXxRP0I2tSf620hC1KT0MxGKmfr1pNRd5yGRZuC4YN2IMBGyErHcF8ywRUcXtueNpruEpADGolx7vqBIitgTY1Ki_KWbYjZwOpDWN0fVpk1TrXW1UaPM9PgVyzTI8pxwUY4zlZiYO-ZHjkQc9k5",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgsvvbdL5J8GRim6lR75n0avIJSjJo6PM8l2Ad7PX2NwiKNqtzn6ORVqrxco7X37tB_W_duqytugpP7eR2ZYiU1INAVIqRDECk-o6mOy9bD0qdBd85WK4VsX0xVDSsHTugRilSvxtnleQH1jSA78c97qJ6vzDwXd1A-KLaNKqc0Wp7Wvp9gjz1p9j9fpgnnlVdhQ4ulI8SijZfrQLcziB2dzY7lgaAYkNUgniq4Fsfo3QyvWKNckOXjAPik7zujcPo5kfcIu0V1_aS",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBrqphobSugbO3Jd6TKyD_47IKVBPqcAyNW8uP48CsSmhC3YG_IGZOyUa_1QplQDk3qF5sPQ5apinBchWANT1vx_ypDBG4idhOQFcrcenVPgAkFIS6gQ1mLmGxdqDkpNAVE-dI4k76iouGdiwIN1ZrnZtfb3gfOdmNCv-ebtmRWYK9ReKPoawPzs6jQGFVtp4KyR08ZmTYAGzS-j8YsAZPrhbajUq2D4eosnIEFCSh8jbrNrT-CxxVg02Zs0bq5eQ8uy-0GnhX_ES76",
    ],
    features: [
      {
        title: "CUMPLIMIENTO ISO",
        description: "Estructura certificada para entornos industriales exigentes.",
      },
      {
        title: "ANTIDESLIZANTE",
        description: "Suela de alta fricción diseñada para superficies pulidas.",
      },
      {
        title: "MATERIAL",
        description: "Cuero de becerro full-grain mate con costuras termo-selladas.",
      },
    ],
    availability: "Edición limitada",
  },
  {
    slug: "derby-estructural",
    name: "Derby Estructural",
    price: "$425000",
    ref: "8830-D",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARtMdPL5EpTpwuf8VuogK2wWseFbJYArVI4qxhvLrkQBwf5bVccI6Sw8w-01vmu5Veq8bQZB8knC37t_FPSni5duSHHVP-DVwk7EQUrLKcHw4oRktZ0hSM2nuY_EWnhg6DZCmgLQ88PjO7W2QfjhThWhV3SuWk43MKwh02vMYwWGEBD-__UobBt-zL1L4Mz3TechBvvMs1fHO6-0uFqSR04HjOBcNEG2a8JKcm1297SACZgUQrAXGSNeGaxbqqMRz0XvrE7VKkvIvJ",
    alt: "Derby marrón oscuro mate",
    features: [
      {
        title: "CUMPLIMIENTO ISO",
        description: "Estructura certificada para uso prolongado en oficina.",
      },
      {
        title: "ANTIDESLIZANTE",
        description: "Compuesto de suela optimizado para pisos brillantes.",
      },
      {
        title: "MATERIAL",
        description: "Cuero de becerro full-grain mate con costuras termo-selladas.",
      },
    ],
    availability: "En stock",
  },
  {
    slug: "mocasin-monolito",
    name: "Mocasín Monolito",
    price: "$490000",
    ref: "8831-M",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBqjKGDNbfzkwxmJ252luYxWL9w8UCY6pVSweYGZkGKNLECTf_6VVi2Fj7PGDbPlwmsxvnRIgyZcHqKwdl6DGgL6n1gZhKu0pHbaAkLIOPPqrw_IPGBUREalNIyhIxVJPrLB5fWofiOXXG6tt61RKv84BihtQUALAFT82iVqLWa3sOkw7QSK88_D4ONI4OcCx5s9q6QYndFKY4_qL-ZalLn_J6N82rqJANyMGw_uek2WVm2JVVvkuLviWSs-JZiO_9hu3DyvjH3CtDW",
    alt: "Mocasín negro cuero moderno",
    features: [
      {
        title: "CUMPLIMIENTO ISO",
        description: "Refuerzo estructural pensado para jornadas extensas.",
      },
      {
        title: "ANTIDESLIZANTE",
        description: "Patrón de suela que maximiza el agarre al caminar.",
      },
      {
        title: "MATERIAL",
        description: "Cuero de becerro full-grain mate con costuras termo-selladas.",
      },
    ],
    availability: "Edición limitada",
  },
  {
    slug: "chelsea-corporativo",
    name: "Chelsea Corporativo",
    price: "$550000",
    ref: "8832-C",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAytM5Zku9Z4gwCVwO1sI5-ZLyeusgbUQp1TrS0FYRg2tx3a75sV2oJbEmA7AGUEob8uqmi4mU_L3Z9wuj5ZFtVqJaggvMrpza6Ts1MqpJfzAlJo5seVv5786xM94Lj1EgB6KRZpNN8hmBg--8T-bBr8vYqTGgre2tqC_R7PFN_s5YrUiHxgbiIGkAd9GnOILEqjLjSqW-M77XvTiFjsaa9VzVFQuov_M5S4zXy_opZlbupoRSPuEiSQF3pjEUhIa280U550_7LOh7T",
    alt: "Chelsea negro cuero minimalista",
    features: [
      {
        title: "CUMPLIMIENTO ISO",
        description: "Diseño estructural estable para uso diario ejecutivo.",
      },
      {
        title: "ANTIDESLIZANTE",
        description: "Suela con alto agarre para superficies lisas.",
      },
      {
        title: "MATERIAL",
        description: "Cuero de becerro full-grain mate con costuras termo-selladas.",
      },
    ],
    availability: "En stock",
  },
  {
    slug: "monkstrap-simetria",
    name: "Monkstrap Simetría",
    price: "$510000",
    ref: "8833-MS",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBcQrPq091R6xTU8PAU7YH9CCTvAqBPSJCgUPjpsJ5nEz5x6N1I3bLw5zJq7T_qXdG7Exrlc9gwBA1oaEnI5AYjeejVy3-94BOOtK8d32QldEJNrSBvsg2DN6x974-3C3lOmMPdqbImQtJyUVinfRWqQ8-o9uZBvQDy9kW8f6kaAmQjmaQE8NDH4efqKr5D5Ma3DxL2mlZEqHeaVTwJFKAVhe6nTDnHI_nmhWeZxnQ1xAnbolS2oGisCGiGlU2IqqoVK5woKlHXB8Zy",
    alt: "Monkstrap doble hebilla negro",
    features: [
      {
        title: "CUMPLIMIENTO ISO",
        description: "Doble hebilla con soporte estructural certificado.",
      },
      {
        title: "ANTIDESLIZANTE",
        description: "Compuesto de suela optimizado para tránsitos urbanos.",
      },
      {
        title: "MATERIAL",
        description: "Cuero de becerro full-grain mate con costuras termo-selladas.",
      },
    ],
    availability: "Edición limitada",
  },
  {
    slug: "derby-lineal",
    name: "Derby Lineal",
    price: "$395000",
    ref: "8834-DL",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAz7zAMc5CL8DQVskStR7pZTHyqJmYOtK8jUjANrEDa3ZHOPNlrhgjcGX1xwhlWH7eIt_LX_SJTWp0__GAteAGLeHB-VtKLwJ5aaWHGOJZDSj03k7lt6qxZ3NGYiSsSRIXSRfkBUP04PrWRpGKqnufJnh5N6QAv3eDWcbl2q9EkDdKLlKeRyMFavfSf_6a2p1afLkDkJCUX0SbqHBzCzEQJL1gdl6orMLPRAX56CLF7d1GzMNhwGMugyQFKYoFaBzSvqvsuIV9laOkg",
    alt: "Derby beige cuero refinado",
    features: [
      {
        title: "CUMPLIMIENTO ISO",
        description: "Construcción lineal que mantiene la estabilidad del pie.",
      },
      {
        title: "ANTIDESLIZANTE",
        description: "Diseño de suela que incrementa la tracción.",
      },
      {
        title: "MATERIAL",
        description: "Cuero de becerro full-grain mate con costuras termo-selladas.",
      },
    ],
    availability: "En stock",
  },
  {
    slug: "mocasin-obsidiana",
    name: "Mocasín Obsidiana",
    price: "$620000",
    ref: "8835-O",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDAA5LPFYA1Mky0Tpx3klNzuxc_AaKw9hrSuMlRphG3fK8-elSyv9mvRP6QoFmxzPuVdmHjkycPjnS--syPNzclEpHl6MI6Ft3j7D8DGZcQ25iGKhkU05_iwg7CVNBg9Q3vpvYZcW47kizFaT5NIpusFOE0Ypt7-iiXj0Ze_bnfBLG_jedUjx942JukwIYpThE3oRaPNID26W2Lq_pxE2uhYnpvzfPdNjyOqXULZxHLzf1tjUMvz_B6ayIR92ESReDqF3KupDL3FyBM",
    alt: "Mocasín negro terciopelo",
    features: [
      {
        title: "CUMPLIMIENTO ISO",
        description: "Estructura reforzada para máxima estabilidad.",
      },
      {
        title: "ANTIDESLIZANTE",
        description: "Suela con compuesto de alto agarre para superficies pulidas.",
      },
      {
        title: "MATERIAL",
        description: "Cuero de becerro full-grain mate con costuras termo-selladas.",
      },
    ],
    availability: "Edición limitada",
  },
  {
    slug: "bota-titan",
    name: "Bota Titán",
    price: "$580000",
    ref: "8836-B",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAYXQuqJqvQIO-snEIn-cnQkhMHrKfEvzlBSnXA2ErY3X3bHLAI4Y5_Dk_fbOt_TvksrbMZq47OjaujFfJUjxrKjJ9yMMn08G-XWnansC8kdWUdf_8CVt-oyIWqCYUB8l-PmqACS2xYC2nrXnym2aDXMMt5d5B2ChvqE6LZTHjXbZR5Gs64fh3OhMzpfdddOlFhiJ46A1lnp4Lc_CokZUw61rhWbDIGb1KiESKbS_kQw_PydCbTZXMS7zT_emFM-PyANaXQZMqlD6BU",
    alt: "Bota militar arquitectónica",
    features: [
      {
        title: "CUMPLIMIENTO ISO",
        description: "Bota robusta con certificación para alto desempeño.",
      },
      {
        title: "ANTIDESLIZANTE",
        description: "Suela profunda que ofrece agarre superior.",
      },
      {
        title: "MATERIAL",
        description: "Cuero de becerro full-grain mate con costuras termo-selladas.",
      },
    ],
    availability: "En stock",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductByName(name: string): Product | undefined {
  const clean = name?.trim();
  if (!clean) return undefined;
  return (
    PRODUCTS.find((p) => p.name === clean) ??
    PRODUCTS.find((p) => p.name.toLowerCase() === clean.toLowerCase())
  );
}
