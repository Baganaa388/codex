
import React from 'react';
import { Trophy, Code2, Clock, Users, Zap, Shield, Globe, Award } from 'lucide-react';
import { LeaderboardEntry, ProblemStat } from './types';

export const NAV_LINKS = [
  { name: 'Нүүр хуудас', path: '/' },
  { name: 'Лидерүүд', path: '/leaderboard' },
  { name: 'Бүртгэл', path: '/registration' },
  { name: 'Холбоо барих', path: '/contact' },
];

export const STATS = [
  { label: 'Оролцогч', value: '400+', icon: <Users size={24} className="text-cyan-400" /> },
  { label: 'Бодлогын тоо', value: '12', icon: <Code2 size={24} className="text-purple-400" /> },
  { label: 'Хугацаа', value: '2-4 цаг', icon: <Clock size={24} className="text-cyan-400" /> },
  { label: 'Шагналын сан', value: '₮5,000,000', icon: <Trophy size={24} className="text-yellow-400" /> },
];

export const FAQ_DATA = [
  { q: "Хэн оролцож болох вэ?", a: "Ахлах ангийн сурагчид, их дээд сургуулийн оюутнууд болон програмчлал сонирхогч хэн бүхэнд нээлттэй." },
  { q: "Ямар хэлээр бодож болох вэ?", a: "C++, Java, болон Python хэлүүдийг дэмжинэ. Бусад хэлүүдийг одоогоор дэмжихгүй байна." },
  { q: "Интернет ашиглаж болох уу?", a: "Үгүй, олимпиадын явцад зөвхөн системд хандах эрхтэй бөгөөд гадны эх сурвалж ашиглахыг хориглоно." },
  { q: "Бүртгэл хэзээ дуусах вэ?", a: "Бүртгэл олимпиад эхлэхээс 5 хоногийн өмнө буюу 2026.02.10-ны өдөр дуусна." },
  { q: "Оноог хэрхэн тооцох вэ?", a: "Бодлого бүр өөрийн гэсэн оноотой. Зөв бодсон тохиолдолд оноо өгөгдөх бөгөөд буруу илгээлт бүрт торгууль цаг нэмэгдэнэ." },
  { q: "Плагиаризм (хуулбарлалт) шалгах уу?", a: "Тийм, бүх оролцогчдын кодыг тусгай алгоритмаар шалгах бөгөөд зөрчил илэрсэн тохиолдолд эрхийг хасна." },
];

export const TIMELINE = [
  { title: "Бүртгэл", desc: "Онлайнаар бүртгүүлэх", date: "03/01 - 04/10", active: true },
  { title: "Шалгаруулалт", desc: "Эхний шатны бодолт", date: "04/12", active: false },
  { title: "Финал", desc: "Улаанбаатар хотод", date: "04/15", active: false },
  { title: "Шагнал", desc: "Ялагчдыг тодруулах", date: "04/15", active: false },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Б.Тэмүүлэн", organization: "МУИС", points: 1150, penalty: "125", location: "Улаанбаатар", isTop3: true },
  { rank: 2, name: "Н.Номин", organization: "ШУТИС", points: 1120, penalty: "140", location: "Улаанбаатар", isTop3: true },
  { rank: 3, name: "О.Билгүүн", organization: "Мэдээлэл Холбоо", points: 1080, penalty: "185", location: "Дархан", isTop3: true },
  { rank: 4, name: "Г.Анударь", organization: "Эрхэт Эрдэм", points: 950, penalty: "210", location: "Эрдэнэт", isTop3: false },
  { rank: 5, name: "М.Баясгалан", organization: "Сант Сургууль", points: 920, penalty: "245", location: "Улаанбаатар", isTop3: false },
  { rank: 6, name: "П.Энхжин", organization: "Оюунлаг", points: 890, penalty: "280", location: "Улаанбаатар", isTop3: false },
  { rank: 7, name: "Т.Бат-Эрдэнэ", organization: "Логарифм", points: 870, penalty: "310", location: "Улаанбаатар", isTop3: false },
  { rank: 8, name: "Ж.Мөнхбат", organization: "Шинэ Монгол", points: 850, penalty: "340", location: "Дархан", isTop3: false },
  { rank: 9, name: "С.Хонгорзул", organization: "МУИС", points: 810, penalty: "370", location: "Улаанбаатар", isTop3: false },
  { rank: 10, name: "Д.Ганболд", organization: "Мэдээлэл Технологи", points: 790, penalty: "410", location: "Эрдэнэт", isTop3: false },
  { rank: 11, name: "Б.Сувд", organization: "ШУТИС", points: 760, penalty: "445", location: "Улаанбаатар", isTop3: false },
  { rank: 12, name: "Э.Төгсжаргал", organization: "Монгол-Түрк", points: 740, penalty: "480", location: "Улаанбаатар", isTop3: false },
  { rank: 13, name: "У.Уранзаяа", organization: "Орчлон", points: 720, penalty: "510", location: "Улаанбаатар", isTop3: false },
  { rank: 14, name: "Х.Тэргэл", organization: "Бритиш Сургууль", points: 690, penalty: "540", location: "Улаанбаатар", isTop3: false },
  { rank: 15, name: "Б.Ганбаяр", organization: "Шинэ Үе", points: 650, penalty: "590", location: "Улаанбаатар", isTop3: false },
];

export const PROBLEM_STATS: ProblemStat[] = [
  { title: "Matrix Rotation", solvedCount: 420 },
  { title: "Shortest Path Z", solvedCount: 156 },
  { title: "Dynamic Trees", solvedCount: 34 },
];
