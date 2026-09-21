export type Status = "available" | "incoming" | "preorder" | "reserved" | "sold";

export type Product = {
  slug: string;
  name: string;
  variant: string;
  category: "Console" | "Handheld";
  condition: string;
  grade: "New" | "A" | "B" | "C";
  price: number;
  status: Status;
  /** Drop a file in /public/products and set the path here to replace the placeholder frame. */
  image: string | null;
  summary: string;
  specs: { label: string; value: string }[];
  included: string[];
  tested: string[];
  warranty: string;
  location: string;
  note?: string;
};

export const statusLabel: Record<Status, string> = {
  available: "Available",
  incoming: "Arriving this month",
  preorder: "Order on request",
  reserved: "Reserved",
  sold: "Sold",
};

/** Short call-to-action used on full-bleed bands. */
export const actionLabel: Record<Status, string> = {
  available: "Buy Now",
  incoming: "Reserve",
  preorder: "Pre-order",
  reserved: "Reserved",
  sold: "Sold Out",
};

export const gradeCopy: Record<Product["grade"], string> = {
  New: "Sealed, unopened stock. Bench-tested on arrival before it ships.",
  A: "Light use. No meaningful cosmetic wear at arm's length. Fully functional.",
  B: "Visible signs of normal use — light scuffs or marks on the shell. Fully functional.",
  C: "Heavier cosmetic wear. Sold at a discount and fully functional unless stated.",
};

