export interface TeamMember {
  id: number;
  name: string;
  position: string;
  description: string;
  image: string;
  linkedin?: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Eddy Susanto',
    position: 'Pemegang Saham',
    description: 'Pengembang berdomisili di Surabaya. Bersama Ir. Yohanes Sucipto mendirikan PT. Waringin Megah pada tahun 1987.',
    image: 'https://static.readdy.ai/image/19e5c28a928905456492b1bd20d85494/60f8f14798864b0d18f60b1c020ddb8c.png',
  },
  {
    id: 2,
    name: 'Yohanes Sucipto',
    position: 'Pemegang Saham',
    description: 'Alumnus Fakultas Teknik Sipil Universitas Kristen Petra Surabaya tahun 1985. Bersama Eddy Susanto mendirikan PT. Waringin Megah.',
    image: 'https://static.readdy.ai/image/19e5c28a928905456492b1bd20d85494/15f85e8d2c62fcb0842905625cb15688.png',
  },
  {
    id: 3,
    name: 'Huniwanto Hayasan',
    position: 'Komisaris Utama',
    description: 'Lulusan Teknik Sipil ITS Surabaya tahun 1989. Bergabung dengan PT. Waringin Megah sebagai Manajer Proyek, kini menjabat Komisaris Utama PT. Waringin Mega Mandiri.',
    image: 'https://static.readdy.ai/image/19e5c28a928905456492b1bd20d85494/715537f64f953c4b90c78f2e2ff2c759.png',
  },
  {
    id: 4,
    name: 'Johan Kurniawan',
    position: 'Direktur Utama',
    description: 'Lulusan Teknik Sipil Universitas Kristen Maranatha Bandung tahun 1994. Bergabung PT. Waringin Megah sebagai Manajer Proyek, kini menjabat Direktur Utama PT. Waringin Mega Mandiri.',
    image: 'https://static.readdy.ai/image/19e5c28a928905456492b1bd20d85494/1617131f2f12ff4a26b6e253e5faebc0.png',
  },
];

export const companyValues = [
  {
    id: 1,
    icon: 'ri-shield-check-line',
    title: 'Integritas',
    description: 'Kami menjunjung tinggi kejujuran dan transparansi dalam setiap aspek bisnis dan pelaksanaan proyek.',
  },
  {
    id: 2,
    icon: 'ri-medal-line',
    title: 'Kualitas',
    description: 'Standar kualitas premium ISO 9001 diterapkan di setiap proses konstruksi.',
  },
  {
    id: 3,
    icon: 'ri-lightbulb-line',
    title: 'Inovasi',
    description: 'Terus berinovasi dengan teknologi terkini BIM, drone survey, dan AI dalam manajemen proyek konstruksi.',
  },
  {
    id: 4,
    icon: 'ri-team-line',
    title: 'Kolaborasi',
    description: 'Membangun kemitraan strategis yang saling menguntungkan dengan klien, konsultan, dan subkontraktor.',
  },
];

export const milestones = [
  { year: 2008, event: 'PT Waringin Mega Mandiri didirikan di Jakarta dengan fokus renovasi gedung komersial.' },
  { year: 2011, event: 'Ekspansi ke proyek General Contractor skala menengah, meraih kontrak perdana senilai Rp 50 Miliar.' },
  { year: 2014, event: 'Sertifikasi ISO 9001:2015 dan SBU Konstruksi dari LPJK Nasional.' },
  { year: 2016, event: 'Memulai divisi infrastruktur dan memenangkan proyek jalan tol pertama di Sumatera.' },
  { year: 2018, event: 'Implementasi BIM (Building Information Modeling) di seluruh lini proyek — menjadi pionir BIM di industri konstruksi Indonesia.' },
  { year: 2020, event: 'Penghargaan Kontraktor Terbaik Nasional dari Kementerian PUPR. Portofolio menembus 100 proyek.' },
  { year: 2022, event: 'Ekspansi ke Kalimantan dan Sulawesi. Nilai kontrak aktif menembus Rp 2 Triliun.' },
  { year: 2024, event: 'Memasuki era Digital Construction dengan integrasi AI, drone survey, dan platform manajemen proyek cloud-based.' },
];
