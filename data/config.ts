/**
 * ============================================================
 *  TOÀN BỘ NỘI DUNG THIỆP NẰM TRONG FILE NÀY.
 *  Sửa ở đây là xong, không cần đụng vào code giao diện.
 * ============================================================
 *
 *  Thiệp có HAI phiên bản, chọn theo đường link:
 *    /nha-gai/?to=Anh%20Nam   -> lễ VU QUY,  nhà gái đứng trước
 *    /nha-trai/?to=Anh%20Nam  -> lễ TÂN HÔN, nhà trai đứng trước
 *  Vào /tao-link để bấm ra link cho từng khách.
 */

/** Hai phiên bản thiệp. Cũng chính là đường dẫn trên link mời. */
export type SideKey = "nha-gai" | "nha-trai";

export type Guest = {
  /** Tên hiển thị mặc định khi link không có ?to= */
  fallback: string;
};

/** Một bên gia đình: cha mẹ + địa chỉ nhà. */
export type Family = {
  /** Tên nhà, ví dụ "NHÀ TRAI" */
  label: string;
  father: string;
  mother: string;
  address: string;
};

/** Cô dâu hoặc chú rể. */
export type Person = {
  name: string;
  /** Tên gọi ngắn dùng ở trang bìa, ví dụ "Vĩnh Thái" */
  shortName: string;
  /** "Cô dâu" / "Chú rể" */
  role: string;
  /** Thứ bậc trong nhà, ví dụ "Trưởng nữ" / "Quý nam" */
  birthOrder: string;
  photo: string;
};

export type WeddingEvent = {
  id: string;
  title: string;
  /** ISO 8601 có offset VN: 2026-11-29T07:30:00+07:00 */
  datetime: string;
  /** Chuỗi hiển thị giờ, ví dụ "7 giờ 30 · Chủ Nhật" */
  timeLabel: string;
  /** Ngày âm lịch, ví dụ "Nhằm ngày 21 tháng 10 năm Bính Ngọ" */
  lunarLabel: string;
  venue: string;
  address: string;
  /** Để trống thì tự tra Google Maps theo địa chỉ ở trên. */
  mapUrl?: string;
  note?: string;
};

/** Phần nội dung khác nhau giữa thiệp nhà gái và thiệp nhà trai. */
export type Side = {
  key: SideKey;
  /** Nhãn ngắn dùng trong trang /tao-link */
  label: string;
  /** Tên lễ in hoa: "VU QUY" / "TÂN HÔN" */
  ceremony: string;
  /** Nhà đứng tên mời — nhà này hiện trước trên thiệp. */
  host: "bride" | "groom";
  /** Chữ lồng trên dấu niêm phong sáp, 3 ký tự dạng "M&T" */
  monogram: string;
  /** Lời mời dự tiệc, chèn ngay dưới tên khách. */
  partyInvite: string;
  /** Lễ trước, tiệc sau — đúng thứ tự in trên thiệp giấy. */
  events: WeddingEvent[];
  /** Buổi mà khách được mời: dùng cho đồng hồ đếm ngược và tấm thiệp hình vòm. */
  mainEventId: string;
  /** Mừng cưới: mỗi bên một tài khoản. */
  gift: {
    qrImage: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    note: string;
  };
};

/* ---------------- Hai bên gia đình ---------------- */

const brideFamily: Family = {
  label: "NHÀ GÁI",
  father: "Ông Lê Thanh Bình",
  mother: "Bà Nguyễn Thị Yến Linh",
  address: "Ấp Phú Phong, xã Tiên Thủy, tỉnh Vĩnh Long",
};

const groomFamily: Family = {
  label: "NHÀ TRAI",
  father: "Ông Lữ Ngọc Dũng Tâm",
  mother: "Bà Ngô Thị Nguyệt Minh",
  address: "Ấp Phước Hòa, xã Tiên Thủy, tỉnh Vĩnh Long",
};

/* ---------------- Thiệp nhà gái — lễ VU QUY ---------------- */

