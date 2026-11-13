// قاعدة بيانات منتجات وأقسام Healthy - فرع العريش (شمال سيناء)
const STORE_CONFIG = {
  name: "Healthy",
  branch: "فرع العريش - شمال سيناء",
  whatsappNumber: "201000000000", // رقم واتساب الفرع لاستقبال الطلبات
  deliveryFee: 15,
  freeDeliveryThreshold: 200,
  workingHours: "يومياً من 8:00 صباحاً حتى 12:00 منتصف الليل",
  address: "شارع 23 يوليو، بجوار ميدان الساعة - العريش، شمال سيناء"
};

const PRODUCT_ILLUSTRATIONS = {
  milk: `
    <svg viewBox="0 0 90 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="33" y="6" width="24" height="8" rx="3" fill="#093BA8"/>
      <path d="M35 14H55L62 28V86C62 90.4 58.4 94 54 94H36C31.6 94 28 90.4 28 86V28L35 14Z" fill="#FFFFFF" stroke="#D7E2F8" stroke-width="2"/>
      <rect x="29" y="42" width="32" height="36" rx="4" fill="#0D4EDB"/>
      <path d="M45 48C45 48 39 55 39 59C39 62.3 41.7 65 45 65C48.3 65 51 62.3 51 59C51 55 45 48 45 48Z" fill="#FFFFFF"/>
      <text x="45" y="73" text-anchor="middle" fill="#FFFFFF" font-size="7" font-weight="800">Healthy</text>
      <text x="45" y="88" text-anchor="middle" fill="#0D4EDB" font-size="7" font-weight="800">1 L</text>
    </svg>
  `,
  drink: `
    <svg viewBox="0 0 90 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="35" y="8" width="20" height="7" rx="2.5" fill="#0D4EDB"/>
      <path d="M37 15H53L58 30V86C58 90 54.9 93 51 93H39C35.1 93 32 90 32 86V30L37 15Z" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
      <rect x="33" y="40" width="24" height="44" rx="3" fill="#FFFFFF"/>
      <circle cx="45" cy="56" r="8" fill="#0D4EDB"/>
      <path d="M45 45L48 48H42L45 45Z" fill="#8CD843"/>
      <rect x="36" y="71" width="18" height="8" rx="2" fill="#0D4EDB"/>
      <text x="45" y="77" text-anchor="middle" fill="#FFFFFF" font-size="5.5" font-weight="800">Healthy</text>
    </svg>
  `,
  yogurt: `
    <svg viewBox="0 0 90 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="18" width="50" height="8" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      <path d="M24 26H66L61 86C60.6 90 57.3 93 53.3 93H36.7C32.7 93 29.4 90 29 86L24 26Z" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      <path d="M26 36H64L61 76H29L26 36Z" fill="#0D4EDB"/>
      <path d="M45 55C45 55 40 61 40 64.5C40 67.3 42.2 69.5 45 69.5C47.8 69.5 50 67.3 50 64.5C50 61 45 55 45 55Z" fill="#FFFFFF"/>
      <text x="45" y="49" text-anchor="middle" fill="#FFFFFF" font-size="7" font-weight="800">Healthy</text>
      <text x="45" y="86" text-anchor="middle" fill="#0D4EDB" font-size="7" font-weight="800">200 g</text>
    </svg>
  `,
  cheese: `
    <svg viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 42L62 20L84 36V72L38 82L16 68V42Z" fill="#F4C44E"/>
      <path d="M16 42L62 20L84 36L38 52L16 42Z" fill="#FCE08B"/>
      <path d="M38 52L84 36V72L38 82V52Z" fill="#E5AF32"/>
      <circle cx="52" cy="56" r="4.5" fill="#C9911B"/>
      <circle cx="68" cy="49" r="3.5" fill="#C9911B"/>
      <circle cx="66" cy="64" r="5" fill="#C9911B"/>
      <circle cx="27" cy="56" r="3.5" fill="#D49B22"/>
    </svg>
  `
};

