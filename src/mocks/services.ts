export interface ServiceScope {
  title: string;
  desc: string;
  icon: string;
}

export interface GeneralContractorService {
  id: string;
  title: string;
  tagline: string;
  description: string;
  scopes: ServiceScope[];
  whyUs: string[];
  stats: { val: string; label: string }[];
}

export const generalContractorService: GeneralContractorService = {
  id: 'general-contractor',
  title: 'General Contractor',
  tagline: 'Solusi Konstruksi Profesional & Terpercaya',
  description:
    'PT. Waringin Mega Mandiri hadir sebagai General Contractor profesional yang berpengalaman dalam pelaksanaan proyek konstruksi skala menengah hingga besar. Didukung oleh tim berpengalaman dari PT. Waringin Megah, kami menghadirkan hasil pekerjaan berkualitas terbaik untuk setiap klien.',
  scopes: [
    {
      title: 'Gedung Komersial & Perkantoran',
      desc: 'Pembangunan gedung komersial, perkantoran, dan pusat perbelanjaan dengan standar konstruksi internasional.',
      icon: 'ri-building-2-line',
    },
    {
      title: 'Hunian & Residensial',
      desc: 'Konstruksi hunian premium, apartemen, dan perumahan dengan kualitas material terbaik dan pengerjaan presisi.',
      icon: 'ri-home-4-line',
    },
    {
      title: 'Fasilitas Publik & Institusi',
      desc: 'Pembangunan fasilitas publik, rumah sakit, sekolah, dan gedung pemerintahan sesuai standar yang berlaku.',
      icon: 'ri-hospital-line',
    },
    {
      title: 'Proyek Khusus & Mixed-Use',
      desc: 'Penanganan proyek dengan kompleksitas tinggi, termasuk mixed-use development dan bangunan dengan desain arsitektur unik.',
      icon: 'ri-layout-masonry-line',
    },
  ],
  whyUs: [
    'Tim Berpengalaman dari PT. Waringin Megah',
    'Manajemen Proyek Terstruktur & Transparan',
    'Komitmen Kualitas & Ketepatan Waktu',
    'Dukungan Penuh Tenaga, Peralatan & Keuangan',
    'Rekam Jejak Proyek yang Terbukti',
    'Komunikasi Aktif dengan Klien',
  ],
  stats: [
    { val: '50+', label: 'Proyek Selesai' },
    { val: '100%', label: 'Kepuasan Klien' },
    { val: '2022', label: 'Tahun Berdiri' },
  ],
};
