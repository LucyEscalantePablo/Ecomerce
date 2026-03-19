import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronRight, 
  ShoppingCart, 
  Heart, 
  Filter, 
  LayoutGrid, 
  List, 
  ChevronDown,
  Search,
  Truck,
  Zap,
  Check,
  ArrowLeft,
  Cpu,
  Monitor,
  HardDrive,
  Layers,
  MessageSquare,
  ShieldCheck,
  Clock
} from 'lucide-react';
import ProductDetail from './ProductDetail';

interface CatalogViewProps {
  category?: string;
  onProductClick?: (product: any) => void;
  wishlist?: number[];
  onToggleWishlist?: (id: number) => void;
  isLoggedIn?: boolean;
  isReseller?: boolean;
  resellerCategories?: string[];
  searchQuery?: string;
  onClearSearch?: () => void;
  onAddToCart?: (product: any) => void;
}

const categories: Record<string, { title: string, desc: string }> = {
  'COMPONENTES': {
    title: "Componentes de PC",
    desc: "Todo lo necesario para armar o repotenciar tu PC: Procesadores, GPUs, Placas Base y más."
  },
  'LAPTOPS Y COMPUTADORAS': {
    title: "Laptops y Computadoras",
    desc: "Explora nuestra amplia gama de laptops gaming, profesionales y para estudio."
  },
  'PERIFÉRICOS': {
    title: "Periféricos",
    desc: "Mejora tu interacción con teclados, mouse, headsets y más accesorios de alta calidad."
  },
  'MONITORES': {
    title: "Monitores",
    desc: "Visualiza cada detalle con monitores de alta resolución y tasas de refresco extremas."
  },
  'NETWORKING': {
    title: "Networking",
    desc: "Conectividad sin interrupciones con lo último en routers, switches y adaptadores."
  },
  'STREAMING': {
    title: "Streaming",
    desc: "Todo lo necesario para tus transmisiones en vivo: cámaras, luces y capturadoras."
  },
  'ACCESORIOS': {
    title: "Accesorios",
    desc: "Cables, adaptadores y protección eléctrica para mantener tu setup funcionando al 100%."
  },
  gpu: {
    title: "Tarjetas de Video",
    desc: "Impulsa tu rendimiento con las últimas arquitecturas de gráficos. Filtrado inteligente para tu setup ideal."
  },
  cpu: {
    title: "Procesadores",
    desc: "El cerebro de tu PC. Encuentra el equilibrio perfecto entre núcleos y velocidad para tus tareas."
  },
  motherboard: {
    title: "Placas Base",
    desc: "La base de todo gran sistema. Conectividad avanzada y estabilidad para tus componentes."
  },
  ram: {
    title: "Memoria RAM",
    desc: "Velocidad y multitarea sin límites. Kits DDR4 y DDR5 de alto rendimiento."
  },
  storage: {
    title: "Almacenamiento",
    desc: "Espacio de sobra para tus juegos y archivos. SSDs NVMe ultra rápidos."
  },
  psu: {
    title: "Fuentes de Poder",
    desc: "Energía estable y eficiente para proteger tu inversión. Certificación 80 Plus."
  },
  case: {
    title: "Gabinetes",
    desc: "Estilo y flujo de aire superior. El hogar perfecto para tus componentes de gama alta."
  },
  'laptop': {
    title: "Laptops y Computadoras",
    desc: "Explora nuestra amplia gama de laptops gaming, profesionales y para estudio."
  },
  'peripherals': {
    title: "Periféricos",
    desc: "Mejora tu interacción con teclados, mouse, headsets y más accesorios de alta calidad."
  },
  'monitor': {
    title: "Monitores",
    desc: "Visualiza cada detalle con monitores de alta resolución y tasas de refresco extremas."
  },
  'networking': {
    title: "Networking",
    desc: "Conectividad sin interrupciones con lo último en routers, switches y adaptadores."
  },
  'streaming': {
    title: "Streaming",
    desc: "Todo lo necesario para tus transmisiones en vivo: cámaras, luces y capturadoras."
  },
  'accessories': {
    title: "Accesorios",
    desc: "Cables, adaptadores y protección eléctrica para mantener tu setup funcionando al 100%."
  },
  'laptop-gaming': {
    title: "Laptops Gaming",
    desc: "Potencia portátil para tus juegos favoritos. Pantallas de alta frecuencia y GPUs dedicadas."
  },
  'laptop-pro': {
    title: "Laptops Profesionales",
    desc: "Rendimiento excepcional para diseño, edición de video y programación avanzada."
  },
  'laptop-student': {
    title: "Laptops Estudiantiles",
    desc: "Equipos ligeros y eficientes para el estudio diario y tareas académicas."
  },
  'pc-prebuilt': {
    title: "PCs Pre-armadas",
    desc: "Sistemas listos para usar, optimizados por expertos para gaming y trabajo."
  },
  'offers': {
    title: "Ofertas Top",
    desc: "Los mejores descuentos en componentes, laptops y periféricos. ¡Aprovecha antes que se agoten!"
  },
  'pc-aio': {
    title: "All-in-One PCs",
    desc: "Elegancia y ahorro de espacio. Todo lo que necesitas en un solo monitor."
  },
  'keyboard': {
    title: "Teclados",
    desc: "Precisión en cada pulsación. Teclados mecánicos y de membrana para todo uso."
  },
  'mouse': {
    title: "Mouse",
    desc: "Control total y ergonomía. Sensores de alta precisión para gaming y oficina."
  },
  'headset': {
    title: "Headsets / Audífonos",
    desc: "Inmersión sonora total. Audio espacial y micrófonos con cancelación de ruido."
  },
  'webcam': {
    title: "Webcams",
    desc: "Imagen nítida para tus reuniones y streams. Resoluciones Full HD y 4K."
  },
  'mic': {
    title: "Micrófonos",
    desc: "Captura de voz profesional. Micrófonos USB y XLR para podcasting y streaming."
  },
  'mousepad': {
    title: "Alfombrillas",
    desc: "Superficies optimizadas para un deslizamiento perfecto y control máximo."
  },
  'chair': {
    title: "Sillas y Escritorios",
    desc: "Ergonomía superior para largas sesiones de juego o trabajo."
  },
  'monitor-use': {
    title: "Monitores por Uso",
    desc: "Encuentra la pantalla ideal según tu actividad principal: Gaming, Diseño o Oficina."
  },
  'monitor-res': {
    title: "Monitores por Resolución",
    desc: "Desde Full HD hasta 4K y Ultrawide para una claridad visual sin precedentes."
  },
  'monitor-hz': {
    title: "Monitores por Refresh Rate",
    desc: "Fluidez máxima con altas tasas de refresco: 144Hz, 240Hz y más."
  },
  'monitor-panel': {
    title: "Monitores por Panel",
    desc: "Tecnología de visualización adaptada a tus necesidades: IPS, VA, OLED."
  },
  'router': {
    title: "Routers",
    desc: "Conectividad estable y veloz. Tecnología Wi-Fi 6 y sistemas Mesh."
  },
  'switch': {
    title: "Switches y Cables",
    desc: "Expande tu red local con switches de alta velocidad y cables certificados."
  },
  'nic': {
    title: "Tarjetas de Red",
    desc: "Mejora tu conexión con adaptadores Wi-Fi y Ethernet de alto rendimiento."
  },
  'hub': {
    title: "Adaptadores y Hubs",
    desc: "Más puertos para tus dispositivos. Hubs USB-C y adaptadores multifunción."
  },
  'lighting': {
    title: "Iluminación",
    desc: "Ambienta tu setup con luces LED, paneles RGB y ring lights profesionales."
  },
  'greenscreen': {
    title: "Green Screens",
    desc: "Fondos croma para efectos visuales impecables en tus transmisiones."
  },
  'capture': {
    title: "Capturadoras",
    desc: "Graba y transmite tus partidas con la mejor calidad de video."
  },
  'streamdeck': {
    title: "Stream Decks",
    desc: "Control total de tu stream con un solo toque. Atajos personalizables."
  },
  'camera': {
    title: "Cámaras DSLR",
    desc: "Calidad cinematográfica para tu contenido visual y streaming."
  },
  'cable-video': {
    title: "Cables de Video",
    desc: "Cables HDMI y DisplayPort de alta velocidad para resoluciones 4K y 8K."
  },
  'cable-usb': {
    title: "Cables USB",
    desc: "Carga y transferencia de datos rápida para todos tus dispositivos."
  },
  'adapter': {
    title: "Adaptadores",
    desc: "Soluciones de conectividad para cualquier tipo de puerto y dispositivo."
  },
  'ups': {
    title: "Regletas y UPS",
    desc: "Protección contra sobretensiones y respaldo de energía para tu equipo."
  },
  'cooling': {
    title: "Refrigeración",
    desc: "Mantén tus componentes frescos con soluciones de aire y líquida AIO."
  }
};