const nhaGai: Side = {
  key: "nha-gai",
  label: "Thiệp nhà gái",
  ceremony: "VU QUY",
  host: "bride",
  monogram: "M&T",
  partyInvite: "đến dự buổi tiệc chung vui cùng gia đình tại",
  events: [
    {
      id: "le-vu-quy",
      title: "Lễ Vu Quy",
      datetime: "2026-11-29T07:30:00+07:00",
      timeLabel: "7 giờ 30 · Chủ Nhật",
      lunarLabel: "Nhằm ngày 21 tháng 10 năm Bính Ngọ",
      venue: "Tư gia",
      address: "Ấp Phú Phong, xã Tiên Thủy, tỉnh Vĩnh Long",
    },
    {
      id: "tiec-nha-gai",
      title: "Tiệc Chung Vui",
      datetime: "2026-11-28T15:00:00+07:00",
      timeLabel: "15 giờ · Thứ Bảy",
      lunarLabel: "Nhằm ngày 20 tháng 10 năm Bính Ngọ",
      venue: "Tư gia",
      address: "Ấp Phú Phong, xã Tiên Thủy, tỉnh Vĩnh Long",
      note: "Rất mong được gặp bạn!",
    },
  ],
  mainEventId: "tiec-nha-gai",
  gift: {
    // QR VietQR tĩnh sinh từ BIN ACB (970416) + số tài khoản, kèm sẵn nội dung chuyển khoản.
    qrImage: "/images/qr-nha-gai.svg",
    bankName: "ACB",
    accountName: "LE NGOC MINH",
    accountNumber: "2181867",
    note: "Mung cuoi Thai Minh",
  },
};

/* ---------------- Thiệp nhà trai — lễ TÂN HÔN ---------------- */

const nhaTrai: Side = {
  key: "nha-trai",
  label: "Thiệp nhà trai",
  ceremony: "TÂN HÔN",
  host: "groom",
  monogram: "T&M",
  partyInvite: "đến dự buổi tiệc chung vui cùng gia đình chúng tôi tại",
  events: [
    {
      id: "le-tan-hon",
      title: "Lễ Tân Hôn",
      datetime: "2026-11-29T09:00:00+07:00",
      timeLabel: "9 giờ · Chủ Nhật",
      lunarLabel: "Nhằm ngày 21 tháng 10 năm Bính Ngọ",
      venue: "Tư gia",
      address: "Ấp Phước Hòa, xã Tiên Thủy, tỉnh Vĩnh Long",
      note: "Lễ gia tiên, đón dâu về nhà chồng.",
    },
    {
      id: "tiec-nha-trai",
      title: "Tiệc Chung Vui",
      datetime: "2026-11-29T11:00:00+07:00",
      timeLabel: "11 giờ · Chủ Nhật",
      lunarLabel: "Nhằm ngày 21 tháng 10 năm Bính Ngọ",
      venue: "Homestay Về Nhà",
      address: "Ấp Phước Lễ, xã Tiên Thủy, tỉnh Vĩnh Long",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Homestay%20V%E1%BB%81%20Nh%C3%A0%2C%20%E1%BA%A5p%20Ph%C6%B0%E1%BB%9Bc%20L%E1%BB%85%2C%20x%C3%A3%20Ti%C3%AAn%20Th%E1%BB%A7y%2C%20V%C4%A9nh%20Long",
      note: "Rất mong được gặp bạn!",
    },
  ],
  mainEventId: "tiec-nha-trai",
  gift: {
    // TODO: thay QR + số tài khoản thật của chú rể.
    qrImage: "/images/qr.svg",
    bankName: "Vietcombank",
    accountName: "LU NGOC VINH THAI",
    accountNumber: "0000000000",
    note: "Mung cuoi Thai Minh",
  },
};