const CATEGORIES = [
  {
    id: "milk",
    name: "الألبان",
    theme: "theme-blue",
    illustration: PRODUCT_ILLUSTRATIONS.milk,
    description: "حليب طازج مبستر وكامل وخالي الدسم يومياً من مزارعنا"
  },
  {
    id: "drinks",
    name: "المشروبات",
    theme: "theme-lime",
    illustration: PRODUCT_ILLUSTRATIONS.drink,
    description: "رايب طبيعي ومشروبات ألبان بالفواكه الطازجة"
  },
  {
    id: "yogurt",
    name: "الزبادي",
    theme: "theme-lime",
    illustration: PRODUCT_ILLUSTRATIONS.yogurt,
    description: "زبادي بلدي ويوناني عالي البروتين وقليل الدسم"
  },
  {
    id: "cheese",
    name: "الجبن",
    theme: "theme-blue",
    illustration: PRODUCT_ILLUSTRATIONS.cheese,
    description: "تشكيلة أجبان طبيعية، رومي، شيدر، قريش، وفيتا"
  }
];

const PRODUCTS = [
  {
    id: "p1",
    name: "حليب هيلثي طازج كامل الدسم",
    category: "milk",
    categoryName: "الألبان",
    weight: "1 لتر",
    price: 38,
    oldPrice: 44,
    isOffer: true,
    isPopular: true,
    illustration: PRODUCT_ILLUSTRATIONS.milk,
    description: "حليب بقري طبيعي 100% مبستر ومعبأ بعناية للحفاظ على القيمة الغذائية والطعم الغني."
  },
  {
    id: "p2",
    name: "حليب هيلثي خالي الدسم",
    category: "milk",
    categoryName: "الألبان",
    weight: "1 لتر",
    price: 36,
    oldPrice: null,
    isOffer: false,
    isPopular: false,
    illustration: PRODUCT_ILLUSTRATIONS.milk,
    description: "خيار مثالي للأنظمة الغذائية الصحية والرياضيين بدون دهون مع كامل الكالسيوم والبروتين."
  },
  {
    id: "p3",
    name: "زبادي طبيعي طازج",
    category: "yogurt",
    categoryName: "الزبادي",
    weight: "200 جرام",
    price: 12,
    oldPrice: 15,
    isOffer: true,
    isPopular: true,
    illustration: PRODUCT_ILLUSTRATIONS.yogurt,
    description: "زبادي كريمي بقوام متماسك وطعم طبيعي منعش محضر من أجود أنواع الحليب الطازج."
  },
  {
    id: "p4",
    name: "زبادي يوناني عالي البروتين",
    category: "yogurt",
    categoryName: "الزبادي",
    weight: "180 جرام",
    price: 26,
    oldPrice: null,
    isOffer: false,
    isPopular: true,
    illustration: PRODUCT_ILLUSTRATIONS.yogurt,
    description: "غني بالبروتين الطبيعي لدعم بناء العضلات والشبع لفترة أطول."
  },
  {
    id: "p5",
    name: "جبن شيدر طبيعي معتق",
    category: "cheese",
    categoryName: "الجبن",
    weight: "250 جرام",
    price: 68,
    oldPrice: 78,
    isOffer: true,
    isPopular: true,
    illustration: PRODUCT_ILLUSTRATIONS.cheese,
    description: "جبن شيدر طبيعي 100% خالٍ من الزيوت النباتية بقوام غني ونكهة مميزة."
  },
  {
    id: "p6",
    name: "جبن قريش فلاحي طازج",
    category: "cheese",
    categoryName: "الجبن",
    weight: "500 جرام",
    price: 45,
    oldPrice: null,
    isOffer: false,
    isPopular: false,
    illustration: PRODUCT_ILLUSTRATIONS.cheese,
    description: "جبن قريش طازج قليل الملح وغني بالبروتين، مثالي لوجبات الإفطار والعشاء."
  },
  {
    id: "p7",
    name: "لبن رايب طبيعي منعش",
    category: "drinks",
    categoryName: "المشروبات",
    weight: "450 مل",
    price: 18,
    oldPrice: 22,
    isOffer: true,
    isPopular: true,
    illustration: PRODUCT_ILLUSTRATIONS.drink,
    description: "مشروب لبن رايب طبيعي يساعد على الهضم ويمنحك انتعاشاً فورياً."
  },
  {
    id: "p8",
    name: "مشروب حليب بالتوت الأزرق",
    category: "drinks",
    categoryName: "المشروبات",
    weight: "330 مل",
    price: 22,
    oldPrice: null,
    isOffer: false,
    isPopular: true,
    illustration: PRODUCT_ILLUSTRATIONS.drink,
    description: "مزيج الحليب الطازج مع خلاصة التوت الطبيعي بدون مواد حافظة صناعية."
  }
];