export const categoryData: Record<string, any[]> = {
  'COMPONENTES': [
    { id: 101, name: 'Intel Core i9-14900K', specs: '24 Núcleos / 32 Hilos • 6.0GHz', tags: ['LGA 1700', '125W TDP'], price: 2499.00, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=400&h=400&sig=cpu1', badge: 'RECOMENDADO', brand: 'Intel', socket: 'LGA 1700', cores: '24', tdp: 'Medio (100-150W)', stock: 'EN STOCK', subCat: 'Procesadores (CPUs)' },
    { id: 401, brand: "ASUS ROG Strix", name: "GeForce RTX 4090 OC Edition 24GB GDDR6X", price: 8499, oldPrice: 9200, image: "https://images.unsplash.com/photo-1591489378430-ef2f4c626b35?auto=format&fit=crop&q=80&w=400&h=400&sig=gpu1", badge: "NUEVO", stock: "EN STOCK", tags: ["RTX 40 Series", "24GB VRAM"], vram: '24GB', series: 'RTX 40 Series', tdp: 'Alto (>300W)', subCat: 'Tarjetas de Video (GPUs)' },
  ],
  'LAPTOPS Y COMPUTADORAS': [
    { id: 803, brand: "Apple", name: "MacBook Pro 14 • M3 Max • 36GB RAM", price: 12499.00, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800&h=600", badge: "PREMIUM", stock: "EN STOCK", tags: ["M3 Max", "36GB RAM"], subCat: 'Laptops Gaming' },
  ],
  'PERIFÉRICOS': [
    { id: 901, brand: "Logitech", name: "G Pro X Superlight 2", price: 650.00, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400&h=400&sig=ms1", stock: "EN STOCK", tags: ["Wireless", "Pro"], subCat: 'Mouse' },
  ],
  'MONITORES': [
    { id: 1001, brand: "Samsung", name: "Odyssey G7 • 27\" QHD 240Hz", price: 2499.00, image: "https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&q=80&w=400&h=400&sig=mu1", stock: "EN STOCK", tags: ["240Hz", "QHD"], subCat: 'Monitores Gamer' },
  ],
  'NETWORKING': [
    { id: 1101, brand: "TP-Link", name: "Archer AX55 • Wi-Fi 6", price: 450.00, image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400&h=400&sig=r1", stock: "EN STOCK", tags: ["Wi-Fi 6"], subCat: 'Routers WiFi' },
  ],
  'STREAMING': [
    { id: 1231, brand: "Elgato Stream Deck MK.2", name: "Stream Deck MK.2", price: 799.00, image: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&q=80&w=400&h=400&sig=sd1", stock: "EN STOCK", tags: ["LCD", "Elgato"], subCat: 'Stream Decks' },
  ],
  'ACCESORIOS': [
    { id: 1301, brand: "Ugreen", name: "Cable HDMI 2.1 8K", price: 85.00, image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=400&h=400&sig=cv1", stock: "EN STOCK", tags: ["8K", "HDMI 2.1"], subCat: 'Cables de Video' },
  ],
  cpu: [
    { id: 101, name: 'Intel Core i9-14900K', specs: '24 Núcleos / 32 Hilos • 6.0GHz', tags: ['LGA 1700', '125W TDP'], price: 2499.00, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=400&h=400&sig=cpu1', badge: 'RECOMENDADO', brand: 'Intel', socket: 'LGA 1700', cores: '24', tdp: 'Medio (100-150W)', stock: 'EN STOCK' },
    { id: 102, name: 'AMD Ryzen 7 7800X3D', specs: '8 Núcleos / 16 Hilos • 3D Cache', tags: ['AM5', '120W TDP'], price: 1850.00, oldPrice: 2100, image: 'https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&q=80&w=400&h=400&sig=cpu2', brand: 'AMD', socket: 'AM5', cores: '8', tdp: 'Medio (100-150W)', stock: 'EN STOCK' },
    { id: 103, name: 'Intel Core i7-14700K', specs: '20 Núcleos / 28 Hilos • 5.6GHz', tags: ['LGA 1700', '125W TDP'], price: 1720.00, image: 'https://images.unsplash.com/photo-1603732551658-5fabbaff8470?auto=format&fit=crop&q=80&w=400&h=400&sig=cpu3', brand: 'Intel', socket: 'LGA 1700', cores: '20', tdp: 'Medio (100-150W)', stock: 'EN STOCK' },
    { id: 104, name: 'AMD Ryzen 5 7600', specs: '6 Núcleos / 12 Hilos • Zen 4', tags: ['AM5', '65W TDP'], price: 940.00, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400&h=400&sig=cpu4', brand: 'AMD', socket: 'AM5', cores: '6', tdp: 'Bajo (<100W)', stock: 'EN STOCK' },
    { id: 105, name: 'Intel Core i5-13600K', specs: '14 Núcleos / 20 Hilos • 5.1GHz', tags: ['LGA 1700', '125W TDP'], price: 1250.00, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400&h=400&sig=cpu5', brand: 'Intel', socket: 'LGA 1700', cores: '14', tdp: 'Medio (100-150W)', stock: 'EN STOCK' },
    { id: 106, name: 'AMD Ryzen 9 7950X', specs: '16 Núcleos / 32 Hilos • 5.7GHz', tags: ['AM5', '170W TDP'], price: 2100.00, image: 'https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&q=80&w=400&h=400&sig=cpu6', brand: 'AMD', socket: 'AM5', cores: '16', tdp: 'Alto (>150W)', stock: 'EN STOCK' },
    { id: 107, name: 'Intel Core i3-13100', specs: '4 Núcleos / 8 Hilos • 4.5GHz', tags: ['LGA 1700', '60W TDP'], price: 580.00, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=400&h=400&sig=cpu7', brand: 'Intel', socket: 'LGA 1700', cores: '6', tdp: 'Bajo (<100W)', stock: 'EN STOCK' },
  ],
  motherboard: [
    { id: 201, name: 'ROG STRIX Z790-E GAMING WIFI II', specs: 'ATX • DDR5 • PCIe 5.0 • 18+1 Fases', tags: ['WIFI 7', '5x M.2 Slots'], price: 1890.00, image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=400&h=400&sig=mb1', badge: 'RECOMENDADO', stock: 'EN STOCK', socket: 'LGA 1700', format: 'ATX' },
    { id: 202, name: 'MSI MPG Z790 EDGE WIFI', specs: 'ATX • DDR5 • White Design • 16+1+1 Fases', tags: ['WIFI 6E', 'PCIe 5.0'], price: 1450.00, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400&h=400&sig=mb2', stock: 'EN STOCK', socket: 'LGA 1700', format: 'ATX' },
    { id: 203, name: 'TUF GAMING B760-PLUS WIFI', specs: 'ATX • DDR5 • Durabilidad Militar', tags: ['WIFI 6', 'Aura Sync'], price: 890.00, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400&h=400&sig=mb3', stock: 'EN STOCK', socket: 'LGA 1700', format: 'ATX' },
    { id: 204, name: 'PRIME Z790-P WIFI-CSM', specs: 'ATX • DDR5 • Enfocada en Productividad', tags: ['WIFI 6', 'Thunderbolt 4'], price: 1120.00, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400&h=400&sig=mb4', stock: 'EN STOCK', socket: 'LGA 1700', format: 'ATX' },
    { id: 205, name: 'ASUS ROG Crosshair X670E Hero', specs: 'ATX • DDR5 • AM5 • PCIe 5.0', tags: ['WIFI 6E', 'USB4'], price: 2450.00, image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400&h=400&sig=mb5', badge: 'GAMA ALTA', stock: 'EN STOCK', socket: 'AM5', format: 'ATX' },
    { id: 206, name: 'Gigabyte B650 AORUS ELITE AX', specs: 'ATX • DDR5 • AM5 • 14+2+1 Fases', tags: ['WIFI 6E', '2.5GbE'], price: 980.00, image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=400&h=400&sig=mb6', stock: 'EN STOCK', socket: 'AM5', format: 'ATX' },
    { id: 207, name: 'MSI MAG B650M MORTAR WIFI', specs: 'Micro-ATX • DDR5 • AM5', tags: ['Compacta', 'Potente'], price: 750.00, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400&h=400&sig=mb7', stock: 'EN STOCK', socket: 'AM5', format: 'Micro-ATX' },
  ],
  ram: [
    { id: 301, name: 'Corsair Vengeance RGB 32GB (2x16GB)', specs: 'DDR5 6000MHz • CL30 • iCUE', tags: ['RGB', 'Intel XMP'], price: 580.00, image: 'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?auto=format&fit=crop&q=80&w=400&h=400&sig=ram1', badge: 'RECOMENDADO', type: 'DDR5', capacity: '32GB', speed: '6000MHz', stock: 'EN STOCK' },
    { id: 302, name: 'G.Skill Trident Z5 RGB 32GB', specs: 'DDR5 6400MHz • CL32 • High Performance', tags: ['RGB', 'AMD EXPO'], price: 620.00, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=400&h=400&sig=ram2', type: 'DDR5', capacity: '32GB', speed: '6400MHz', stock: 'EN STOCK' },
    { id: 303, name: 'Kingston FURY Beast 16GB (2x8GB)', specs: 'DDR4 3200MHz • CL16 • Low Profile', tags: ['DDR4', 'Económica'], price: 220.00, image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400&h=400&sig=ram3', type: 'DDR4', capacity: '16GB', speed: '3200MHz', stock: 'EN STOCK' },
    { id: 304, name: 'TeamGroup T-Force Delta RGB 32GB', specs: 'DDR5 6000MHz • CL38 • Blanca', tags: ['RGB', 'White'], price: 540.00, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=400&h=400&sig=ram4', type: 'DDR5', capacity: '32GB', speed: '6000MHz', stock: 'EN STOCK' },
    { id: 305, name: 'Crucial Pro 64GB (2x32GB)', specs: 'DDR5 5600MHz • CL46 • Profesional', tags: ['DDR5', '64GB'], price: 1150.00, image: 'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?auto=format&fit=crop&q=80&w=400&h=400&sig=ram5', type: 'DDR5', capacity: '64GB', speed: '5200MHz', stock: 'EN STOCK' },
    { id: 306, name: 'Corsair Vengeance LPX 16GB', specs: 'DDR4 3600MHz • CL18 • Perfil Bajo', tags: ['DDR4', 'LPX'], price: 280.00, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=400&h=400&sig=ram6', type: 'DDR4', capacity: '16GB', speed: '3600MHz', stock: 'EN STOCK' },
  ],
  gpu: [
    { id: 401, brand: "ASUS ROG Strix", name: "GeForce RTX 4090 OC Edition 24GB GDDR6X", price: 8499, oldPrice: 9200, image: "https://images.unsplash.com/photo-1591489378430-ef2f4c626b35?auto=format&fit=crop&q=80&w=400&h=400&sig=gpu1", badge: "NUEVO", stock: "EN STOCK", tags: ["RTX 40 Series", "24GB VRAM"], vram: '24GB', series: 'RTX 40 Series', tdp: 'Alto (>300W)' },
    { id: 402, brand: "MSI Gaming X Slim", name: "GeForce RTX 4080 Super 16GB GDDR6X", price: 5199, image: "https://images.unsplash.com/photo-1555680202-ca4889d82a62?auto=format&fit=crop&q=80&w=400&h=400&sig=gpu2", badge: "POPULAR", stock: "EN STOCK", tags: ["RTX 40 Series", "16GB VRAM"], vram: '16GB', series: 'RTX 40 Series', tdp: 'Alto (>300W)' },
    { id: 403, brand: "Gigabyte Windforce", name: "GeForce RTX 4070 Ti 12GB GDDR6X", price: 3850, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400&h=400&sig=gpu3", badge: "ÚLTIMAS UNIDADES", badgeColor: "bg-amber-500", stock: "EN STOCK", tags: ["RTX 40 Series", "12GB VRAM"], vram: '12GB', series: 'RTX 40 Series', tdp: 'Medio (200-300W)' },
    { id: 404, brand: "Sapphire Pulse", name: "Radeon RX 7900 XTX 24GB GDDR6", price: 4790, image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400&h=400&sig=gpu4", stock: "EN STOCK", tags: ["RX 7000 Series", "24GB VRAM"], vram: '24GB', series: 'RX 7000 Series', tdp: 'Alto (>300W)' },
    { id: 405, brand: "Zotac Gaming", name: "GeForce RTX 4060 Ti Twin Edge 8GB", price: 1950, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=400&h=400&sig=gpu5", stock: "AGOTADO", tags: ["RTX 40 Series", "8GB VRAM"], vram: '8GB', series: 'RTX 40 Series', tdp: 'Bajo (<200W)' },
    { id: 406, brand: "EVGA XC Black", name: "GeForce RTX 4060 8GB GDDR6", price: 1450, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400&h=400&sig=gpu6", stock: "EN STOCK", tags: ["RTX 40 Series", "8GB VRAM"], vram: '8GB', series: 'RTX 40 Series', tdp: 'Bajo (<200W)' },
    { id: 407, brand: "ASUS Dual", name: "GeForce RTX 4070 Super 12GB", price: 2999, image: "https://images.unsplash.com/photo-1591489378430-ef2f4c626b35?auto=format&fit=crop&q=80&w=400&h=400&sig=gpu7", stock: "EN STOCK", tags: ["RTX 40 Series", "12GB VRAM"], vram: '12GB', series: 'RTX 40 Series', tdp: 'Medio (200-300W)' },
    { id: 408, brand: "PowerColor Hellhound", name: "Radeon RX 7800 XT 16GB", price: 2450, image: "https://images.unsplash.com/photo-1555680202-ca4889d82a62?auto=format&fit=crop&q=80&w=400&h=400&sig=gpu8", stock: "EN STOCK", tags: ["RX 7000 Series", "16GB VRAM"], vram: '16GB', series: 'RX 7000 Series', tdp: 'Medio (200-300W)' }
  ],
  storage: [
    { id: 501, name: 'Samsung 990 Pro 2TB', specs: 'NVMe M.2 PCIe 4.0 • 7450MB/s', tags: ['Gen 4', 'Heatsink'], price: 780.00, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400&h=400&sig=st1', badge: 'RECOMENDADO', type: 'SSD', interface: 'NVMe', stock: 'EN STOCK', capacity: '2TB' },
    { id: 502, name: 'Crucial P3 Plus 1TB', specs: 'NVMe M.2 PCIe 4.0 • 5000MB/s', tags: ['Gen 4', 'Budget'], price: 320.00, image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400&h=400&sig=st2', type: 'SSD', interface: 'NVMe', stock: 'EN STOCK', capacity: '1TB' },
    { id: 503, name: 'WD Black SN850X 1TB', specs: 'NVMe M.2 PCIe 4.0 • 7300MB/s', tags: ['Gaming', 'Fast'], price: 450.00, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=400&h=400&sig=st3', type: 'SSD', interface: 'NVMe', stock: 'EN STOCK', capacity: '1TB' },
    { id: 504, name: 'Seagate BarraCuda 4TB', specs: 'SATA HDD • 5400 RPM • 256MB Cache', tags: ['HDD', 'Masivo'], price: 380.00, image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=400&h=400&sig=st4', type: 'HDD', interface: 'SATA', stock: 'EN STOCK', capacity: '4TB' },
    { id: 505, name: 'Kingston NV2 2TB', specs: 'NVMe M.2 PCIe 4.0 • 3500MB/s', tags: ['Gen 4', 'Económica'], price: 420.00, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400&h=400&sig=st5', type: 'SSD', interface: 'NVMe', stock: 'EN STOCK', capacity: '2TB' },
  ],
  psu: [
    { id: 601, name: 'Corsair RM850x 850W', specs: '80 Plus Gold • Full Modular • Silent', tags: ['Gold', 'Modular'], price: 590.00, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=400&h=400&sig=psu1', badge: 'RECOMENDADO', stock: 'EN STOCK', wattage: '850W', cert: '80 Plus Gold' },
    { id: 602, name: 'EVGA SuperNOVA 750 G6', specs: '80 Plus Gold • Compact Design', tags: ['Gold', 'Modular'], price: 480.00, image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=400&h=400&sig=psu2', stock: 'EN STOCK', wattage: '750W', cert: '80 Plus Gold' },
    { id: 603, name: 'Seasonic Focus GX-1000', specs: '80 Plus Gold • 1000W • Modular', tags: ['1000W', 'Premium'], price: 850.00, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400&h=400&sig=psu3', stock: 'EN STOCK', wattage: '1000W+', cert: '80 Plus Gold' },
    { id: 604, name: 'Cooler Master MWE 650 Bronze', specs: '80 Plus Bronze • 650W', tags: ['Bronze', 'Económica'], price: 280.00, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=400&h=400&sig=psu4', stock: 'EN STOCK', wattage: '650W', cert: '80 Plus Bronze' },
  ],
  case: [
    { id: 701, name: 'Lian Li PC-O11 Dynamic', specs: 'Mid Tower • Dual Chamber • Tempered Glass', tags: ['E-ATX', 'Watercooling'], price: 720.00, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=400&h=400&sig=cs1', badge: 'RECOMENDADO', stock: 'EN STOCK', format: 'Mid Tower', color: 'Negro' },
    { id: 702, name: 'NZXT H7 Flow', specs: 'Mid Tower • High Airflow • Minimalist', tags: ['ATX', 'Mesh'], price: 540.00, image: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=400&h=400&sig=cs2', stock: 'EN STOCK', format: 'Mid Tower', color: 'Blanco' },
    { id: 703, name: 'Corsair 4000D Airflow', specs: 'Mid Tower • Panel Frontal Mesh', tags: ['ATX', 'Popular'], price: 450.00, image: 'https://images.unsplash.com/photo-1555680202-ca4889d82a62?auto=format&fit=crop&q=80&w=400&h=400&sig=cs3', stock: 'EN STOCK', format: 'Mid Tower', color: 'Negro' },
    { id: 704, name: 'Fractal Design North', specs: 'Mid Tower • Madera Real • Elegante', tags: ['Diseño', 'Premium'], price: 820.00, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400&h=400&sig=cs4', badge: 'DISEÑO', stock: 'EN STOCK', format: 'Mid Tower', color: 'Blanco' },
  ],
  'cooling': [
    { id: 1401, brand: "Corsair", name: "iCUE H150i Elite Capellix XT 360mm", price: 950.00, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400&h=400&sig=cl1", badge: "RECOMENDADO", stock: "EN STOCK", tags: ["360mm", "RGB"], type: 'Líquida AIO', size: '360mm' },
    { id: 1402, brand: "Noctua", name: "NH-D15 Disipador de Aire Premium", price: 480.00, image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400&h=400&sig=cl2", stock: "EN STOCK", tags: ["Aire", "Silent"], type: 'Aire' },
    { id: 1403, brand: "DeepCool", name: "AK620 Disipador Doble Torre", price: 290.00, image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400&h=400&sig=cl3", stock: "EN STOCK", tags: ["Aire", "Rendimiento"], type: 'Aire' },
    { id: 1404, brand: "NZXT", name: "Kraken 240 Refrigeración Líquida", price: 750.00, image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400&h=400&sig=cl4", stock: "EN STOCK", tags: ["240mm", "LCD"], type: 'Líquida AIO', size: '240mm' },
  ],
  'laptop': [
    { 
      id: 803, 
      brand: "Apple", 
      name: "MacBook Pro 14 • M3 Max • 36GB RAM", 
      price: 12499.00, 
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800&h=600", 
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800&h=600",
        "https://picsum.photos/seed/mac1/800/600",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800&h=600",
        "https://picsum.photos/seed/mac2/800/600"
      ],
      badge: "PREMIUM", 
      stock: "EN STOCK", 
      tags: ["M3 Max", "36GB RAM", "Liquid Retina XDR"], 
      gpu: 'M3 Max' 
    },
    { id: 801, brand: "ASUS", name: "ROG Zephyrus G14 • Ryzen 9 • RTX 4060", price: 6499.00, image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800&h=600", images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800&h=600", "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800&h=600"], badge: "NUEVO", stock: "EN STOCK", tags: ["RTX 4060", "Ryzen 9"], gpu: 'RTX 4060' },
    { id: 802, brand: "MSI", name: "Katana 15 • Core i7 • RTX 4050", price: 4299.00, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800&h=600", images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800&h=600", "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800&h=600"], stock: "EN STOCK", tags: ["RTX 4050", "Core i7"], gpu: 'RTX 4050' },
  ],
  'peripherals': [
    { id: 901, brand: "Logitech", name: "G Pro X • Teclado Mecánico RGB", price: 549.00, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=400&h=400&sig=per1", badge: "POPULAR", stock: "EN STOCK", tags: ["Mecánico", "RGB"], type: 'Teclados' },
    { id: 902, brand: "Razer", name: "Huntsman V2 • Teclado Óptico", price: 899.00, image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=400&h=400&sig=per2", stock: "EN STOCK", tags: ["Óptico", "Razer"], type: 'Teclados' },
    { id: 903, brand: "Logitech", name: "G502 HERO • Mouse Gaming", price: 220.00, image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=400&h=400&sig=per3", stock: "EN STOCK", tags: ["Cableado", "Popular"], type: 'Mouse' },
    { id: 904, brand: "HyperX", name: "Cloud Alpha • Headset Gaming", price: 350.00, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=400&h=400&sig=per4", stock: "EN STOCK", tags: ["Cableado", "Audio"], type: 'Headsets' },
  ],
  'monitor': [
    { id: 1001, brand: "Samsung", name: "Odyssey G7 • 27\" QHD 240Hz", price: 2499.00, image: "https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&q=80&w=400&h=400&sig=mon1", badge: "RECOMENDADO", stock: "EN STOCK", tags: ["240Hz", "QHD"], res: '1440p', hz: '240Hz' },
    { id: 1002, brand: "LG", name: "UltraFine 4K • 27\" IPS HDR", price: 1899.00, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400&h=400&sig=mon2", stock: "EN STOCK", tags: ["4K", "IPS"], res: '4K', hz: '60Hz' },
    { id: 1003, brand: "ASUS", name: "TUF Gaming VG249Q • 24\" FHD 144Hz", price: 850.00, image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=400&h=400&sig=mon3", stock: "EN STOCK", tags: ["144Hz", "FHD"], res: '1080p', hz: '144Hz' },
    { id: 1004, brand: "MSI", name: "Optix MAG342CQR • Ultrawide 34\"", price: 1950.00, image: "https://images.unsplash.com/photo-1555680202-ca4889d82a62?auto=format&fit=crop&q=80&w=400&h=400&sig=mon4", stock: "EN STOCK", tags: ["Ultrawide", "144Hz"], res: 'Ultrawide', hz: '144Hz' },
  ],
  'networking': [
    { id: 1101, brand: "TP-Link", name: "Archer AX55 • Wi-Fi 6 AX3000", price: 450.00, image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400&h=400&sig=net1", badge: "TOP VENTAS", stock: "EN STOCK", tags: ["Wi-Fi 6", "Gigabit"], type: 'Routers' },
    { id: 1102, brand: "ASUS", name: "RT-AX88U Pro • Wi-Fi 6 AX6000", price: 1150.00, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=400&h=400&sig=net2", stock: "EN STOCK", tags: ["Wi-Fi 6", "Gaming"], type: 'Routers' },
    { id: 1103, brand: "TP-Link", name: "Deco X50 • Sistema Mesh Wi-Fi 6", price: 890.00, image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=400&h=400&sig=net3", stock: "EN STOCK", tags: ["Mesh", "Wi-Fi 6"], type: 'Routers' },
    { id: 1104, brand: "Ubiquiti", name: "UniFi Switch Lite 8 PoE", price: 580.00, image: "https://images.unsplash.com/photo-1631482942707-5938c8a60ddf?auto=format&fit=crop&q=80&w=400&h=400&sig=net4", stock: "EN STOCK", tags: ["PoE", "Managed"], type: 'Switches' },
  ],
  'streaming': [
    { id: 1201, brand: "Elgato", name: "Stream Deck MK.2 • 15 Teclas LCD", price: 799.00, image: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&q=80&w=400&h=400&sig=str1", badge: "NUEVO", stock: "EN STOCK", tags: ["LCD", "Elgato"], type: 'Stream Decks' },
    { id: 1202, brand: "Logitech", name: "Litra Glow • Luz LED Premium", price: 280.00, image: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&q=80&w=400&h=400&sig=str2", stock: "EN STOCK", tags: ["Iluminación", "Soft"], type: 'Iluminación' },
    { id: 1203, brand: "Elgato", name: "Facecam • 1080p60 Pro", price: 650.00, image: "https://images.unsplash.com/photo-1626197031507-c17099753214?auto=format&fit=crop&q=80&w=400&h=400&sig=str3", stock: "EN STOCK", tags: ["1080p60", "Pro"], type: 'Cámaras' },
    { id: 1204, brand: "Razer", name: "Seiren V2 Pro • Micrófono Dinámico", price: 540.00, image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=400&h=400&sig=str4", stock: "EN STOCK", tags: ["USB", "Audio"], type: 'Micrófonos' },
  ],
  'accessories': [
    { id: 1301, brand: "Ugreen", name: "Cable HDMI 2.1 8K @60Hz 2 Metros", price: 85.00, image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=400&h=400&sig=acc1", stock: "EN STOCK", tags: ["8K", "HDMI 2.1"], type: 'Cables' },
    { id: 1302, brand: "Forza", name: "UPS de 750VA / 375W con 6 Tomas", price: 280.00, image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400&h=400&sig=acc2", stock: "EN STOCK", tags: ["UPS", "Protección"], type: 'UPS' },
    { id: 1303, brand: "Baseus", name: "Hub USB-C 7 en 1 con 4K HDMI", price: 180.00, image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=400&h=400&sig=acc3", stock: "EN STOCK", tags: ["Hub", "USB-C"], type: 'Adaptadores' },
    { id: 1304, brand: "APC", name: "Regleta Protectora de 6 Tomas", price: 65.00, image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=400&h=400&sig=acc4", stock: "EN STOCK", tags: ["Regleta", "Protección"], type: 'Regletas' },
  ],
  'laptop-gaming': [
    { 
      id: 803, 
      brand: "Apple", 
      name: "MacBook Pro 14 • M3 Max • 36GB RAM", 
      price: 12499.00, 
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800&h=600", 
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800&h=600",
        "https://picsum.photos/seed/mac1/800/600",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800&h=600",
        "https://picsum.photos/seed/mac2/800/600"
      ],
      badge: "ULTRA PRO", 
      stock: "EN STOCK", 
      tags: ["M3 Max", "36GB RAM", "Liquid Retina XDR"], 
      gpu: 'M3 Max',
      screen: '14"'
    },
    { id: 801, brand: "ASUS ROG Zephyrus G14", name: "Laptop Gaming 14\" QHD 120Hz Ryzen 9 RTX 4060", price: 6499.00, oldPrice: 7200, image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800&h=600", images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800&h=600", "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800&h=600"], badge: "NUEVO", stock: "EN STOCK", tags: ["RTX 4060", "Ryzen 9"], gpu: 'RTX 4060', screen: '14"' },
    { id: 802, brand: "MSI Katana 15", name: "Laptop Gaming 15.6\" FHD 144Hz Core i7 RTX 4050", price: 4299.00, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800&h=600", images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800&h=600", "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800&h=600"], stock: "EN STOCK", tags: ["RTX 4050", "Core i7"], gpu: 'RTX 4050', screen: '15.6"' },
    { id: 804, brand: "Razer Blade 16", name: "Laptop Gaming 16\" Dual UHD/FHD+ RTX 4090", price: 15999.00, image: "https://images.unsplash.com/photo-1525547718571-03b05761adbe?auto=format&fit=crop&q=80&w=400&h=400&sig=lg3", badge: "ULTRA GAMA", stock: "EN STOCK", tags: ["RTX 4090", "Core i9"], gpu: 'RTX 4090', screen: '16"' },
    { id: 805, brand: "HP Victus 16", name: "Laptop Gaming 16\" FHD 144Hz Ryzen 7 RTX 4050", price: 3899.00, image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=400&h=400&sig=lg4", stock: "EN STOCK", tags: ["RTX 4050", "Ryzen 7"], gpu: 'RTX 4050', screen: '16"' },
    { id: 806, brand: "Lenovo Legion Slim 5", name: "Laptop Gaming 16\" WQXGA 165Hz Ryzen 7 RTX 4060", price: 5299.00, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400&h=400&sig=lg5", stock: "EN STOCK", tags: ["RTX 4060", "Ryzen 7"], gpu: 'RTX 4060', screen: '16"' },
    { id: 807, brand: "Acer Nitro V", name: "Laptop Gaming 15.6\" FHD 144Hz RTX 4050", price: 3450.00, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400&h=400&sig=lg6", stock: "EN STOCK", tags: ["RTX 4050", "Core i5"], gpu: 'RTX 4050', screen: '15.6"' },
  ],
  'laptop-pro': [
    { 
      id: 803, 
      brand: "Apple", 
      name: "MacBook Pro 14 • M3 Max • 36GB RAM", 
      price: 12499.00, 
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800&h=600", 
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800&h=600",
        "https://picsum.photos/seed/mac1/800/600",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800&h=600",
        "https://picsum.photos/seed/mac2/800/600"
      ],
      badge: "ULTRA PRO", 
      stock: "EN STOCK", 
      tags: ["M3 Max", "36GB RAM", "Liquid Retina XDR"], 
      gpu: 'M3 Max' 
    },
    { id: 811, brand: "Apple", name: "MacBook Pro 14\" • M3 Pro • 18GB RAM", price: 8999.00, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800&h=600", images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800&h=600", "https://images.unsplash.com/photo-1611186871348-b1ec696e5238?auto=format&fit=crop&q=80&w=800&h=600", "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800&h=600"], badge: "PREMIUM", stock: "EN STOCK", tags: ["M3 Pro", "Retina"], cpu: 'M3 Pro' },
    { id: 812, brand: "Dell", name: "XPS 15 • 15.6\" 4K OLED • Core i9", price: 9499.00, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800&h=600", images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800&h=600", "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800&h=600"], stock: "EN STOCK", tags: ["OLED", "Core i9"], cpu: 'Core i9' },
    { id: 813, brand: "Lenovo", name: "ThinkPad X1 Carbon • Core i7 • 32GB RAM", price: 7500.00, image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=400&h=400&sig=lp3", stock: "EN STOCK", tags: ["ThinkPad", "Core i7"], cpu: 'Core i7' },
    { id: 814, brand: "Microsoft", name: "Surface Laptop 5 • 15\" Core i7", price: 6200.00, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400&h=400&sig=lp4", stock: "EN STOCK", tags: ["Surface", "Touch"], cpu: 'Core i7' },
  ],
  'laptop-student': [
    { id: 821, brand: "HP", name: "Laptop 15 • 15.6\" Core i5-1235U", price: 1899.00, image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=400&h=400&sig=ls1", stock: "EN STOCK", tags: ["Core i5", "Estudio"], price_range: 'Económica (<2000)' },
    { id: 822, brand: "Lenovo", name: "IdeaPad 3 • 14\" Ryzen 5 5500U", price: 1549.00, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400&h=400&sig=ls2", stock: "EN STOCK", tags: ["Ryzen 5", "Económica"], price_range: 'Económica (<2000)' },
    { id: 823, brand: "Acer", name: "Aspire 5 • 15.6\" Core i3-1215U", price: 1299.00, image: "https://images.unsplash.com/photo-1525547718571-03b05761adbe?auto=format&fit=crop&q=80&w=400&h=400&sig=ls3", stock: "EN STOCK", tags: ["Core i3", "Estudio"], price_range: 'Económica (<2000)' },
    { id: 824, brand: "ASUS", name: "Vivobook 16 • 16\" Ryzen 7", price: 2450.00, image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=400&h=400&sig=ls4", stock: "EN STOCK", tags: ["Ryzen 7", "Grande"], price_range: 'Media (2000-3500)' },
    { id: 825, brand: "Lenovo", name: "IdeaPad Slim 3 • 15\" Core i5", price: 2150.00, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400&h=400&sig=ls5", stock: "EN STOCK", tags: ["Core i5", "Slim"], price_range: 'Media (2000-3500)' },
    { id: 826, brand: "HP", name: "Laptop 14 • 14\" Ryzen 3", price: 1350.00, image: "https://images.unsplash.com/photo-1589561093533-943024adccee?auto=format&fit=crop&q=80&w=400&h=400&sig=ls6", stock: "EN STOCK", tags: ["Ryzen 3", "Compacta"], price_range: 'Económica (<2000)' },
  ],
  'pc-prebuilt': [
    { id: 831, brand: "TechMarket", name: "PC Gaming Master: RTX 4070 + Ryzen 7", price: 6899.00, oldPrice: 7500, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400&h=400&sig=pcp1", badge: "OFERTA", stock: "EN STOCK", tags: ["RTX 4070", "Gaming"], type: 'Gaming' },
    { id: 832, brand: "TechMarket", name: "PC Workstation Pro: RTX 4080 + Core i9", price: 12500.00, image: "https://images.unsplash.com/photo-1525547718571-03b05761adbe?auto=format&fit=crop&q=80&w=400&h=400&sig=pcp2", badge: "PRO", stock: "EN STOCK", tags: ["RTX 4080", "i9"], type: 'Workstation' },
    { id: 833, brand: "TechMarket", name: "PC Office Elite: Core i5 + 16GB RAM", price: 2450.00, image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=400&h=400&sig=pcp3", stock: "EN STOCK", tags: ["Oficina", "Compacta"], type: 'Oficina' },
  ],
  'pc-aio': [
    { id: 841, brand: "HP", name: "Pavilion AIO • 24\" Core i5", price: 3299.00, image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=400&h=400&sig=aio1", stock: "EN STOCK", tags: ["AIO", "Oficina"] },
    { id: 842, brand: "Apple", name: "iMac 24\" • Chip M3 • 8GB RAM", price: 5499.00, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400&h=400&sig=aio2", stock: "EN STOCK", tags: ["M3", "Retina"] },
    { id: 843, brand: "Lenovo", name: "IdeaCentre AIO 3 • 27\" Ryzen 7", price: 3850.00, image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=400&h=400&sig=aio3", stock: "EN STOCK", tags: ["27 Pulgadas", "Ryzen"] },
  ],
  'keyboard': [
    { id: 901, brand: "Logitech", name: "G Pro X • Teclado Mecánico RGB", price: 549.00, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=400&h=400&sig=kb1", badge: "POPULAR", stock: "EN STOCK", tags: ["Mecánico", "RGB"], type: 'Mecánico', format: 'TKL (80%)', switch: 'Blue' },
    { id: 902, brand: "Razer", name: "Huntsman V2 • Teclado Óptico", price: 899.00, image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=400&h=400&sig=kb2", stock: "EN STOCK", tags: ["Óptico", "Razer"], type: 'Óptico', format: 'Full Size', switch: 'Silent' },
    { id: 905, brand: "Keychron", name: "K2 V2 • Teclado Mecánico Wireless", price: 420.00, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=400&h=400&sig=kb3", stock: "EN STOCK", tags: ["Wireless", "Mac/Win"], type: 'Mecánico', format: '65%', switch: 'Brown' },
    { id: 906, brand: "Corsair", name: "K70 RGB PRO • Alto Rendimiento", price: 750.00, image: "https://images.unsplash.com/photo-1618384881928-22c4013166f3?auto=format&fit=crop&q=80&w=400&h=400&sig=kb4", stock: "EN STOCK", tags: ["Cherry MX", "RGB"], type: 'Mecánico', format: 'Full Size', switch: 'Red' },
  ],
  'mouse': [
    { id: 911, brand: "Logitech", name: "G502 X Plus • Inalámbrico RGB", price: 580.00, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400&h=400&sig=ms1", badge: "RECOMENDADO", stock: "EN STOCK", tags: ["Wireless", "RGB"], type: 'Inalámbrico' },
    { id: 912, brand: "Razer", name: "DeathAdder V3 Pro • Ultra Ligero", price: 520.00, image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=400&h=400&sig=ms2", stock: "EN STOCK", tags: ["Pro", "Ligero"], type: 'Inalámbrico' },
    { id: 913, brand: "SteelSeries", name: "Rival 3 • Ergonómico RGB", price: 150.00, image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=400&h=400&sig=ms3", stock: "EN STOCK", tags: ["Económico", "RGB"], type: 'Cableado' },
  ],
  'headset': [
    { id: 921, brand: "HyperX", name: "Cloud II • Sonido Surround 7.1", price: 380.00, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=400&h=400&sig=hs1", badge: "LEYENDA", stock: "EN STOCK", tags: ["7.1", "HyperX"], type: 'Cableado' },
    { id: 922, brand: "SteelSeries", name: "Arctis Nova Pro • Wireless Hi-Res", price: 1250.00, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400&h=400&sig=hs2", stock: "EN STOCK", tags: ["Wireless", "Hi-Res"], type: 'Inalámbrico' },
    { id: 923, brand: "Logitech", name: "G733 • Wireless RGB Ultra Ligero", price: 580.00, image: "https://images.unsplash.com/photo-1583339793403-3d9b001b6008?auto=format&fit=crop&q=80&w=400&h=400&sig=hs3", stock: "EN STOCK", tags: ["Wireless", "RGB"], type: 'Inalámbrico' },
  ],
  'webcam': [
    { id: 931, brand: "Logitech C920s", name: "Webcam Full HD 1080p con Tapa de Privacidad", price: 320.00, image: "https://images.unsplash.com/photo-1626197031507-c17099753214?auto=format&fit=crop&q=80&w=400&h=400&sig=wc1", stock: "EN STOCK", tags: ["1080p", "Logitech"], res: '1080p' },
    { id: 932, brand: "Razer Kiyo Pro", name: "Webcam Full HD 60FPS con Sensor de Luz", price: 450.00, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=400&h=400&sig=wc2", stock: "EN STOCK", tags: ["60FPS", "Razer"], res: '1080p' },
    { id: 933, brand: "Logitech Brio 4K", name: "Webcam Ultra HD 4K con HDR", price: 850.00, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400&h=400&sig=wc3", stock: "EN STOCK", tags: ["4K", "HDR"], res: '4K' },
  ],
  'mic': [
    { id: 941, brand: "Blue", name: "Yeti • Micrófono USB Profesional", price: 540.00, image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=400&h=400&sig=mc1", badge: "POPULAR", stock: "EN STOCK", tags: ["USB", "Streaming"], type: 'USB' },
    { id: 942, brand: "Shure", name: "SM7B • Micrófono Dinámico Vocal", price: 1850.00, image: "https://images.unsplash.com/photo-1583339793403-3d9b001b6008?auto=format&fit=crop&q=80&w=400&h=400&sig=mc2", stock: "EN STOCK", tags: ["XLR", "Pro"], type: 'XLR' },
    { id: 943, brand: "HyperX", name: "QuadCast S • Micrófono USB RGB", price: 620.00, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=400&h=400&sig=mc3", stock: "EN STOCK", tags: ["RGB", "USB"], type: 'USB' },
  ],
  'mousepad': [
    { id: 951, brand: "TechMarket", name: "Alfombrilla Gaming XXL 900x400mm", price: 85.00, image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=400&h=400&sig=mp1", stock: "EN STOCK", tags: ["XXL", "Control"], size: 'XXL' },
    { id: 952, brand: "SteelSeries", name: "QcK Heavy • Tela Gruesa", price: 65.00, image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=400&h=400&sig=mp2", stock: "EN STOCK", tags: ["Cloth", "Pro"], size: 'L' },
    { id: 953, brand: "Logitech", name: "G840 • Alfombrilla XL", price: 180.00, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400&h=400&sig=mp3", stock: "EN STOCK", tags: ["XL", "Logitech"], size: 'XL' },
  ],
  'chair': [
    { id: 961, brand: "Secretlab", name: "TITAN Evo • Ergonómica Premium", price: 2100.00, image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400&h=400&sig=ch1", badge: "PREMIUM", stock: "EN STOCK", tags: ["Ergonómica", "Pro"], type: 'Ergonómica' },
    { id: 962, brand: "Cougar", name: "Armor One • Ajustable Reclinable", price: 850.00, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400&h=400&sig=ch2", stock: "EN STOCK", tags: ["Gaming", "Ajustable"], type: 'Gaming' },
    { id: 963, brand: "Razer", name: "Iskur X • Soporte Lumbar", price: 1450.00, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=400&h=400&sig=ch3", stock: "EN STOCK", tags: ["Razer", "Gaming"], type: 'Gaming' },
  ],
  'monitor-use': [
    { id: 1001, brand: "Samsung", name: "Odyssey G7 • 27\" QHD 240Hz", price: 2499.00, oldPrice: 2800, image: "https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&q=80&w=400&h=400&sig=mu1", badge: "RECOMENDADO", stock: "EN STOCK", tags: ["240Hz", "QHD"], res: '1440p', hz: '240Hz', panel: 'VA' },
    { id: 1002, brand: "LG", name: "UltraFine 4K • 27\" IPS HDR", price: 1899.00, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400&h=400&sig=mu2", stock: "EN STOCK", tags: ["4K", "IPS"], res: '4K', hz: '60Hz', panel: 'IPS' },
    { id: 1005, brand: "Dell", name: "UltraSharp U2723QE • 4K USB-C Hub", price: 2100.00, image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=400&h=400&sig=mu3", stock: "EN STOCK", tags: ["Productividad", "4K"], res: '4K', hz: '60Hz', panel: 'IPS' },
    { id: 1006, brand: "ASUS", name: "ProArt PA329C • 32\" 4K HDR", price: 3850.00, image: "https://images.unsplash.com/photo-1555680202-ca4889d82a62?auto=format&fit=crop&q=80&w=400&h=400&sig=mu4", stock: "EN STOCK", tags: ["Diseño", "4K"], res: '4K', hz: '60Hz', panel: 'IPS' },
  ],
  'monitor-res': [
    { id: 1011, brand: "Gigabyte", name: "M28U • 28\" 4K 144Hz IPS", price: 2150.00, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400&h=400&sig=mr1", stock: "EN STOCK", tags: ["4K", "144Hz"], res: '4K' },
    { id: 1012, brand: "ASUS", name: "TUF VG27AQ • 27\" QHD 165Hz", price: 1250.00, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400&h=400&sig=mr2", stock: "EN STOCK", tags: ["1440p", "165Hz"], res: '1440p' },
    { id: 1013, brand: "BenQ", name: "ZOWIE XL2411K • FHD 144Hz", price: 890.00, image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=400&h=400&sig=mr3", stock: "EN STOCK", tags: ["1080p", "144Hz"], res: '1080p' },
    { id: 1014, brand: "LG", name: "UltraWide 34WP65G • 34\" IPS", price: 1450.00, image: "https://images.unsplash.com/photo-1555680202-ca4889d82a62?auto=format&fit=crop&q=80&w=400&h=400&sig=mr4", stock: "EN STOCK", tags: ["Ultrawide", "IPS"], res: 'Ultrawide' },
  ],
  'monitor-hz': [
    { id: 1021, brand: "ASUS", name: "ROG Swift • 24.5\" 360Hz FHD", price: 2850.00, image: "https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&q=80&w=400&h=400&sig=mh1", badge: "ESPORTS", stock: "EN STOCK", tags: ["360Hz", "FHD"], hz: '360Hz' },
    { id: 1022, brand: "ZOWIE", name: "XL2546K • 24.5\" 240Hz DyAc+", price: 1950.00, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400&h=400&sig=mh2", stock: "EN STOCK", tags: ["240Hz", "Esports"], hz: '240Hz' },
    { id: 1023, brand: "AOC", name: "24G2 • 24\" 144Hz IPS", price: 720.00, image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=400&h=400&sig=mh3", stock: "EN STOCK", tags: ["144Hz", "IPS"], hz: '144Hz' },
  ],
  'monitor-panel': [
    { id: 1031, brand: "Alienware", name: "AW3423DW • 34\" QD-OLED", price: 4899.00, image: "https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&q=80&w=400&h=400&sig=mpn1", badge: "OLED", stock: "EN STOCK", tags: ["OLED", "Ultrawide"], panel: 'OLED' },
    { id: 1032, brand: "ASUS", name: "ProArt PA278QV • 27\" IPS", price: 1350.00, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400&h=400&sig=mpn2", stock: "EN STOCK", tags: ["IPS", "Diseño"], panel: 'IPS' },
    { id: 1033, brand: "Samsung", name: "Odyssey G5 • 32\" QHD VA", price: 1150.00, image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=400&h=400&sig=mpn3", stock: "EN STOCK", tags: ["VA", "Curvo"], panel: 'VA' },
  ],
  'router': [
    { id: 1101, brand: "TP-Link", name: "Archer AX55 • Wi-Fi 6 AX3000", price: 450.00, image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400&h=400&sig=r1", badge: "TOP VENTAS", stock: "EN STOCK", tags: ["Wi-Fi 6", "Gigabit"], wifi: 'Wi-Fi 6' },
    { id: 1102, brand: "ASUS", name: "ROG Rapture GT-AX11000", price: 1850.00, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=400&h=400&sig=r2", badge: "GAMING", stock: "EN STOCK", tags: ["Wi-Fi 6", "Tri-Band"], wifi: 'Wi-Fi 6' },
    { id: 1103, brand: "Netgear", name: "Nighthawk RAXE500 • Wi-Fi 6E", price: 2100.00, image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=400&h=400&sig=r3", stock: "EN STOCK", tags: ["Wi-Fi 6E", "Ultra"], wifi: 'Wi-Fi 6E' },
  ],
  'switch': [
    { id: 1111, brand: "TP-Link", name: "TL-SG108 • 8 Puertos Gigabit", price: 120.00, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=400&h=400&sig=sw1", stock: "EN STOCK", tags: ["Gigabit", "8 Puertos"], ports: '8' },
    { id: 1112, brand: "D-Link", name: "DGS-1016D • 16 Puertos Gigabit", price: 350.00, image: "https://images.unsplash.com/photo-1631482942707-5938c8a60ddf?auto=format&fit=crop&q=80&w=400&h=400&sig=sw2", stock: "EN STOCK", tags: ["16 Puertos", "Rack"], ports: '16' },
  ],
  'nic': [
    { id: 1121, brand: "ASUS PCE-AX58BT", name: "Tarjeta de Red Wi-Fi 6 + Bluetooth 5.0", price: 280.00, image: "https://images.unsplash.com/photo-1631482942707-5938c8a60ddf?auto=format&fit=crop&q=80&w=400&h=400&sig=nic1", stock: "EN STOCK", tags: ["Wi-Fi 6", "PCIe"], type: 'PCIe' },
    { id: 1122, brand: "TP-Link Archer T3U Plus", name: "Adaptador Wi-Fi USB de Alta Ganancia", price: 95.00, image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=400&h=400&sig=nic2", stock: "EN STOCK", tags: ["USB", "Wi-Fi 5"], type: 'USB' },
  ],
  'hub': [
    { id: 1131, brand: "Satechi", name: "Hub USB-C Multi-puerto 4K HDMI Ethernet", price: 350.00, image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=400&h=400&sig=hub1", stock: "EN STOCK", tags: ["USB-C", "4K"], type: 'USB-C' },
    { id: 1132, brand: "Anker USB 3.0 Hub", name: "Hub USB 3.0 de 4 Puertos Ultra Delgado", price: 85.00, image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400&h=400&sig=hub2", stock: "EN STOCK", tags: ["USB 3.0", "Slim"], type: 'USB 3.0' },
  ],
  'lighting': [
    { id: 1201, brand: "Elgato Key Light Air", name: "Panel LED Profesional Controlado por App", price: 650.00, image: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&q=80&w=400&h=400&sig=lit1", stock: "EN STOCK", tags: ["LED", "Pro"], type: 'Panel RGB' },
    { id: 1202, brand: "Govee Glide Hexa", name: "Paneles de Pared RGB Inteligentes", price: 750.00, image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=400&h=400&sig=lit2", stock: "EN STOCK", tags: ["RGB", "Decoración"], type: 'Panel RGB' },
  ],
  'greenscreen': [
    { id: 1211, brand: "Elgato Green Screen", name: "Fondo Croma Plegable Instantáneo", price: 720.00, image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400&h=400&sig=gs1", stock: "EN STOCK", tags: ["Croma", "Elgato"], type: 'Plegable' },
  ],
  'capture': [
    { id: 1221, brand: "Elgato HD60 X", name: "Capturadora de Video 4K60 HDR10", price: 890.00, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400&h=400&sig=cap1", stock: "EN STOCK", tags: ["4K60", "HDR"], res: '4K60' },
    { id: 1222, brand: "AVerMedia Live Gamer Mini", name: "Capturadora Full HD Compacta", price: 450.00, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400&h=400&sig=cap2", stock: "EN STOCK", tags: ["1080p60", "USB"], res: '1080p60' },
  ],
  'streamdeck': [
    { id: 1231, brand: "Elgato Stream Deck MK.2", name: "Controlador de Atajos con 15 Teclas LCD", price: 799.00, image: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&q=80&w=400&h=400&sig=sd1", badge: "NUEVO", stock: "EN STOCK", tags: ["LCD", "Elgato"], keys: '15' },
    { id: 1232, brand: "Elgato Stream Deck XL", name: "Controlador Pro con 32 Teclas LCD", price: 1150.00, image: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?auto=format&fit=crop&q=80&w=400&h=400&sig=sd2", stock: "EN STOCK", tags: ["32 Teclas", "Pro"], keys: '32' },
  ],
  'camera': [
    { id: 1241, brand: "Sony ZV-E10", name: "Cámara Mirrorless para Vlogging y Streaming", price: 3499.00, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400&h=400&sig=cam1", stock: "EN STOCK", tags: ["Mirrorless", "4K"], type: 'Mirrorless' },
    { id: 1242, brand: "Canon EOS R10", name: "Cámara Mirrorless 4K Profesional", price: 4200.00, image: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&q=80&w=400&h=400&sig=cam2", stock: "EN STOCK", tags: ["4K", "Canon"], type: 'Mirrorless' },
  ],
  'cable-video': [
    { id: 1301, brand: "Ugreen", name: "Cable HDMI 2.1 8K @60Hz 2 Metros", price: 85.00, image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=400&h=400&sig=cv1", stock: "EN STOCK", tags: ["8K", "HDMI 2.1"], type: 'HDMI', length: '2m' },
    { id: 1302, brand: "Ugreen", name: "Cable DisplayPort 1.4 4K @144Hz", price: 75.00, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400&h=400&sig=cv2", stock: "EN STOCK", tags: ["DP 1.4", "4K"], type: 'DisplayPort', length: '2m' },
  ],
  'cable-usb': [
    { id: 1311, brand: "Baseus", name: "Cable USB-C a USB-C 100W Carga Rápida", price: 45.00, image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=400&h=400&sig=cu1", stock: "EN STOCK", tags: ["100W", "USB-C"], type: 'USB-C' },
    { id: 1312, brand: "Ugreen", name: "Cable USB-A a USB-C Trenzado 2m", price: 35.00, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400&h=400&sig=cu2", stock: "EN STOCK", tags: ["Trenzado", "2m"], type: 'USB-C' },
    { id: 1313, brand: "Apple", name: "Cable de Carga USB-C (2m)", price: 89.00, image: "https://images.unsplash.com/photo-1589561093533-943024adccee?auto=format&fit=crop&q=80&w=400&h=400&sig=cu3", stock: "EN STOCK", tags: ["Apple", "Original"], type: 'USB-C' },
  ],
  'adapter': [
    { id: 1321, brand: "Ugreen", name: "Adaptador DisplayPort a HDMI 4K", price: 55.00, image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=400&h=400&sig=ad1", stock: "EN STOCK", tags: ["4K", "Video"], type: 'Video' },
    { id: 1322, brand: "Baseus", name: "Adaptador USB-C a Jack 3.5mm", price: 25.00, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400&h=400&sig=ad2", stock: "EN STOCK", tags: ["Audio", "USB-C"], type: 'Audio' },
    { id: 1323, brand: "Ugreen", name: "Adaptador Ethernet Gigabit USB-C", price: 65.00, image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400&h=400&sig=ad3", stock: "EN STOCK", tags: ["Red", "Gigabit"], type: 'Datos' },
  ],
  'ups': [
    { id: 1331, brand: "Forza", name: "UPS 750VA • 6 Tomas", price: 280.00, image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400&h=400&sig=u1", stock: "EN STOCK", tags: ["UPS", "Protección"], power: '750VA' },
    { id: 1332, brand: "APC", name: "Back-UPS 1500VA Pro", price: 1250.00, image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400&h=400&sig=u2", stock: "EN STOCK", tags: ["1500VA", "Pro"], power: '1500VA' },
    { id: 1333, brand: "CyberPower", name: "UPS 1000VA LCD", price: 580.00, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400&h=400&sig=u3", stock: "EN STOCK", tags: ["LCD", "1000VA"], power: '1000VA' },
    { id: 1334, brand: "Forza", name: "Regleta Protectora 8 Tomas", price: 45.00, image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=400&h=400&sig=u4", stock: "EN STOCK", tags: ["Regleta", "Protección"], power: '500VA' },
  ],
};

const filterDefinitions: Record<string, any[]> = {
  cpu: [
    { id: 'brand', label: 'Marca', type: 'checkbox', options: ['Intel', 'AMD'] },
    { id: 'socket', label: 'Socket', type: 'checkbox', options: ['LGA 1700', 'AM5', 'AM4'] },
    { id: 'cores', label: 'Núcleos', type: 'checkbox', options: ['6', '8', '12', '16', '20', '24'] },
    { id: 'tdp', label: 'CONSUMO (TDP)', type: 'select', options: ['Cualquier consumo', 'Bajo (<100W)', 'Medio (100-150W)', 'Alto (>150W)'] },
  ],
  gpu: [
    { id: 'vram', label: 'VRAM (GB)', type: 'checkbox', options: ['8GB', '12GB', '16GB', '24GB'] },
    { id: 'series', label: 'SERIE', type: 'checkbox', options: ['RTX 40 Series', 'RTX 30 Series', 'RX 7000 Series'] },
    { id: 'tdp', label: 'CONSUMO (TDP)', type: 'select', options: ['Cualquier consumo', 'Bajo (<200W)', 'Medio (200-300W)', 'Alto (>300W)'] },
  ],
  ram: [
    { id: 'type', label: 'Tipo', type: 'checkbox', options: ['DDR4', 'DDR5'] },
    { id: 'capacity', label: 'Capacidad', type: 'checkbox', options: ['16GB', '32GB', '64GB'] },
    { id: 'speed', label: 'Velocidad', type: 'checkbox', options: ['3200MHz', '3600MHz', '5200MHz', '6000MHz', '6400MHz'] },
  ],
  motherboard: [
    { id: 'socket', label: 'Socket', type: 'checkbox', options: ['LGA 1700', 'AM5', 'AM4'] },
    { id: 'format', label: 'Formato', type: 'checkbox', options: ['ATX', 'Micro-ATX', 'Mini-ITX'] },
  ],
  storage: [
    { id: 'type', label: 'Tipo', type: 'checkbox', options: ['SSD', 'HDD'] },
    { id: 'capacity', label: 'Capacidad', type: 'checkbox', options: ['500GB', '1TB', '2TB', '4TB'] },
  ],
  psu: [
    { id: 'wattage', label: 'Potencia', type: 'checkbox', options: ['500W', '650W', '750W', '850W', '1000W+'] },
    { id: 'cert', label: 'Certificación', type: 'checkbox', options: ['80 Plus Bronze', '80 Plus Gold', '80 Plus Platinum'] },
  ],
  case: [
    { id: 'format', label: 'Formato', type: 'checkbox', options: ['Mid Tower', 'Full Tower', 'Mini Tower'] },
    { id: 'color', label: 'Color', type: 'checkbox', options: ['Negro', 'Blanco'] },
  ],
  'cooling': [
    { id: 'type', label: 'Tipo', type: 'checkbox', options: ['Líquida AIO', 'Aire'] },
    { id: 'size', label: 'Tamaño', type: 'checkbox', options: ['120mm', '240mm', '280mm', '360mm'] },
  ],
  'laptop': [
    { id: 'brand', label: 'Marca', type: 'checkbox', options: ['Apple', 'ASUS', 'MSI', 'HP', 'Lenovo', 'Razer'] },
    { id: 'gpu', label: 'Gráficos', type: 'checkbox', options: ['RTX 4050', 'RTX 4060', 'RTX 4070', 'RTX 4080', 'RTX 4090', 'M3 Max'] },
  ],
  'peripherals': [
    { id: 'type', label: 'Tipo', type: 'checkbox', options: ['Teclados', 'Mouse', 'Headsets', 'Webcams'] },
    { id: 'brand', label: 'Marca', type: 'checkbox', options: ['Logitech', 'Razer', 'Corsair', 'SteelSeries'] },
  ],
  'monitor': [
    { id: 'res', label: 'Resolución', type: 'checkbox', options: ['1080p', '1440p', '4K', 'Ultrawide'] },
    { id: 'hz', label: 'Refresh Rate', type: 'checkbox', options: ['60Hz', '144Hz', '165Hz', '240Hz', '360Hz'] },
  ],
  'networking': [
    { id: 'type', label: 'Tipo', type: 'checkbox', options: ['Routers', 'Switches', 'NICs', 'Hubs'] },
    { id: 'brand', label: 'Marca', type: 'checkbox', options: ['TP-Link', 'ASUS', 'D-Link', 'Ubiquiti'] },
  ],
  'streaming': [
    { id: 'type', label: 'Tipo', type: 'checkbox', options: ['Iluminación', 'Cámaras', 'Capturadoras', 'Stream Decks'] },
  ],
  'accessories': [
    { id: 'type', label: 'Tipo', type: 'checkbox', options: ['Cables', 'Adaptadores', 'UPS', 'Regletas'] },
  ],
  'laptop-gaming': [
    { id: 'brand', label: 'Marca', type: 'checkbox', options: ['Apple', 'ASUS', 'MSI', 'HP', 'Lenovo', 'Razer'] },
    { id: 'gpu', label: 'Gráficos', type: 'checkbox', options: ['RTX 4050', 'RTX 4060', 'RTX 4070', 'RTX 4080', 'RTX 4090', 'M3 Max'] },
    { id: 'screen', label: 'Pantalla', type: 'checkbox', options: ['14"', '15.6"', '16"', '17.3"'] },
  ],
  'laptop-pro': [
    { id: 'brand', label: 'Marca', type: 'checkbox', options: ['Apple', 'Dell', 'HP', 'Lenovo'] },
    { id: 'cpu', label: 'Procesador', type: 'checkbox', options: ['M3 Pro', 'M3 Max', 'Core i7', 'Core i9'] },
  ],
  'laptop-student': [
    { id: 'brand', label: 'Marca', type: 'checkbox', options: ['HP', 'Lenovo', 'ASUS', 'Acer'] },
    { id: 'price_range', label: 'Rango de Precio', type: 'select', options: ['Económica (<2000)', 'Media (2000-3500)'] },
  ],
  'pc-prebuilt': [
    { id: 'type', label: 'Uso', type: 'checkbox', options: ['Gaming', 'Oficina', 'Workstation'] },
  ],
  'pc-aio': [
    { id: 'brand', label: 'Marca', type: 'checkbox', options: ['HP', 'Lenovo', 'Apple'] },
  ],
  'keyboard': [
    { id: 'type', label: 'Tipo', type: 'checkbox', options: ['Mecánico', 'Membrana', 'Óptico'] },
    { id: 'format', label: 'Formato', type: 'checkbox', options: ['Full Size', 'TKL (80%)', '60%', '65%'] },
    { id: 'switch', label: 'Switch', type: 'checkbox', options: ['Blue', 'Red', 'Brown', 'Silent'] },
  ],
  'mouse': [
    { id: 'type', label: 'Conexión', type: 'checkbox', options: ['Inalámbrico', 'Cableado'] },
    { id: 'brand', label: 'Marca', type: 'checkbox', options: ['Logitech', 'Razer', 'SteelSeries', 'Corsair'] },
  ],
  'headset': [
    { id: 'type', label: 'Conexión', type: 'checkbox', options: ['Inalámbrico', 'Cableado', 'Bluetooth'] },
    { id: 'brand', label: 'Marca', type: 'checkbox', options: ['HyperX', 'Logitech', 'SteelSeries', 'Razer'] },
  ],
  'webcam': [
    { id: 'res', label: 'Resolución', type: 'checkbox', options: ['720p', '1080p', '4K'] },
  ],
  'mic': [
    { id: 'type', label: 'Tipo', type: 'checkbox', options: ['USB', 'XLR'] },
  ],
  'mousepad': [
    { id: 'size', label: 'Tamaño', type: 'checkbox', options: ['S', 'M', 'L', 'XL', 'XXL'] },
  ],
  'chair': [
    { id: 'type', label: 'Tipo', type: 'checkbox', options: ['Gaming', 'Ergonómica'] },
  ],
  'monitor-use': [
    { id: 'res', label: 'Resolución', type: 'checkbox', options: ['1080p', '1440p', '4K', 'Ultrawide'] },
    { id: 'hz', label: 'Refresh Rate', type: 'checkbox', options: ['60Hz', '144Hz', '165Hz', '240Hz', '360Hz'] },
    { id: 'panel', label: 'Panel', type: 'checkbox', options: ['IPS', 'VA', 'TN', 'OLED'] },
  ],
  'nic': [
    { id: 'type', label: 'Tipo', type: 'checkbox', options: ['PCIe', 'USB'] },
  ],
  'hub': [
    { id: 'type', label: 'Conexión', type: 'checkbox', options: ['USB-C', 'USB 3.0'] },
  ],
  'greenscreen': [
    { id: 'type', label: 'Tipo', type: 'checkbox', options: ['Plegable', 'Fijo'] },
  ],
  'capture': [
    { id: 'res', label: 'Resolución', type: 'checkbox', options: ['1080p60', '4K60'] },
  ],
  'streamdeck': [
    { id: 'keys', label: 'Teclas', type: 'checkbox', options: ['6', '15', '32'] },
  ],
  'camera': [
    { id: 'type', label: 'Tipo', type: 'checkbox', options: ['Mirrorless', 'DSLR'] },
  ],
  'cable-usb': [
    { id: 'type', label: 'Tipo', type: 'checkbox', options: ['USB-C', 'Micro USB', 'Lightning'] },
  ],
  'adapter': [
    { id: 'type', label: 'Tipo', type: 'checkbox', options: ['Video', 'Audio', 'Datos'] },
  ],
  'ups': [
    { id: 'power', label: 'Potencia', type: 'checkbox', options: ['500VA', '750VA', '1000VA', '1500VA'] },
  ],
  'monitor-res': [
    { id: 'res', label: 'Resolución', type: 'checkbox', options: ['1080p', '1440p', '4K', 'Ultrawide'] },
  ],
  'monitor-hz': [
    { id: 'hz', label: 'Refresh Rate', type: 'checkbox', options: ['144Hz', '165Hz', '240Hz', '360Hz'] },
  ],
  'monitor-panel': [
    { id: 'panel', label: 'Panel', type: 'checkbox', options: ['IPS', 'VA', 'TN', 'OLED'] },
  ],
  'router': [
    { id: 'brand', label: 'Marca', type: 'checkbox', options: ['TP-Link', 'ASUS', 'D-Link', 'Ubiquiti'] },
    { id: 'wifi', label: 'Wi-Fi', type: 'checkbox', options: ['Wi-Fi 5', 'Wi-Fi 6', 'Wi-Fi 6E', 'Wi-Fi 7'] },
  ],
  'switch': [
    { id: 'ports', label: 'Puertos', type: 'checkbox', options: ['5', '8', '16', '24', '48'] },
  ],
  'lighting': [
    { id: 'type', label: 'Tipo', type: 'checkbox', options: ['LED Strip', 'Ring Light', 'Panel RGB'] },
  ],
  'cable-video': [
    { id: 'type', label: 'Tipo', type: 'checkbox', options: ['HDMI', 'DisplayPort'] },
    { id: 'length', label: 'Longitud', type: 'checkbox', options: ['1m', '2m', '3m', '5m'] },
  ],
};

export default function CatalogView({ 
  category = "gpu", 
  onProductClick, 
  wishlist = [], 
  onToggleWishlist, 
  isLoggedIn,
  isReseller = false,
  resellerCategories = [],
  searchQuery = '',
  onClearSearch,
  onAddToCart
}: CatalogViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [notification, setNotification] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Reset filters when category or search changes
  React.useEffect(() => {
    setActiveFilters({});
    setPriceRange([0, 20000]);
    setCurrentPage(1);
  }, [category, searchQuery]);

  const info = categories[category || 'gpu'] || categories.gpu;
  const filters = filterDefinitions[category || 'gpu'] || filterDefinitions.gpu;
  
  const allProducts = React.useMemo(() => {
    let products: any[] = [];
    if (category === 'offers') {
      products = Object.values(categoryData).flat().filter(p => p.oldPrice);
    } else if (category) {
      products = categoryData[category] || [];
    } else {
      // Global search: flatten all categories and add category label
      products = Object.entries(categoryData).flatMap(([key, items]) => 
        items.map(item => ({ ...item, categoryKey: key, categoryLabel: categories[key]?.title || key }))
      );
    }

    // Filter products for resellers based on approved categories
    if (isReseller) {
      const categoryMap: Record<string, string> = {
        'cpu': 'Componentes PC',
        'gpu': 'Componentes PC',
        'motherboard': 'Componentes PC',
        'ram': 'Componentes PC',
        'storage': 'Componentes PC',
        'psu': 'Componentes PC',
        'case': 'Componentes PC',
        'cooling': 'Componentes PC',
        'networking': 'Networking y Servidores',
        'router': 'Networking y Servidores',
        'switch': 'Networking y Servidores',
        'nic': 'Networking y Servidores',
        'hub': 'Networking y Servidores',
        'laptop': 'Electrónica de Consumo',
        'laptop-gaming': 'Electrónica de Consumo',
        'laptop-pro': 'Electrónica de Consumo',
        'laptop-student': 'Electrónica de Consumo',
        'pc-prebuilt': 'Electrónica de Consumo',
        'pc-aio': 'Electrónica de Consumo',
        'monitor': 'Electrónica de Consumo',
        'peripherals': 'Electrónica de Consumo',
        'streaming': 'Electrónica de Consumo',
        'mobile': 'Dispositivos Móviles'
      };

      return products.filter(product => {
        // Find which category this product belongs to in the reseller's approved list
        let productCategoryKey = '';
        if (category && category !== 'offers') {
          productCategoryKey = category;
        } else {
          for (const [key, categoryProducts] of Object.entries(categoryData)) {
            if (categoryProducts.some(p => p.id === product.id)) {
              productCategoryKey = key;
              break;
            }
          }
        }

        const resellerCategoryLabel = categoryMap[productCategoryKey];
        return resellerCategories.includes(resellerCategoryLabel);
      });
    }

    return products;
  }, [category, isReseller, resellerCategories]);

  const filteredProducts = allProducts.filter(product => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(query);
      const matchesBrand = product.brand?.toLowerCase().includes(query);
      const matchesTags = product.tags?.some((tag: string) => tag.toLowerCase().includes(query));
      const matchesSku = product.id.toString().includes(query);
      const matchesCategory = product.categoryLabel?.toLowerCase().includes(query);
      
      // Check technical specs (any property that is a string)
      const matchesSpecs = Object.entries(product).some(([key, value]) => {
        if (['name', 'brand', 'tags', 'image', 'images', 'categoryKey', 'categoryLabel'].includes(key)) return false;
        return typeof value === 'string' && value.toLowerCase().includes(query);
      });

      if (!matchesName && !matchesBrand && !matchesTags && !matchesSpecs && !matchesSku && !matchesCategory) return false;
    }

    // Price filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    
    // Attribute filters
    return (Object.entries(activeFilters) as [string, string[]][]).every(([filterId, selectedOptions]) => {
      if (selectedOptions.length === 0) return true;
      
      const productValue = (product as any)[filterId];
      if (!productValue) return false;
      
      return selectedOptions.includes(productValue);
    });
  });

  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleFilter = (filterId: string, option: string, type: 'checkbox' | 'select' = 'checkbox') => {
    setActiveFilters(prev => {
      if (type === 'select') {
        const isAny = option.toLowerCase().includes('cualquier');
        return { ...prev, [filterId]: (option && !isAny) ? [option] : [] };
      }
      const current = prev[filterId] || [];
      const next = current.includes(option)
        ? current.filter(o => o !== option)
        : [...current, option];
      return { ...prev, [filterId]: next };
    });
    setCurrentPage(1); // Reset to first page when filtering
  };

  const toggleWishlist = (productId: number) => {
    if (!isLoggedIn) {
      onToggleWishlist?.(productId);
      return;
    }
    onToggleWishlist?.(productId);
    if (!wishlist.includes(productId)) {
      setNotification("Se agregó a tus productos favoritos");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="py-8 space-y-10 relative">
      {/* Toast Notification */}
      {notification && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-10 right-10 z-50 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold"
        >
          <Check className="w-5 h-5" />
          {notification}
        </motion.div>
      )}

      {/* Header Section */}
      <div className="space-y-2">
        {searchQuery ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Search className="w-6 h-6" />
              <span className="text-sm font-black uppercase tracking-[0.3em]">Resultados de búsqueda</span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter">
              Buscando: <span className="text-primary">"{searchQuery}"</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-3xl leading-relaxed">
              Hemos encontrado {filteredProducts.length} productos que coinciden con tu búsqueda en nuestro catálogo.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-5xl font-black text-white tracking-tighter">{info.title}</h1>
            <p className="text-slate-400 text-lg max-w-3xl leading-relaxed">
              {info.desc}
            </p>
          </>
        )}
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[300px_1fr] gap-10">
        {/* Sidebar Filters */}
        <aside className="space-y-6">
          <div className="bg-[#151921] rounded-3xl p-8 border border-white/5 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Filtros Avanzados</h3>
              <button 
                onClick={() => setActiveFilters({})}
                className="text-primary text-[10px] font-bold hover:underline"
              >
                Limpiar
              </button>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl space-y-2">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Búsqueda Avanzada</h4>
              <p className="text-[9px] text-slate-500 leading-relaxed font-medium">
                Puedes buscar por nombre, marca, SKU, especificaciones técnicas o categoría directamente en la barra superior.
              </p>
            </div>

            {filters.map((filter) => (
              <div key={filter.id} className="space-y-4">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(15,90,240,0.8)]" />
                  {filter.label}
                </h4>
                
                {filter.type === 'checkbox' ? (
                  <div className={filter.id === 'vram' || filter.id === 'capacity' ? "grid grid-cols-2 gap-2" : "space-y-2"}>
                    {filter.options.map((option: string) => (
                      <label 
                        key={option} 
                        className={`flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 cursor-pointer transition-all group ${
                          activeFilters[filter.id]?.includes(option) ? 'border-primary/50 bg-primary/5' : ''
                        }`}
                      >
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            className="peer appearance-none w-4 h-4 rounded border border-white/20 checked:bg-primary checked:border-primary transition-all cursor-pointer" 
                            checked={activeFilters[filter.id]?.includes(option) || false}
                            onChange={() => toggleFilter(filter.id, option)}
                          />
                          <Check className={`absolute w-3 h-3 text-white transition-opacity pointer-events-none ${activeFilters[filter.id]?.includes(option) ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                        <span className={`text-xs font-bold transition-colors ${activeFilters[filter.id]?.includes(option) ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="relative group">
                    <select 
                      value={activeFilters[filter.id]?.[0] || ''}
                      onChange={(e) => toggleFilter(filter.id, e.target.value, 'select')}
                      className="w-full bg-[#1a1f26] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white appearance-none focus:ring-1 focus:ring-primary outline-none cursor-pointer transition-all"
                    >
                      <option value="" className="bg-[#151921] text-white">Todos</option>
                      {filter.options.map((option: string) => (
                        <option key={option} value={option} className="bg-[#151921] text-white">{option}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none group-hover:text-primary transition-colors" />
                  </div>
                )}
              </div>
            ))}

            {/* Price Filter */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(15,90,240,0.8)]" />
                PRECIO (S/)
              </h4>
              <div className="px-2 space-y-4">
                <div className="relative h-6 flex items-center">
                  <input 
                    type="range" 
                    min="0" 
                    max="20000" 
                    step="50"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val <= priceRange[1]) {
                        setPriceRange([val, priceRange[1]]);
                      }
                    }}
                    className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer accent-primary z-20 pointer-events-auto"
                  />
                  <input 
                    type="range" 
                    min="0" 
                    max="20000" 
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= priceRange[0]) {
                        setPriceRange([priceRange[0], val]);
                      }
                    }}
                    className="absolute w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary z-10"
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] font-bold text-slate-500">S/ {priceRange[0]}</span>
                  <span className="text-[10px] font-bold text-slate-500">S/ {priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Promo Banner */}
          <div className="bg-primary rounded-3xl p-6 relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 space-y-4">
              <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">OFERTA DE TEMPORADA</p>
              <h4 className="text-xl font-black text-white leading-tight">Envío gratis en {info.title} gama alta</h4>
              <button className="bg-white text-primary px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">
                VER DETALLES
              </button>
            </div>
            <Truck className="absolute bottom-4 right-4 w-16 h-16 text-white/10 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-[#151921]/50 rounded-2xl p-4 border border-white/5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Ordenar por:</span>
                <button className="flex items-center gap-2 text-[10px] font-black text-white hover:text-primary transition-colors uppercase tracking-widest">
                  Relevancia <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Mostrar:</span>
                <button className="flex items-center gap-2 text-[10px] font-black text-white hover:text-primary transition-colors uppercase tracking-widest">
                  24 por página <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-slate-500 hover:text-white'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-slate-500 hover:text-white'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#151921] rounded-3xl border border-white/5 hover:border-primary/50 transition-all group relative flex flex-col cursor-pointer overflow-hidden"
                  onClick={() => onProductClick?.(product)}
                >
                  {/* Badges & Actions */}
                  <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between">
                    <div className="flex flex-col gap-1.5">
                      {product.badge && (
                        <span className={`${product.badgeColor || 'bg-primary'} text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-lg shadow-primary/20`}>
                          {product.badge}
                        </span>
                      )}
                      {product.stock && (
                        <span className={`text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest ${
                          product.stock === 'EN STOCK' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {product.stock}
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className={`w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors ${
                        wishlist.includes(product.id) ? 'text-rose-500' : 'text-white/40 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="relative aspect-square bg-[#0B0E14] overflow-hidden flex items-center justify-center">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {product.stock === 'AGOTADO' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] border border-white/20 px-4 py-2 rounded-lg">AGOTADO</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">{product.brand || 'Premium'}</p>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">SKU: {product.id}</p>
                      </div>
                      <h3 className="font-bold text-white text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                      {product.categoryLabel && (
                        <p className="text-[8px] font-black text-primary/60 uppercase tracking-widest mt-1">{product.categoryLabel}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {product.tags.map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-slate-800/50 rounded text-[8px] font-bold text-slate-400 uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-end justify-between pt-2 mt-auto">
                      <div className="space-y-1">
                        {product.oldPrice && <p className="text-[10px] text-slate-500 line-through">S/ {product.oldPrice}</p>}
                        <p className="text-blue-500 font-black text-xl tracking-tighter">S/ {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(product.price)}</p>
                      </div>
                      <button 
                        disabled={product.stock === 'AGOTADO'}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart?.(product);
                          setNotification(`"${product.name}" se agregó al carrito`);
                          setTimeout(() => setNotification(null), 3000);
                        }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          product.stock === 'AGOTADO' ? 'opacity-20 cursor-not-allowed bg-white/5 text-slate-500' : 'bg-white/5 text-slate-500 hover:text-white hover:bg-primary hover:shadow-lg hover:shadow-primary/20'
                        }`}
                      >
                        <ShoppingCart className="w-6 h-6 stroke-[1.5]" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {searchQuery ? `No se encontraron resultados para "${searchQuery}"` : "No se encontraron productos"}
                </h3>
                <p className="text-slate-500">
                  {searchQuery 
                    ? "Intenta con términos más generales o verifica la ortografía."
                    : "Intenta ajustar tus filtros para encontrar lo que buscas."}
                </p>
                <button 
                  onClick={() => {
                    setActiveFilters({}); 
                    setPriceRange([0, 20000]);
                    if (searchQuery) {
                      onClearSearch?.();
                    }
                  }}
                  className="text-primary font-bold hover:underline"
                >
                  {searchQuery ? "Limpiar búsqueda" : "Limpiar todos los filtros"}
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 pt-12">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 transition-colors ${currentPage === 1 ? 'opacity-20 cursor-not-allowed' : ''}`}
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                  currentPage === page ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 transition-colors ${currentPage === totalPages ? 'opacity-20 cursor-not-allowed' : ''}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
