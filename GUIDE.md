# Codex Olympiad - Ашиглах заавар

## 1. Админ нэвтрэх

```bash
curl -X POST https://codex-olympiad.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@codex.mn","password":"changeme123"}'
```

Хариу:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOi...",
    "admin": { "id": 1, "email": "admin@codex.mn" }
  }
}
```

**TOKEN-г хадгал**, дараагийн бүх admin хүсэлтэд хэрэглэнэ.

---

## 2. Тэмцээн үүсгэх

```bash
curl -X POST https://codex-olympiad.onrender.com/api/contests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "name": "CodeX[4] Олимпиад",
    "description": "Монголын програмчлалын 4-р олимпиад",
    "start_time": "2026-04-15T02:00:00.000Z",
    "end_time": "2026-04-15T05:00:00.000Z",
    "status": "registration"
  }'
```

> `status: "registration"` байхад л бүртгэл нээлттэй болно.

---

## 3. Бодлого + Subtask нэмэх

```bash
curl -X POST https://codex-olympiad.onrender.com/api/contests/1/problems \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "title": "Matrix Rotation",
    "max_points": 100,
    "sort_order": 0,
    "subtasks": [
      { "label": "Sub1", "points": 20, "test_count": 5 },
      { "label": "Sub2", "points": 30, "test_count": 3 },
      { "label": "Sub3", "points": 50, "test_count": 10 }
    ]
  }'
```

> **subtask-ийн points нийлбэр = max_points** байх ёстой (20+30+50=100).

---

## 4. Оролцогч бүртгүүлэх (Public - вэбсайтаас)

Вэбсайтын **/registration** хуудаснаас бүртгүүлнэ. Эсвэл API-аар:

```bash
curl -X POST https://codex-olympiad.onrender.com/api/contestants \
  -H "Content-Type: application/json" \
  -d '{
    "contest_id": 1,
    "first_name": "Бат",
    "last_name": "Дорж",
    "email": "bat@example.com",
    "phone": "99001122",
    "organization": "МУИС",
    "category": "Ахлах"
  }'
```

Хариу:
```json
{
  "success": true,
  "data": {
    "reg_number": "CX4-0001",
    "first_name": "Бат"
  }
}
```

> **CX4-0001** дугаарыг хадгална. Category: `Бага` | `Дунд` | `Ахлах`

---

## 5. Дүн оруулах (Админ)

Оролцогчийн шийдлийн дүнг subtask тус бүрээр оруулна:

```bash
curl -X POST https://codex-olympiad.onrender.com/api/submissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "reg_number": "CX4-0001",
    "problem_id": 1,
    "subtask_results": [
      { "subtask_id": 1, "passed": true },
      { "subtask_id": 2, "passed": true },
      { "subtask_id": 3, "passed": false }
    ]
  }'
```

Хариу: `total_points: 50` (20+30+0)

> Нэг оролцогч нэг бодлогод **олон удаа** submit хийж болно. Subtask тус бүрийн **хамгийн сайн** оноог авна (IOI scoring).

---

## 6. Leaderboard харах (Public - вэбсайтаас)

Вэбсайтын **/leaderboard** хуудаснаас харна. Эсвэл API-аар:

```bash
# Бүх оролцогч
curl https://codex-olympiad.onrender.com/api/leaderboard/1

# Category-аар шүүх
curl "https://codex-olympiad.onrender.com/api/leaderboard/1?category=Ахлах"

# Нэрээр хайх
curl "https://codex-olympiad.onrender.com/api/leaderboard/1?search=Бат"

# Бодлогын статистик
curl https://codex-olympiad.onrender.com/api/leaderboard/1/problems
```

---

## 7. Leaderboard дахин тооцоолох (Админ)

```bash
curl -X POST https://codex-olympiad.onrender.com/api/leaderboard/1/recalculate \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 8. Бусад хэрэгтэй API

```bash
# Тэмцээнүүдийн жагсаалт
curl https://codex-olympiad.onrender.com/api/contests

# Тэмцээний статус солих (жнь: registration → active)
curl -X PUT https://codex-olympiad.onrender.com/api/contests/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"status": "active"}'

# Бүртгэлтэй оролцогчдыг харах
curl "https://codex-olympiad.onrender.com/api/contestants?contest_id=1" \
  -H "Authorization: Bearer <TOKEN>"

# Дугаараар хайх
curl https://codex-olympiad.onrender.com/api/contestants/lookup/CX4-0001 \
  -H "Authorization: Bearer <TOKEN>"
```

---

## Ажиллах дараалал (товч)

```
1. Админ нэвтрэх → TOKEN авах
2. Тэмцээн үүсгэх (status: "registration")
3. Бодлого + subtask нэмэх
4. Оролцогчид вэбсайтаас бүртгүүлнэ
5. Тэмцээн эхлэхэд status → "active" болгох
6. Дүн оруулах (submission)
7. Leaderboard автоматаар шинэчлэгдэнэ
8. Дуусахад status → "finished"
```

---

## IOI Scoring тайлбар

| Дүрэм | Тайлбар |
|-------|---------|
| Subtask оноолол | Тэнцвэл бүтэн оноо, тэнцэхгүй бол 0 |
| Олон submission | Subtask тус бүрийн хамгийн өндөр оноог авна |
| Нийт оноо | Бүх бодлогын хамгийн сайн оноонуудын нийлбэр |
| Penalty | Оноо сайжруулсан submission-уудын хугацааны нийлбэр (минутаар) |
| Эрэмбэ | Оноо буурахаар, penalty өсөхөөр |

## Contest Status

| Status | Тайлбар |
|--------|---------|
| `draft` | Ноорог, хэнд ч харагдахгүй |
| `registration` | Бүртгэл нээлттэй |
| `active` | Тэмцээн явагдаж байна |
| `grading` | Дүн шалгаж байна |
| `finished` | Дууссан |