export const config = {
  /* ---------------- Thông tin chung ---------------- */
  site: {
    /** Dùng cho thẻ <title> và preview khi gửi link Zalo/Messenger */
    title: "Thiệp cưới Vĩnh Thái & Ngọc Minh",
    description:
      "Trân trọng kính mời bạn đến chung vui trong ngày hạnh phúc của chúng mình.",
    /** Domain sau khi deploy, dùng để sinh link mời trong trang /tao-link */
    baseUrl: "https://thiep-cuoi-cua-ban.vercel.app",
    /** Ảnh preview khi share link (đặt trong public/images/) */
    ogImage: "/images/og-cover.jpg",
  },

  /** Phiên bản dùng khi khách mở thẳng tên miền, không qua link mời. */
  defaultSide: "nha-trai" as SideKey,

  /* ---------------- Cô dâu chú rể ---------------- */
  couple: {
    hashtag: "from 28/02/2015 to forever",
  },

  groom: {
    name: "Lữ Ngọc Vĩnh Thái",
    shortName: "Vĩnh Thái",
    role: "Chú rể",
    birthOrder: "Quý nam",
    photo: "/images/groom.webp",
  } satisfies Person,

  bride: {
    name: "Lê Ngọc Minh",
    shortName: "Ngọc Minh",
    role: "Cô dâu",
    birthOrder: "Trưởng nữ",
    photo: "/images/bride.webp",
  } satisfies Person,

  groomFamily,
  brideFamily,

  /* ---------------- Hai phiên bản thiệp ---------------- */
  sides: {
    "nha-gai": nhaGai,
    "nha-trai": nhaTrai,
  } satisfies Record<SideKey, Side>,

  /* ---------------- Chuyện tình mình ---------------- */
  story: {
    title: "Chuyện\nChúng Mình",
    paragraphs: [
      "Chúng mình gặp nhau giữa dãy hành lang dài của lớp học, vào những ngày hè oi ả ở lớp học thêm. Bắt đầu từ một tình bạn, rồi năm dài tháng rộng, chẳng biết từ khi nào lại trở thành người thương.",
      "Ấy vậy mà đã hơn 11 năm trôi qua kể từ ngày bọn mình gọi tên mối quan hệ của hai đứa là “người yêu”. Hơn một thập kỷ cùng nhau đi qua những cột mốc của tuổi trẻ — từ những tháng ngày còn đi học, động viên nhau qua từng năm rằng rồi mình sẽ sớm trưởng thành, cho đến hành trình xa nhà, bôn ba giữa một thành phố xa lạ.",
      "Chúng mình đã ở bên nhau qua những buổi sáng mát lành, những ngày nắng đến phát điên và cả những cơn mưa tầm tã. Có niềm vui, có những ngày chẳng dễ dàng, có cả những đổi thay của tuổi trẻ. Nhưng từng ngày đồng hành như thế cứ lặng lẽ góp nhặt, vun đắp nên một tình yêu đã trở thành phần không thể thiếu trong cuộc đời của cả hai.",
      "Và rồi, sau hơn một thập kỷ đồng hành, chúng mình sắp bước sang một chương mới của hành trình. Không còn chỉ là câu chuyện của hai người yêu nhau, mà là câu chuyện về một mái ấm được cả hai cùng vun vén và dựng xây.",
      "Từ đây, chúng mình không chỉ gọi nhau là người yêu nữa, mà là bạn đời vĩnh cửu — người mà chúng mình đã chọn để cùng đi tiếp những năm tháng về sau, bằng yêu thương, sự trân trọng và một lời nguyện ý dành cho nhau.",
    ],
    photos: ["/images/story-1.webp", "/images/story-2.webp", "/images/story-3.webp"],
  },

  /* ---------------- Album ảnh ---------------- */
  /**
   * Danh sách ảnh nằm ở data/album.ts — file đó do `npm run anh` sinh ra từ
   * bảng ALBUM trong scripts/optimize-photos.mjs. Muốn đổi ảnh hoặc thứ tự thì
   * sửa bên đó, đừng sửa album.ts.
   */
  gallery: {
    /** Số tấm hiện sẵn ngoài lưới. Bấm vào một tấm là xem được cả album. */
    previewCount: 6,
  },

  /* ---------------- Ảnh chủ đạo ---------------- */
  hero: {
    photo: "/images/hero.webp",
    sidePhoto: "/images/hero-2.webp",
  },

  /* ---------------- Nhạc nền ---------------- */
  music: {
    /** Đặt file mp3 vào public/audio/ rồi sửa đường dẫn này */
    src: "/audio/nhac-nen.mp3",
    title: "Nhạc nền",
    /** Tự phát ngay khi khách mở phong bì (đây là thao tác chạm nên trình duyệt cho phép) */
    autoPlayOnOpen: true,
    volume: 0.45,
  },

  /* ---------------- Mừng cưới ---------------- */
  gift: {
    heading: "Hộp Mừng Cưới",
    message:
      "Sự có mặt của bạn đã là món quà lớn nhất. Nếu muốn gửi thêm lời chúc bằng một chút tấm lòng, chúng mình xin trân trọng đón nhận.",
  },

  /* ---------------- RSVP ---------------- */
  rsvp: {
    heading: "Đôi Lời Nhắn Gửi",
    message:
      "Tụi mình rất mong được gặp bạn trong ngày vui, và sẽ trân quý lắm nếu nhận được đôi lời chúc từ bạn ở ngay bên dưới.",
    deadline: "Mong hồi âm trước 15 . 11 . 2026",
    /**
     * Dán URL Web App của Google Apps Script vào đây.
     * Hướng dẫn lấy URL: xem file scripts/apps-script.gs và README.md
     * Để rỗng thì form vẫn chạy nhưng chỉ hiện thông báo, không gửi đi đâu.
     */
    endpoint:
      "https://script.google.com/macros/s/AKfycbyYnTqss-0dpD_kBKIhk2N7H89-3XI4WZIDoSKJdNH6CJi4zXG89BW4ppEDOTAtHqYL/exec",
    /** Bật để hiển thị danh sách lời chúc đọc ngược về từ Google Sheet */
    showWishes: true,
  },

  /* ---------------- Liên hệ ---------------- */
  contact: {
    groomPhone: "0357857086",
    bridePhone: "0392808994",
  },

  /* ---------------- Khách mời ---------------- */
  guest: {
    fallback: "Quý khách",
  } satisfies Guest,
};

export type SiteConfig = typeof config;
