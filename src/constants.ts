export const NAV_LINKS = [
  { name: "Нүүр хуудас", path: "/" },
  { name: "Лидерууд", path: "/leaderboard" },
  { name: "Бүртгэл", path: "/registration" },
  { name: "Холбоо барих", path: "/contact" },
];

export const STATS = [
  { label: "Оролцогч", value: "400+", iconName: "Users" as const },
  { label: "Бодлогын тоо", value: "12", iconName: "Code2" as const },
  { label: "Хугацаа", value: "2-4 цаг", iconName: "Clock" as const },
  { label: "Шагналын сан", value: "₮2,000,000", iconName: "Trophy" as const },
];

export const FAQ_DATA = [
  {
    q: "Хэн оролцож болох вэ?",
    a: "Ерөнхий Боловсролын 3-12 ангийн програмчлал сонирхогч хэн бүхэнд нээлттэй.",
  },
  {
    q: "Ямар хэлээр бодож болох вэ?",
    a: "C, C++, Java, Python зэрэг хэлүүдийг дэмжинэ. Бусад хэлүүдийг одоогоор дэмжихгүй.",
  },
  {
    q: "Интернет ашиглаж болох уу?",
    a: "Үгүй, олимпиадын явцад зөвхөн системд хандах эрхтэй бөгөөд гадны эх сурвалж ашиглахыг хориглоно.",
  },
  {
    q: "Бүртгэл хэзээ дуусах вэ?",
    a: "Тухайн олимпиадын бүртгэл эхлэхээс өмнө тодорхой хугацаа зарлагдах бөгөөд ихэвчлэн 1-2 сарын хугацаатай байна.",
  },
  {
    q: "Оноог хэрхэн тооцох вэ?",
    a: "Бодлого бүр өөрийн гэсэн оноотой. Зөв бодсон тохиолдолд оноо өгөгдөнө бөгөөд буруу илгээлт бүр торгуулийн цаг нэмэгдэнэ.",
  },
  {
    q: "Плагиаризм (хуулбарлалт) шалгах уу?",
    a: "Тийм, бүх оролцогчдын кодыг тусгай алгоритмаар шалгах бөгөөд зөрчил илэрсэн тохиолдолд эрхийг хасна.",
  },
];

export const DEFAULT_TIMELINE = [
  { title: "Бүртгэл", desc: "Онлайнаар бүртгүүлэх", date: "03/01 - 04/10", active: true },
  { title: "Финал", desc: "Улаанбаатар хотод", date: "04/15", active: false },
  { title: "Шагнал", desc: "Ялагчдыг тодруулах", date: "04/15", active: false },
];

export const MOCK_LEADERBOARD = [
  { rank: 1, name: "Б.Тэмүүлэн", organization: "МУИС", points: 1150, penalty: "125", location: "Улаанбаатар", isTop3: true },
  { rank: 2, name: "Н.Номин", organization: "ШУТИС", points: 1120, penalty: "140", location: "Улаанбаатар", isTop3: true },
  { rank: 3, name: "О.Билгүүн", organization: "Мэдээлэл Холбоо", points: 1080, penalty: "185", location: "Дархан", isTop3: true },
  { rank: 4, name: "Г.Анудаарь", organization: "Эрхэт Эрдэм", points: 950, penalty: "210", location: "Эрдэнэт", isTop3: false },
  { rank: 5, name: "М.Баясгалан", organization: "Сант Сургууль", points: 920, penalty: "245", location: "Улаанбаатар", isTop3: false },
];

export const PROBLEM_STATS = [
  { title: "Matrix Rotation", solvedCount: 420 },
  { title: "Shortest Path Z", solvedCount: 156 },
  { title: "Dynamic Trees", solvedCount: 34 },
];