export const products: Product[] = [
  {
    slug: "playstation-5-disc-edition",
    name: "PlayStation 5",
    variant: "Disc Edition · CFI-1000 series",
    category: "Console",
    condition: "Pre-owned · approx. 2 years",
    grade: "B",
    price: 35000,
    status: "available",
    image: "/products/ps5-disc.jpg",
    summary:
      "Launch-model disc edition. Sony stops manufacturing game discs in January 2028, which makes a working disc drive the only route to physical games — and this is the generation that still has one.",
    specs: [
      { label: "Model", value: "CFI-1000 series (launch disc edition)" },
      { label: "Storage", value: "825GB NVMe SSD" },
      { label: "Optical drive", value: "Ultra HD Blu-ray, read-verified" },
      { label: "Controller", value: "1× DualSense, drift-tested" },
      { label: "Age", value: "Approximately 2 years" },
    ],
    included: [
      "PS5 console",
      "1× DualSense wireless controller",
      "HDMI cable",
      "Power cable",
      "Vertical stand",
    ],
    tested: [
      "Boots to home screen, full function pass",
      "Disc drive reads and loads a retail disc",
      "Controller analog drift and pairing checked",
      "Fan noise and thermals under load",
      "Serial number photographed and logged",
    ],
    warranty: "7-day DOA replacement",
    location: "Metro Manila",
    note: "No games included.",
  },
  {
    slug: "anbernic-rg-ds-plus-coral-pink",
    name: "ANBERNIC RG DS Plus",
    variant: "Coral Pink · 16GB",
    category: "Handheld",
    condition: "Brand new · Sealed",
    grade: "New",
    price: 9500,
    status: "incoming",
    image: null,
    summary:
      "Dual 4.3-inch 1024 × 768 IPS displays with a multi-touch lower screen and a colour-matched capacitive stylus — the exact layout DS-era games were designed around. Bigger screens than the base RG DS, plus a stepless hinge that holds any angle.",
    specs: [
      { label: "Displays", value: "Dual 4.3-inch IPS, 1024 × 768" },
      { label: "Touch", value: "Multi-touch lower screen, capacitive stylus" },
      { label: "CPU", value: "Rockchip RK3568, quad-core Cortex-A55 @ 2.0GHz" },
      { label: "GPU", value: "ARM Mali-G52 2EE" },
      { label: "RAM", value: "1GB" },
      { label: "Storage", value: "16GB microSD included, 2 slots, up to 2TB" },
      { label: "Battery", value: "4,000mAh, around 6 hours" },
      { label: "Wireless", value: "Wi-Fi a/b/g/n/ac (2.4/5GHz), Bluetooth 4.2" },
      { label: "Audio", value: "Stereo speakers, 3.5mm jack, vibration motor" },
      { label: "Ports", value: "2× USB-C, 2× microSD" },
      { label: "Dimensions", value: "167 × 96 × 24mm, 344g" },
      { label: "System", value: "Dual-screen Linux, 20+ supported formats" },
    ],
    included: [
      "RG DS Plus handheld",
      "Capacitive stylus, colour-matched",
      "16GB microSD card with OS",
      "2× tempered glass screen protectors",
      "USB-C charging cable",
      "Lanyard",
      "Quick start guide",
    ],
    tested: [
      "Both displays verified on arrival",
      "All buttons and shoulder inputs",
      "Stylus and touch response",
      "Charging and battery hold",
      "Serial number photographed and logged",
    ],
    warranty: "7-day DOA replacement",
    location: "Santo Tomas, Batangas",
    note: "First units in the country — reserve before they land.",
  },
  {
    slug: "anbernic-rg-ds-plus-matte-black",
    name: "ANBERNIC RG DS Plus",
    variant: "Matte Black · 16GB",
    category: "Handheld",
    condition: "Brand new · Sealed",
    grade: "New",
    price: 9500,
    status: "incoming",
    image: null,
    summary:
      "Dual 4.3-inch 1024 × 768 IPS displays with a multi-touch lower screen and a colour-matched capacitive stylus — the exact layout DS-era games were designed around. Bigger screens than the base RG DS, plus a stepless hinge that holds any angle.",
    specs: [
      { label: "Displays", value: "Dual 4.3-inch IPS, 1024 × 768" },
      { label: "Touch", value: "Multi-touch lower screen, capacitive stylus" },
      { label: "CPU", value: "Rockchip RK3568, quad-core Cortex-A55 @ 2.0GHz" },
      { label: "GPU", value: "ARM Mali-G52 2EE" },
      { label: "RAM", value: "1GB" },
      { label: "Storage", value: "16GB microSD included, 2 slots, up to 2TB" },
      { label: "Battery", value: "4,000mAh, around 6 hours" },
      { label: "Wireless", value: "Wi-Fi a/b/g/n/ac (2.4/5GHz), Bluetooth 4.2" },
      { label: "Audio", value: "Stereo speakers, 3.5mm jack, vibration motor" },
      { label: "Ports", value: "2× USB-C, 2× microSD" },
      { label: "Dimensions", value: "167 × 96 × 24mm, 344g" },
      { label: "System", value: "Dual-screen Linux, 20+ supported formats" },
    ],
    included: [
      "RG DS Plus handheld",
      "Capacitive stylus, colour-matched",
      "16GB microSD card with OS",
      "2× tempered glass screen protectors",
      "USB-C charging cable",
      "Lanyard",
      "Quick start guide",
    ],
    tested: [
      "Both displays verified on arrival",
      "All buttons and shoulder inputs",
      "Stylus and touch response",
      "Charging and battery hold",
      "Serial number photographed and logged",
    ],
    warranty: "7-day DOA replacement",
    location: "Santo Tomas, Batangas",
    note: "First units in the country — reserve before they land.",
  },
  {
    slug: "anbernic-rg-ds-plus-metallic-blue",
    name: "ANBERNIC RG DS Plus",
    variant: "Metallic Blue · 16GB",
    category: "Handheld",
    condition: "Brand new · Sealed",
    grade: "New",
    price: 9500,
    status: "incoming",
    image: null,
    summary:
      "Dual 4.3-inch 1024 × 768 IPS displays with a multi-touch lower screen and a colour-matched capacitive stylus — the exact layout DS-era games were designed around. Bigger screens than the base RG DS, plus a stepless hinge that holds any angle.",
    specs: [
      { label: "Displays", value: "Dual 4.3-inch IPS, 1024 × 768" },
      { label: "Touch", value: "Multi-touch lower screen, capacitive stylus" },
      { label: "CPU", value: "Rockchip RK3568, quad-core Cortex-A55 @ 2.0GHz" },
      { label: "GPU", value: "ARM Mali-G52 2EE" },
      { label: "RAM", value: "1GB" },
      { label: "Storage", value: "16GB microSD included, 2 slots, up to 2TB" },
      { label: "Battery", value: "4,000mAh, around 6 hours" },
      { label: "Wireless", value: "Wi-Fi a/b/g/n/ac (2.4/5GHz), Bluetooth 4.2" },
      { label: "Audio", value: "Stereo speakers, 3.5mm jack, vibration motor" },
      { label: "Ports", value: "2× USB-C, 2× microSD" },
      { label: "Dimensions", value: "167 × 96 × 24mm, 344g" },
      { label: "System", value: "Dual-screen Linux, 20+ supported formats" },
    ],
    included: [
      "RG DS Plus handheld",
      "Capacitive stylus, colour-matched",
      "16GB microSD card with OS",
      "2× tempered glass screen protectors",
      "USB-C charging cable",
      "Lanyard",
      "Quick start guide",
    ],
    tested: [
      "Both displays verified on arrival",
      "All buttons and shoulder inputs",
      "Stylus and touch response",
      "Charging and battery hold",
      "Serial number photographed and logged",
    ],
    warranty: "7-day DOA replacement",
    location: "Santo Tomas, Batangas",
    note: "First units in the country — reserve before they land.",
  },
  {
    slug: "retroid-pocket-duo-lite-4gb",
    name: "Retroid Pocket Duo Lite",
    variant: "4GB / 64GB · 5 colourways",
    category: "Handheld",
    condition: "Brand new · Sealed · Ordered on request",
    grade: "New",
    price: 16000,
    status: "preorder",
    image: null,
    summary:
      "A tier above the Anbernic: Android 15 on a Snapdragon-class QCS6125 with Adreno 610, hall-effect sticks and active cooling. Dual screens at 5.5 and 4.2 inches, both 60Hz, on a 6,000mAh battery.",
    specs: [
      { label: "Displays", value: "5.5-inch primary + 4.2-inch secondary, TFT, 60Hz" },
      { label: "Chipset", value: "Qualcomm QCS6125 @ 2.0GHz" },
      { label: "GPU", value: "Adreno 610" },
      { label: "Memory", value: "4GB RAM / 64GB storage" },
      { label: "System", value: "Android 15" },
      { label: "Battery", value: "6,000mAh" },
      { label: "Controls", value: "Hall-effect sticks, digital L2/R2" },
      { label: "Cooling", value: "Active" },
      { label: "Audio", value: "Front-facing stereo speakers, 3.5mm jack" },
      { label: "Wireless", value: "Wi-Fi 5, Bluetooth 5.0" },
      { label: "Weight", value: "372g" },
      { label: "Colourways", value: "GC, 16Bit, Black, Ice Blue, Clear Purple" },
    ],
    included: [
      "Retroid Pocket Duo Lite handheld",
      "USB-C charging cable",
      "Manufacturer packaging",
    ],
    tested: [
      "Both displays verified on arrival",
      "All buttons, sticks and shoulder inputs",
      "Charging and battery hold",
      "Wi-Fi and Bluetooth pairing",
      "Serial number photographed and logged",
    ],
    warranty: "7-day DOA replacement",
    location: "Santo Tomas, Batangas",
    note: "Ordered once you confirm your colourway. Roughly 2–4 weeks from order to handover — we confirm the current estimate before you pay anything.",
  },
  {
    slug: "retroid-pocket-duo-lite-6gb",
    name: "Retroid Pocket Duo Lite",
    variant: "6GB / 128GB · 5 colourways",
    category: "Handheld",
    condition: "Brand new · Sealed · Ordered on request",
    grade: "New",
    price: 17500,
    status: "preorder",
    image: null,
    summary:
      "The higher-memory Duo Lite. Same Android 15 platform, hall-effect sticks and dual 60Hz screens, with 6GB of RAM and 128GB of storage — the configuration worth taking if you intend to push past DS-era emulation.",
    specs: [
      { label: "Displays", value: "5.5-inch primary + 4.2-inch secondary, TFT, 60Hz" },
      { label: "Chipset", value: "Qualcomm QCS6125 @ 2.0GHz" },
      { label: "GPU", value: "Adreno 610" },
      { label: "Memory", value: "6GB RAM / 128GB storage" },
      { label: "System", value: "Android 15" },
      { label: "Battery", value: "6,000mAh" },
      { label: "Controls", value: "Hall-effect sticks, digital L2/R2" },
      { label: "Cooling", value: "Active" },
      { label: "Audio", value: "Front-facing stereo speakers, 3.5mm jack" },
      { label: "Wireless", value: "Wi-Fi 5, Bluetooth 5.0" },
      { label: "Weight", value: "372g" },
      { label: "Colourways", value: "GC, 16Bit, Black, Ice Blue, Clear Purple" },
    ],
    included: [
      "Retroid Pocket Duo Lite handheld",
      "USB-C charging cable",
      "Manufacturer packaging",
    ],
    tested: [
      "Both displays verified on arrival",
      "All buttons, sticks and shoulder inputs",
      "Charging and battery hold",
      "Wi-Fi and Bluetooth pairing",
      "Serial number photographed and logged",
    ],
    warranty: "7-day DOA replacement",
    location: "Santo Tomas, Batangas",
    note: "Ordered once you confirm your colourway. Roughly 2–4 weeks from order to handover — we confirm the current estimate before you pay anything.",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** Grade "New" means sealed stock; everything else is pre-owned. */
export const isUsed = (p: Product) => p.grade !== "New";

export const inStock = () => products.filter((p) => p.status !== "sold");
