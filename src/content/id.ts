import type { Dictionary } from "./types";
const dictionary = {
  lang: "id",
  meta: {
    title: "KANIQ · Beranda bahasa Anda",
    description:
      "Pilih perawatan, lama tinggal, dan pendamping. Lihat rencana pemulihan dan kunjungan ke Korea.",
    quoteTitle: "KANIQ · Mulai estimasi",
    quoteDescription: "Coba langkah-langkah sebelum peluncuran.",
    ogAlt: "Keluarga mengunjungi istana di Seoul",
  },
  previewBand:
    "Situs pratinjau — pendaftaran KANIQ sedang diproses. Permintaan belum disimpan atau dibalas.",
  header: {
    skip: "Lewati ke konten",
    nav: {
      care: "Cari perawatan",
      plan: "Perjalanan",
      refer: "Referensi",
      trust: "Kepercayaan",
    },
    language: "Bahasa",
    phase2Soon: "Dibuka Desember",
  },
  hero: {
    homeFor: "Perawatan dalam bahasa Anda",
    headline: ["Perjalanan cek kesehatan yang aman, bersama seluruh keluarga."],
    lede: "Pilih perawatan, lama tinggal, dan pendamping. Lihat rencana pemulihan dan kunjungan ke Korea.",
    quoteForPlan: "Mulai estimasi rencana ini",
  },
  planner: {
    legend: {
      treatment: "Perawatan",
      days: "Hari di Korea",
      travelers: "Peserta",
    },
    pax: {
      one: "1 orang",
      two: "2 orang",
      group: "3+ orang",
    },
    title: "{name}, {n} hari",
    subtitle: {
      one: "Untuk 1 orang, tiba di Incheon",
      two: "Untuk 2 orang, tiba di Incheon",
      group: "Untuk rombongan, tiba di Incheon",
    },
    rooms: {
      one: "Hotel dekat rumah sakit",
      two: "Kamar twin dekat rumah sakit",
      group: "Hunian keluarga dekat rumah sakit",
    },
    dayTitles: {
      arrive: "Kedatangan",
      treatment: "Perawatan",
      early: "Pemulihan awal",
      culture: "Pemulihan dan budaya",
      free: "Hari bebas",
      home: "Kontrol dan pulang",
    },
    fixed: {
      pickup: "Penjemputan bandara oleh pengemudi berbahasa Anda",
      escort: "Koordinator menemani ke rumah sakit",
      finalCheck: "Pemeriksaan akhir dan laporan medis",
      dropoff: "Antar ke bandara dan saluran tindak lanjut",
    },
    tracks: {
      Move: "Transportasi",
      Stay: "Menginap",
      Treat: "Perawatan",
      Taste: "Kuliner",
      Feel: "Pengalaman",
      See: "Wisata",
    },
    badges: {
      ok: "Doctor OK",
      from: "Mulai hari {n}",
      afterDoctor: "Setelah persetujuan dokter",
      notUntil: "Tunggu hingga hari {n}",
    },
    priceLabel: "Kisaran biaya perawatan",
    priceNote: "Kisaran indikatif; rumah sakit mengonfirmasi rencana pribadi.",
    feeLabel: "Biaya KANIQ Anda",
    photoAlt: "Semangkuk samgyetang",
    treatments: {
      implants: {
        name: "Implan gigi",
        treat: "Perawatan implan di klinik gigi",
        early: [
          "Samgyetang lembut dan hangat",
          "Upacara teh hanok",
          "Jalan datar di Cheonggyecheon",
        ],
        mid: [
          "Gyeongbokgung dengan hanbok",
          "Tur kuliner Pasar Gwangjang",
          "Templestay sehari",
        ],
        late: ["Perjalanan ke pemandian air panas", "Templestay menginap"],
      },
      lasik: {
        name: "LASIK",
        treat: "Pemeriksaan mata dan LASIK",
        early: [
          "Istirahat dengan mata tertutup di hotel",
          "Foto hanbok dalam ruangan",
          "Makan siang hanjeongsik",
        ],
        mid: [
          "Bukchon dan Namsan pada siang hari",
          "Pertunjukan Nanta",
          "Jjimjilbang",
        ],
        late: ["Bersepeda di Sungai Han", "Kolam renang"],
      },
      screening: {
        name: "Pemeriksaan kesehatan",
        treat: "Pemeriksaan dengan endoskopi sedasi",
        early: [
          "Bubur setelah endoskopi",
          "Taman Changdeokgung",
          "Upacara teh hanok",
        ],
        mid: ["Hasil dan laporan medis", "Kelas memasak", "DDP dan Dongdaemun"],
        late: ["Perjalanan ke benteng Suwon", "Spa Korea"],
      },
      "womens-health": {
        name: "Kesehatan wanita",
        treat: "Pemeriksaan ginekologi dengan dokter wanita",
        early: [
          "Kamar tenang dan koordinator wanita",
          "Upacara teh hanok",
          "Makan siang makanan kuil",
        ],
        mid: [
          "Konsultasi pengobatan herbal",
          "Gyeongbokgung dengan hanbok",
          "Spa",
        ],
        late: ["Templestay menginap", "Retret air panas"],
      },
      fertility: {
        name: "Konsultasi kesuburan",
        treat: "Tes dan konsultasi spesialis kesuburan",
        early: [
          "Hunian dengan dapur",
          "Jalan di Seoul Forest",
          "Makan malam hanjeongsik",
        ],
        mid: [
          "Rencana perawatan dan jadwal tindak lanjut jarak jauh",
          "Desa hanok Bukchon",
          "Pertunjukan musik tradisional",
        ],
        late: ["Perjalanan ke Gapyeong", "Spa Korea"],
      },
    },
  },
  care: {
    implants: "Implan gigi",
    lasik: "LASIK",
    screening: "Pemeriksaan kesehatan",
    fertility: "Konsultasi kesuburan",
    dental: "Perawatan gigi",
    eye: "Perawatan mata",
    "womens-wellness": "Kebugaran wanita",
    "womens-health": "Kesehatan wanita",
    "serious-referral": "Rujukan penyakit serius",
    "student-checkup": "Pemeriksaan pelajar",
  },
  local: {
    title: "Beranda bahasa Anda",
    priorityTitle: "Prioritas perawatan",
    priorityCare: ["screening", "dental", "womens-health"],
    specialTitle: "Dukungan kunjungan",
    special: "Makanan halal dan ruang salat di dekat rumah sakit mitra",
    photoAlt: "Keluarga mengunjungi istana di Seoul",
    photoCaption: "Perawatan dan budaya, dengan waktu untuk pulih.",
  },
  messenger: {
    channel: "WhatsApp",
    chatOn: "Konsultasi via {name}",
    opensAtLaunch: "Dibuka saat peluncuran",
  },
  doctorOk: {
    badge: "Doctor OK",
    title: "Pemulihan menentukan ritme",
    intro:
      "Contoh aturan pemulihan. Dokter menentukan kegiatan sesuai kondisi Anda.",
    caption: "Contoh aturan menurut hari setelah perawatan",
    activity: "Kegiatan",
    rows: [
      {
        activity: "Jjimjilbang",
        after: "LASIK",
        okFromDay: 3,
      },
      {
        activity: "Perjalanan ke pemandian air panas",
        after: "Implan gigi",
        okFromDay: 1,
      },
      {
        activity: "Makanan pedas",
        after: "Implan gigi",
        okFromDay: 3,
      },
      {
        activity: "Gyeongbokgung dengan hanbok",
        after: "LASIK",
        okFromDay: 2,
      },
      {
        activity: "Templestay menginap",
        after: "Implan gigi",
        okFromDay: 4,
      },
    ],
    legendOk: "Disetujui dokter",
    legendNot: "Belum",
    cellOk: "Boleh",
    cellNot: "Tunggu",
  },
  recovery: {
    title: "Contoh satu minggu pemulihan",
    intro: "Contoh kegiatan ringan selama perawatan, sesuai arahan dokter.",
    cols: {
      stage: "Tahap",
      stay: "Menginap",
      see: "Wisata",
      eat: "Makan",
      culture: "Budaya",
    },
    rows: [
      {
        stage: "D0",
        note: "Hari perawatan",
        stay: "Istirahat dekat rumah sakit",
        see: "Tidak ada; pendamping boleh berjalan",
        eat: "Bubur, makanan hangat",
        culture: "Tidak ada",
      },
      {
        stage: "D1–2",
        note: "Pemulihan awal",
        stay: "Hotel yang sama",
        see: "Jalan datar, 1–2 jam",
        eat: "Samgyetang, hanjeongsik, kafe",
        culture: "Upacara teh, foto hanbok dalam ruangan",
      },
      {
        stage: "D3–5",
        note: "Pemulihan dan budaya",
        stay: "Hanok jika sesuai",
        see: "Namsan, Bukchon, Sungai Han",
        eat: "Tur pasar, kelas memasak",
        culture: "Istana, pertunjukan, templestay sehari",
      },
      {
        stage: "Kontrol dan pulang",
        note: "Setelah kontrol dokter",
        stay: "Fleksibel",
        see: "Perjalanan di luar Seoul",
        eat: "Fleksibel",
        culture: "Spa atau templestay menginap setelah persetujuan dokter",
      },
    ],
  },
  trust: {
    title: "Siapa membayar apa",
    intro: "Tiga prinsip biaya yang dapat dilihat sebelum memilih.",
    sample: "Contoh",
    receipt: {
      title: "Siapa membayar apa",
      sub: "Contoh perjalanan perawatan gigi",
      rows: [
        {
          what: "Perawatan Anda",
          who: "Dibayar ke rumah sakit",
          amount: "Harga kunjungan langsung",
        },
        {
          what: "Penjemputan dan hotel",
          who: "Dibayar ke penyedia sebelum pemesanan",
          amount: "Sesuai estimasi",
        },
        {
          what: "Koordinator, penerjemah, dan saluran bantuan bahasa Anda",
          who: "KANIQ",
          amount: "₩0",
        },
        {
          what: "Koordinasi KANIQ",
          who: "Dibayar rumah sakit",
          amount: "Bukan biaya Anda",
        },
      ],
      total: "Pembayaran Anda ke KANIQ",
      seal: "TANPA BIAYA PASIEN · KANIQ",
    },
    records: {
      title: "Orang di balik perawatan",
      intro:
        "Catatan ilustratif, bukan daftar penyedia yang tersedia saat ini.",
      figureAlt: "Dokter, pasien, dan penerjemah berdiskusi",
      figureCaption: "Penerjemah dapat hadir saat konsultasi.",
      labels: {
        registration: "Registrasi",
        accreditation: "Akreditasi",
        specialists: "Spesialis",
        languages: "Bahasa",
      },
      hospitals: [
        {
          kind: "Implan dan prostetik gigi, Seoul",
          specialists: "14",
          languages: "Inggris, Jepang, Mongolia",
          doctorBio: "Spesialis prostodonti; Korea dan Inggris",
        },
        {
          kind: "Kesehatan wanita dan kesuburan, Seoul",
          specialists: "9",
          languages: "Jepang, Rusia, Indonesia",
          doctorBio: "Spesialis obstetri dan ginekologi; Korea dan Jepang",
        },
      ],
    },
    steps: {
      title: "Jika rencana berubah",
      intro: "Urutan langkah bersama koordinator Anda.",
      items: [
        {
          title: "Hubungi koordinator",
          body: "Jelaskan kejadian dalam bahasa Anda.",
        },
        {
          title: "Hubungi rumah sakit",
          body: "Koordinator mengatur evaluasi klinis.",
        },
        {
          title: "Sepakati langkah berikut",
          body: "Bahas pilihan dan biaya yang tersedia.",
        },
        {
          title: "Eskalasi masalah",
          body: "Gunakan prosedur sengketa jika belum selesai.",
        },
      ],
    },
  },
  templates: {
    title: "Enam cara memulai",
    intro: "Pilih salah satu dari enam rencana untuk memulai estimasi.",
    cta: "PDF / mulai estimasi",
    items: [
      {
        name: "Implan gigi",
        length: "7 Hari",
        highlight: "Pemulihan dan kunjungan budaya ringan",
        interest: "dental",
      },
      {
        name: "LASIK",
        length: "5 Hari",
        highlight: "Pemulihan dan kunjungan budaya ringan",
        interest: "eye",
      },
      {
        name: "Pemeriksaan kesehatan",
        length: "5 Hari",
        highlight: "Pemulihan dan kunjungan budaya ringan",
        interest: "screening",
      },
      {
        name: "Kebugaran wanita",
        length: "7 Hari",
        highlight: "Pemulihan dan kunjungan budaya ringan",
        interest: "womens-health",
      },
      {
        name: "Konsultasi kesuburan",
        length: "10 Hari",
        highlight: "Pemulihan dan kunjungan budaya ringan",
        interest: "fertility",
      },
      {
        name: "Pemeriksaan keluarga",
        length: "7 Hari",
        highlight: "Pemulihan dan kunjungan budaya ringan",
        interest: "screening",
      },
    ],
  },
  ambassador: {
    title: "Hubungkan orang lain",
    intro:
      "Pelajar, anggota komunitas, dan lembaga dapat mengenalkan orang serta memilih tujuan apresiasi.",
    giveLegend: "Pilih tujuan apresiasi",
    options: [
      {
        label: "Pribadi",
        note: "Terima secara pribadi",
      },
      {
        label: "Dukungan misi",
        note: "Dukung misi",
      },
      {
        label: "Dana komunitas",
        note: "Dukung komunitas",
      },
      {
        label: "Beasiswa",
        note: "Dukung pelajar",
      },
    ],
    signupNote: "Pendaftaran dan kode referensi dibuka saat peluncuran.",
    preview: {
      title: "Ringkasan referensi",
      sample: "Pratinjau contoh",
      code: "Kode referensi",
      cols: ["Orang", "Pertanyaan", "Konsultasi", "Pemesanan", "Perawatan"],
      rows: [
        {
          name: "A.",
          care: "Pemeriksaan kesehatan",
          stage: 1,
        },
        {
          name: "B.",
          care: "Perawatan gigi",
          stage: 2,
        },
        {
          name: "C.",
          care: "Perawatan mata",
          stage: 3,
        },
      ],
      foot: "Hanya pratinjau; tanpa nominal atau kode terbit.",
    },
  },
  organizations: {
    title: "Untuk lembaga juga",
    intro:
      "Model kemitraan bagi organisasi yang menghubungkan orang dengan perawatan di Korea.",
    note: "Pertanyaan kemitraan dibuka saat peluncuran.",
    items: [
      {
        who: "Universitas",
        what: "Pemeriksaan pelajar dan keluarga",
      },
      {
        who: "Asosiasi komunitas",
        what: "Panduan perawatan bahasa lokal",
      },
      {
        who: "Organisasi keagamaan",
        what: "Perjalanan perawatan dan dukungan komunitas",
      },
      {
        who: "Lembaga publik",
        what: "Pemeriksaan kelompok dan kerja sama",
      },
    ],
  },
  footer: {
    tagline: "Anda memutuskan. Kami menangani kerumitannya.",
    regMedical: "Registrasi wisata medis",
    regTravel: "Registrasi agen perjalanan",
    feeTitle: "Prinsip biaya kami",
    fee: [
      "Pasien membayar KANIQ ₩0",
      "Harga perawatan sama dengan kunjungan langsung",
      "Rumah sakit membayar koordinasi",
    ],
    privacyTitle: "Privasi",
    privacy:
      "Pratinjau memvalidasi masukan tanpa menyimpan atau mengirimkannya ke penyedia.",
    disputeTitle: "Sengketa",
    dispute: "Bicarakan dengan koordinator lalu ikuti prosedur masalah.",
  },
  msgbar: {
    previewNote: "Pratinjau — saluran pesan dibuka saat peluncuran.",
  },
  quote: {
    title: "Mulai estimasi",
    intro: "Coba langkah-langkah sebelum peluncuran.",
    previewNotice:
      "Sebelum registrasi, permintaan tidak disimpan atau dibalas.",
    steps: ["Perawatan", "Jadwal", "Kontak"],
    stepOf: "Langkah {n} dari 3",
    interestLegend: "Perawatan yang diminati",
    timingLegend: "Kapan Anda berkunjung?",
    timing: {
      "within-3-months": "Dalam 3 bulan",
      "3-6-months": "3–6 bulan",
      "not-sure": "Belum pasti",
    },
    pickupLabel: "Saya ingin penjemputan bandara",
    stayLabel: "Pilihan penginapan",
    stayNone: "Tanpa preferensi",
    stay: {
      "near-hospital": "Dekat rumah sakit",
      hanok: "Hanok",
      "family-residence": "Hunian keluarga",
    },
    nameLabel: "Nama",
    methodLabel: "Metode kontak",
    method: {
      email: "Email",
      whatsapp: "WhatsApp",
      line: "LINE",
      messenger: "Messenger",
      kakaotalk: "KakaoTalk",
    },
    contactLabel: "Detail kontak",
    residenceLabel: "Negara tempat tinggal",
    optional: "Opsional",
    privacy:
      "Untuk persiapan estimasi, minat perawatan, jadwal, nama, kontak dan tempat tinggal diperiksa tanpa disimpan saat pratinjau; setelah peluncuran disimpan maksimal satu tahun dan diberikan ke rumah sakit pilihan Anda.",
    consentLabel: "Saya setuju dengan pemberitahuan privasi",
    next: "Berikutnya",
    back: "Kembali",
    submit: "Kirim pratinjau",
    sending: "Mengirim",
    errors: {
      required: "Lengkapi kolom ini.",
      invalid: "Periksa nilai ini.",
      too_long: "Isian terlalu panjang.",
      network: "Gagal mengirim. Coba lagi.",
    },
    doneTitle: "Pratinjau selesai",
    donePreview:
      "Masukan diperiksa; tidak disimpan dan tidak akan mendapat balasan.",
    backHome: "Kembali ke beranda",
  },
  live: {
    replyPromise: "Balasan dalam 24 jam",
    quoteDone: "Permintaan siap ditinjau.",
  },
} satisfies Dictionary;
export default dictionary;
