# VYBE — Master Project Brief & AI Development Specification

> **Dokumen utama untuk diberikan kepada AI/coding agent pada awal project.**  
> Dokumen ini menjadi sumber acuan utama untuk visi produk, scope, arsitektur, fitur, database, keamanan, integrasi, aturan pengembangan, dan acceptance criteria.

---

# 1. Identitas Project

**Nama sementara:** VYBE  
**Jenis:** Social web application / anonymous social interaction platform powered by music  
**Platform awal:** Responsive web application, mobile-first  
**Target utama:** Pengguna Instagram yang ingin menerima interaksi anonim, rekomendasi lagu, kesan, confession, dan respons sosial yang dapat dibagikan kembali ke Instagram Story.

> Nama **VYBE** masih bersifat sementara dan dapat diganti kemudian. Jangan membuat keputusan teknis yang terlalu bergantung pada nama ini.

---

# 2. Instruksi Utama untuk AI

AI yang membaca dokumen ini harus mengikuti aturan berikut:

1. Jangan mengubah visi produk tanpa alasan teknis yang kuat.
2. Jangan menambahkan fitur besar di luar MVP tanpa permintaan eksplisit.
3. Prioritaskan kesederhanaan, keamanan, maintainability, dan kecepatan iterasi.
4. Gunakan stack yang tercantum di dokumen ini kecuali terdapat alasan teknis yang jelas untuk menggantinya.
5. Jika ada bagian yang belum final, gunakan implementasi paling sederhana dan mudah diganti.
6. Jangan membuat integrasi Instagram dengan scraping, bot, automation tidak resmi, atau meminta password Instagram.
7. Jangan membuat aplikasi bergantung penuh pada Spotify Web API.
8. Produk inti harus tetap dapat berjalan walaupun Spotify OAuth/API lanjutan tidak tersedia.
9. Anonymous bukan berarti sistem internal tidak memiliki mekanisme anti-abuse.
10. Seluruh fitur anonymous wajib memiliki rate limit, report, block, dan moderation consideration.
11. Gunakan TypeScript secara ketat.
12. Jangan menyimpan secret/API key di frontend.
13. Jangan membuat microservices pada MVP.
14. Jangan menggunakan Kubernetes, Kafka, Elasticsearch, atau infrastruktur kompleks pada tahap awal.
15. Setiap perubahan database harus mempunyai migration yang jelas.
16. Setiap halaman harus mobile-first.
17. UX harus terasa seperti consumer social product, bukan dashboard enterprise.
18. Hindari tampilan generik/template.
19. Jangan mulai mengembangkan mobile native app pada MVP.
20. Jika terjadi konflik antara fitur baru dan keamanan/privacy, keamanan dan privacy diprioritaskan.

---

# 3. Visi Produk

VYBE adalah sebuah social interaction platform yang memungkinkan seseorang membuat profil publik dan menerima respons dari teman/follower melalui link yang dapat dibagikan ke Instagram Story.

Respons dapat berbentuk:

- anonymous message,
- song dedication,
- describe me with a song,
- first impression,
- secret confession,
- vibe check,
- midnight thought,
- atau jenis interaction prompt lainnya.

Musik, terutama Spotify, berfungsi sebagai lapisan ekspresi sosial.

Konsep utama:

> **Instagram digunakan sebagai distribution layer.  
> VYBE digunakan sebagai interaction layer.  
> Spotify digunakan sebagai music/expression layer.**

---

# 4. Core Product Loop

Loop utama produk harus sangat sederhana:

```text
User membuat akun
        ↓
User membuat profile VYBE
        ↓
User memasukkan Instagram username
        ↓
User membuat sebuah Drop
        ↓
VYBE menghasilkan shareable link / Story Card
        ↓
User membagikannya ke Instagram Story
        ↓
Follower membuka link
        ↓
Follower mengirim anonymous response / song
        ↓
Pemilik akun menerima response di Inbox
        ↓
Pemilik akun membuat Result Story Card
        ↓
Result dibagikan kembali ke Instagram Story
        ↓
Orang baru masuk ke VYBE
        ↓
Loop berulang
```

Tujuan utama MVP adalah membuktikan bahwa loop ini menyenangkan dan memiliki potensi viral.

---

# 5. Value Proposition

VYBE bukan sekadar anonymous Q&A.

Pembeda utamanya:

1. **Music-first interaction**
2. **Story-first sharing**
3. **Beautiful visual result**
4. **Anonymous tetapi tetap memiliki safety layer**
5. **Low-friction participation**
6. **Instagram-friendly**
7. **Tidak membutuhkan follower system pada MVP**
8. **Tidak bergantung pada feed algorithm pada MVP**

Contoh positioning:

> **Say it with a song.**

Alternatif:

> **Let people tell you how they see you.**

> **Anonymous thoughts. Real vibes.**

> **Your friends know your soundtrack.**

---

# 6. Target User

Target awal:

- usia kira-kira 16–30,
- pengguna aktif Instagram,
- terbiasa menggunakan Instagram Story,
- menyukai musik,
- tertarik pada anonymous interaction,
- suka membagikan personality result,
- suka social games,
- suka confession / first impression / song recommendation.

Primary use cases:

- Instagram creator kecil,
- mahasiswa,
- pelajar usia yang diizinkan sesuai policy platform,
- circle pertemanan,
- komunitas online,
- orang yang ingin menerima rekomendasi lagu dari teman.

---

# 7. Scope MVP

MVP tidak boleh terlalu besar.

Fitur utama MVP:

## 7.1 Authentication

Minimal:

- sign up dengan email,
- login dengan email,
- logout,
- forgot password,
- optional Google login,
- username unik.

Jangan membuat Instagram sebagai authentication wajib.

---

## 7.2 User Profile

Setiap akun memiliki:

- username VYBE,
- display name,
- avatar,
- bio singkat,
- Instagram username,
- public profile URL,
- anonymous message setting,
- profile theme sederhana,
- created_at.

Format URL ideal:

```text
https://domain.com/@username
```

Jika routing `@username` sulit pada framework/deployment tertentu, boleh gunakan:

```text
https://domain.com/u/username
```

Tetapi preferensi UX adalah `@username`.

---

# 8. Public Profile

Public profile harus sangat sederhana.

Contoh:

```text
              [ Avatar ]

              @flowlow

         What's your vibe about me?

Instagram: @flowlow

----------------------------------

🎧 Send me a song

🎶 Describe me with a song

💭 Tell me something

❤️ Secret confession

👀 First impression

🌙 Midnight thought
```

Public visitor tidak harus membuat akun untuk mengirim response pada MVP.

Namun sistem harus membuat anonymous session identifier internal.

---

# 9. Drops

**Drop** adalah unit utama interaksi.

Contoh jenis Drop:

```text
SEND_ME_A_SONG
DESCRIBE_ME_WITH_A_SONG
ANONYMOUS_MESSAGE
SECRET_CONFESSION
FIRST_IMPRESSION
MIDNIGHT_THOUGHT
VIBE_CHECK
```

Schema konseptual:

```text
Drop
- id
- owner_id
- type
- question
- description
- allows_anonymous
- requires_song
- is_active
- expires_at
- created_at
```

Drop dapat:

- dibuat dari template,
- memiliki custom prompt,
- memiliki expiration optional,
- dibagikan melalui URL unik.

Contoh URL:

```text
/domain.com/d/abc123
```

---

# 10. MVP Drop Templates

Untuk versi pertama, implementasikan maksimal empat template utama terlebih dahulu:

## 10.1 Send Me A Song

Prompt default:

> Send me a song I should listen to.

Input:

- Spotify link,
- optional message.

---

## 10.2 Describe Me With A Song

Prompt:

> Describe me with one song.

Input:

- Spotify link,
- optional short reason.

---

## 10.3 Anonymous Message

Prompt:

> Tell me something anonymously.

Input:

- text message.

---

## 10.4 First Impression

Prompt:

> What was your first impression of me?

Input:

- text response.

---

# 11. Future Drop Templates

Jangan implementasikan tanpa permintaan, tetapi desain database harus cukup fleksibel.

Future examples:

- Secret Confession
- Midnight Thought
- What’s My Vibe
- Rate My Energy
- Memory About Me
- Song For Our Friendship
- Guess Who
- How Do You See Me
- Ask Me Anything
- One Word About Me
- What Reminds You Of Me
- Friendship Soundtrack
- Relationship Soundtrack
- Story Chain

---

# 12. Anonymous Response

User yang belum login dapat mengirim anonymous response.

Frontend hanya menampilkan:

```text
Anonymous
```

Backend dapat menyimpan identifier internal seperti:

```text
anonymous_session_id
```

Contoh:

```text
anon_8b7fxxxxxxxx
```

Identifier tersebut:

- tidak boleh dikirim ke pemilik Drop,
- tidak boleh muncul pada client response,
- hanya digunakan untuk moderation, spam prevention, block, dan abuse investigation.

Jangan menyimpan informasi yang tidak diperlukan.

---

# 13. Response Model

Contoh schema:

```text
responses
- id
- drop_id
- owner_id
- sender_user_id nullable
- anonymous_session_id nullable
- message nullable
- spotify_url nullable
- song_title nullable
- song_artist nullable
- song_thumbnail_url nullable
- status
- created_at
```

Status dapat berupa:

```text
ACTIVE
HIDDEN
DELETED
FLAGGED
```

---

# 14. Inbox

Pemilik akun melihat semua response.

Contoh:

```text
Inbox

27 new drops

------------------------

🎧 About You
The 1975

"this song reminds me of you"

Anonymous
2 minutes ago

[ Open ] [ Share ]

------------------------

💭 Anonymous

"gue kira dulu lu orangnya jutek..."

12 minutes ago

[ Open ] [ Share ]
```

Inbox MVP harus mendukung:

- list response,
- unread/read,
- delete,
- report optional jika sender account dikenal,
- hide,
- share result.

---

# 15. Spotify Strategy

Spotify adalah fitur penting tetapi **tidak boleh menjadi single point of failure**.

## 15.1 MVP Spotify Strategy

Gunakan:

- Spotify URL,
- Spotify Embed/oEmbed bila memungkinkan,
- metadata dari mekanisme resmi yang diizinkan,
- open in Spotify link.

User flow:

```text
Paste Spotify Link
        ↓
Validate URL
        ↓
Fetch supported metadata
        ↓
Display Song Card
        ↓
Attach to response
```

Input MVP:

```text
https://open.spotify.com/track/...
```

---

# 16. Spotify OAuth

Spotify OAuth adalah **future enhancement**, bukan requirement MVP.

Potential future features:

- top tracks,
- recently played,
- profile information,
- selected playlists,
- music compatibility,
- shared music taste.

Jangan membuat `Connect Spotify` wajib.

Jika Spotify API access berubah, fitur inti masih harus bekerja.

---

# 17. Music Provider Abstraction

Jangan hardcode keseluruhan sistem ke Spotify.

Buat abstraction sederhana:

```ts
type MusicProvider = "spotify";
```

Kemudian model dapat dikembangkan menjadi:

```ts
type MusicProvider =
  | "spotify"
  | "apple_music"
  | "youtube_music";
```

Contoh data:

```ts
interface MusicAttachment {
  provider: MusicProvider;
  url: string;
  title?: string;
  artist?: string;
  artworkUrl?: string;
}
```

Pada MVP provider cukup `spotify`.

---

# 18. Instagram Strategy

Instagram digunakan terutama sebagai:

- identity reference,
- distribution,
- Story sharing destination.

## 18.1 Instagram Username

User cukup mengisi:

```text
@instagramusername
```

Jangan meminta password Instagram.

Jangan scrape private information.

Jangan melakukan login tidak resmi.

---

# 19. Instagram Story Sharing

Web app MVP harus mampu:

1. generate Story Card,
2. menyediakan download/save,
3. menggunakan Web Share API jika tersedia,
4. membuat flow yang mudah untuk dibagikan ke Instagram.

Karena website tidak mempunyai kontrol native Story seperti mobile application, jangan menganggap browser dapat otomatis memposting Story.

V1:

```text
Generate Story
    ↓
Preview
    ↓
Share / Save
    ↓
Instagram
```

V2 future mobile app dapat menggunakan native sharing.

---

# 20. Story Card Generator

Story Card merupakan viral engine utama.

Output:

```text
1080 × 1920
9:16
PNG / WebP
```

Story dapat berisi:

- VYBE branding,
- user display name / username,
- prompt,
- response,
- album artwork,
- song title,
- artist,
- QR code optional,
- short URL,
- CTA.

Contoh:

```text
┌─────────────────────────────────┐
│                                 │
│              VYBE               │
│                                 │
│        [ ALBUM ARTWORK ]        │
│                                 │
│            ABOUT YOU            │
│           THE 1975              │
│                                 │
│ "this song reminds me of you"   │
│                                 │
│         sent anonymously        │
│                                 │
│       vybe.app/@username        │
│                                 │
└─────────────────────────────────┘
```

---

# 21. Story Themes

MVP themes:

1. Dark
2. Minimal
3. Aurora
4. Midnight

Future:

- Love
- Retro
- Neon
- Mono
- Film
- Paper
- Polaroid
- Gradient
- Spotify-inspired

Jangan membuat terlalu banyak themes pada MVP.

---

# 22. Story Generator Technology

Preferred:

```text
Satori
+
Sharp
```

Pipeline:

```text
Database response
        ↓
Story template
        ↓
Satori SVG
        ↓
Sharp
        ↓
PNG/WebP
```

Alternative dapat dipakai jika Satori memiliki limitation, tetapi:

- output harus deterministic,
- server-side,
- tidak bergantung screenshot browser jika tidak perlu,
- mudah di-cache.

---

# 23. Recommended Tech Stack

## Frontend

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
Motion
```

---

## Backend

```text
Next.js Server Components / Route Handlers
Supabase
```

---

## Database

```text
PostgreSQL
via Supabase
```

---

## Authentication

```text
Supabase Auth
```

---

## Storage

```text
Supabase Storage
```

---

## Realtime

```text
Supabase Realtime
```

Tidak wajib digunakan untuk seluruh fitur.

Gunakan hanya jika memberi manfaat nyata seperti:

- new inbox event,
- notification update.

---

## Hosting

Preferred:

```text
Vercel
```

Development dapat menggunakan:

```text
localhost
```

---

## Source Control

```text
Git
GitHub
```

---

## Package Manager

Preferred:

```text
pnpm
```

---

# 24. Version Recommendation

Gunakan versi stable terbaru yang saling kompatibel pada waktu setup project.

Jangan hardcode versi lama hanya karena contoh dokumentasi.

Gunakan lockfile.

---

# 25. Suggested Project Structure

Contoh:

```text
vybe/
│
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   │
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── inbox/
│   │   ├── create/
│   │   ├── settings/
│   │   └── profile/
│   │
│   ├── @[username]/
│   │
│   ├── d/
│   │   └── [dropId]/
│   │
│   ├── story/
│   │   └── [storyId]/
│   │
│   ├── api/
│   │   ├── drops/
│   │   ├── responses/
│   │   ├── music/
│   │   ├── stories/
│   │   ├── report/
│   │   └── moderation/
│   │
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/
│   ├── profile/
│   ├── drops/
│   ├── music/
│   ├── inbox/
│   ├── story/
│   └── shared/
│
├── lib/
│   ├── supabase/
│   ├── auth/
│   ├── spotify/
│   ├── moderation/
│   ├── rate-limit/
│   ├── story/
│   └── utils/
│
├── types/
│
├── config/
│
├── public/
│
├── supabase/
│   ├── migrations/
│   └── seed.sql
│
├── tests/
│
├── .env.example
├── package.json
└── README.md
```

Jika Next.js routing dengan `@[username]` sulit secara file-system, gunakan route yang valid lalu pertahankan UX melalui rewrite.

---

# 26. Database Design

Minimal tables:

```text
profiles
drops
responses
notifications
reports
blocks
story_cards
```

Supabase Auth menyediakan user identity utama.

---

# 27. Profiles Table

Suggested:

```sql
profiles
--------
id uuid primary key
user_id uuid unique not null
username text unique not null
display_name text
bio text
avatar_url text
instagram_username text
allow_anonymous boolean default true
profile_theme text default 'dark'
is_public boolean default true
created_at timestamptz
updated_at timestamptz
```

Rules:

- username lowercase normalized,
- username unique,
- reserved username list,
- username validation,
- profile public by default dapat ditinjau kembali.

Reserved examples:

```text
admin
api
login
register
settings
dashboard
support
help
about
privacy
terms
moderator
vybe
```

---

# 28. Drops Table

```sql
drops
-----
id uuid primary key
owner_id uuid not null
type text not null
question text
description text
requires_song boolean default false
allows_anonymous boolean default true
is_active boolean default true
expires_at timestamptz nullable
response_count integer default 0
created_at timestamptz
updated_at timestamptz
```

Jangan mempercayai `response_count` dari client.

---

# 29. Responses Table

```sql
responses
---------
id uuid primary key
drop_id uuid not null
owner_id uuid not null
sender_user_id uuid nullable
anonymous_session_hash text nullable
message text nullable
music_provider text nullable
music_url text nullable
song_title text nullable
song_artist text nullable
song_artwork_url text nullable
is_read boolean default false
status text default 'active'
created_at timestamptz
```

Store anonymous identifier sebagai hash/pseudonymous identifier jika memungkinkan.

---

# 30. Story Cards Table

```sql
story_cards
-----------
id uuid primary key
owner_id uuid not null
response_id uuid nullable
drop_id uuid nullable
theme text not null
image_url text
status text
created_at timestamptz
```

Jika Story Card dapat dibuat ulang deterministically, pertimbangkan cache dan TTL agar storage tidak cepat habis.

---

# 31. Notifications Table

```sql
notifications
-------------
id uuid primary key
user_id uuid not null
type text not null
reference_id uuid nullable
is_read boolean default false
created_at timestamptz
```

MVP notification:

```text
NEW_RESPONSE
NEW_SONG
```

---

# 32. Reports Table

```sql
reports
-------
id uuid primary key
reporter_user_id uuid nullable
response_id uuid nullable
drop_id uuid nullable
reason text not null
details text nullable
status text default 'open'
created_at timestamptz
```

Possible status:

```text
open
reviewing
resolved
dismissed
```

---

# 33. Blocks Table

```sql
blocks
------
id uuid primary key
owner_user_id uuid not null
blocked_user_id uuid nullable
blocked_anon_hash text nullable
created_at timestamptz
```

MVP dapat dimulai dengan block sender session dari response tertentu.

---

# 34. Row Level Security

RLS wajib.

Contoh aturan:

## Profiles

Public:

- read public profile.

Owner:

- update hanya profile sendiri.

## Drops

Public:

- read drop aktif yang public.

Owner:

- create/update/delete drop sendiri.

## Responses

Public visitor:

- boleh insert response melalui controlled server endpoint.

Owner:

- hanya dapat membaca response untuk drop sendiri.

Anonymous visitor:

- tidak dapat membaca responses orang lain.

## Reports

User:

- create report.

Admin:

- read/review reports.

Jangan memberi table access terlalu luas hanya untuk mempermudah development.

---

# 35. API / Server Boundary

Operasi sensitif harus server-side:

- creating anonymous response,
- rate limiting,
- moderation,
- Spotify metadata fetching jika secret dibutuhkan,
- story generation,
- admin action,
- report processing.

Frontend tidak boleh memegang:

- service role key,
- OAuth secret,
- admin key,
- moderation secret.

---

# 36. Environment Variables

Contoh `.env.example`:

```bash
NEXT_PUBLIC_APP_URL=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

STORY_SIGNING_SECRET=

ADMIN_EMAILS=
```

Catatan:

`SUPABASE_SERVICE_ROLE_KEY` tidak boleh pernah diekspos ke browser.

Spotify client secret hanya diperlukan jika fitur terkait benar-benar digunakan.

---

# 37. Security Requirements

Minimal:

- HTTPS production,
- secure cookies,
- input validation,
- output escaping,
- CSRF awareness,
- XSS prevention,
- SQL injection protection melalui parameterized query/client,
- RLS,
- rate limit,
- abuse detection,
- bot protection,
- server-side authorization,
- secret management,
- safe redirect validation.

---

# 38. Rate Limiting

Anonymous endpoint wajib memiliki rate limit.

Contoh awal:

```text
5 responses / 10 minutes / anonymous session
```

dan:

```text
20 responses / hour / IP-derived server bucket
```

Angka dapat disesuaikan berdasarkan testing.

Jangan hanya menggunakan IP karena:

- shared networks,
- mobile networks,
- VPN,
- carrier NAT.

Gunakan multi-signal anti-abuse.

---

# 39. Anonymous Session

Anonymous session dapat dibuat menggunakan:

- secure random id,
- stored in secure cookie,
- hash stored server-side/database.

Contoh:

```text
vybe_anon_session
```

Jangan menganggap anonymous session sebagai authentication.

---

# 40. Bot Protection

Gunakan solution seperti:

```text
Cloudflare Turnstile
```

pada:

- suspicious anonymous submissions,
- signup,
- high-frequency sender,
- abuse-prone endpoint.

Jangan selalu tampilkan CAPTCHA pada setiap interaksi jika tidak diperlukan karena akan merusak conversion.

Prefer adaptive friction.

---

# 41. Moderation

Minimum moderation:

1. profanity / abusive text filters,
2. spam pattern detection,
3. repeated message detection,
4. link restriction,
5. report system,
6. delete/hide,
7. block sender session,
8. admin moderation queue.

Untuk MVP dapat menggunakan kombinasi:

- local rules,
- keyword/pattern filters,
- basic heuristics.

AI moderation dapat ditambahkan kemudian jika dibutuhkan.

---

# 42. Privacy Principles

Collect only what is required.

Jangan menyimpan:

- Instagram password,
- Spotify password,
- precise location,
- unnecessary device data,
- sensitive profile details.

Public profile harus jelas membedakan informasi publik.

User harus dapat:

- delete response,
- delete Drop,
- disable anonymous messages,
- update profile,
- eventually delete account.

---

# 43. User Safety

Anonymous platform memiliki risiko:

- bullying,
- harassment,
- sexual content,
- threats,
- doxxing,
- spam.

Karena itu desain UX harus menyediakan:

```text
Block
Report
Delete
Disable anonymous messages
```

dengan mudah.

Jangan membuat desain yang sengaja mendorong harassment untuk engagement.

---

# 44. Content Limits

Suggested:

Anonymous message:

```text
max 500 characters
```

Drop question:

```text
max 160 characters
```

Bio:

```text
max 160 characters
```

Custom reason for song:

```text
max 240 characters
```

Gunakan Unicode-safe character counting.

---

# 45. URLs

Preferred:

```text
/
 /login
 /register
 /dashboard
 /inbox
 /create
 /settings
 /@username
 /d/[dropId]
 /story/[storyId]
```

Alternative jika framework route constraints:

```text
/u/[username]
```

---

# 46. Landing Page

Landing page harus langsung menjelaskan produk.

Hero contoh:

```text
Say it with a song.

Let your friends send anonymous
thoughts, songs, and vibes.

[ Create your VYBE ]
```

Sections:

- how it works,
- example card,
- privacy explanation,
- CTA.

Jangan terlalu banyak teks.

---

# 47. Mobile-First Navigation

Dashboard mobile:

```text
Home
Create
Inbox
Profile
```

Gunakan bottom navigation.

Desktop dapat menggunakan:

- sidebar,
- top nav,
- centered content.

---

# 48. Visual Direction

Karakter visual:

- modern,
- social,
- emotional,
- youthful,
- premium,
- clean.

Avoid:

- corporate dashboard look,
- excessive borders,
- dense tables,
- stock enterprise UI,
- overly neon cyberpunk unless selected theme.

Possible base style:

```text
dark background
soft gradients
glass layers
large typography
rounded cards
subtle glow
album artwork focus
smooth motion
```

---

# 49. Color Direction

Belum final.

Suggested neutral foundation:

```text
Background: near-black
Surface: dark gray
Text: white / off-white
Muted: gray
Accent: purple / pink / blue gradient
Success: green
Danger: red
```

Gunakan CSS variables/design tokens.

Jangan hardcode warna tersebar di banyak component.

---

# 50. Typography

Gunakan font yang:

- mudah dibaca,
- modern,
- tidak terlalu dekoratif.

Contoh:

```text
Inter
Geist
Manrope
```

Story themes dapat memakai font berbeda secara terbatas.

---

# 51. Accessibility

Minimum:

- semantic HTML,
- keyboard navigation,
- focus states,
- color contrast,
- aria labels,
- form labels,
- meaningful alt text,
- reduced motion respect.

---

# 52. Performance

Target:

- fast mobile load,
- optimized images,
- lazy load,
- avoid unnecessary client components,
- use server rendering where appropriate,
- cache public profile,
- cache music metadata,
- avoid repeatedly generating identical Story images.

---

# 53. Image Optimization

Avatar:

- upload compression,
- max dimensions,
- WebP/AVIF if supported.

Story:

- PNG or WebP,
- optimized file size,
- 1080×1920.

Album artwork:

- cache external metadata if policy allows,
- do not proxy indefinitely without reason.

---

# 54. Analytics

Implement event-based analytics abstraction.

Important events:

```text
SIGN_UP
LOGIN
PROFILE_CREATED
PROFILE_VIEW
DROP_CREATED
DROP_OPENED
RESPONSE_SENT
SONG_SENT
INBOX_OPENED
STORY_GENERATED
STORY_SHARED
SHARE_LINK_COPIED
NEW_USER_FROM_SHARED_LINK
```

Key funnel:

```text
Story Shared
    ↓
Link Opened
    ↓
Response Sent
    ↓
User Signup
```

---

# 55. UTM / Referral Tracking

Shared link dapat memiliki lightweight referral id.

Example:

```text
/d/abc123?ref=xyz
```

Jangan expose user-sensitive information.

Goal:

- measure viral coefficient,
- track source.

---

# 56. Viral Metrics

Important metrics:

```text
Story Share Rate
Response Rate
Profile-to-Response Conversion
Responses per Drop
New Users per Shared Story
K-factor
Day 1 Retention
Day 7 Retention
```

---

# 57. Admin Panel

MVP admin panel dapat sederhana.

Route:

```text
/admin
```

Admin can:

- view users,
- search username,
- view reports,
- hide response,
- suspend user,
- block abusive session,
- view basic product metrics.

Admin authorization harus server-side.

Jangan hanya menyembunyikan link `/admin`.

---

# 58. Logging

Log:

- server errors,
- moderation action,
- failed story generation,
- failed music metadata lookup,
- suspicious rate-limit activity.

Do not log:

- full passwords,
- OAuth tokens,
- secrets,
- sensitive request payload unnecessarily.

---

# 59. Error Handling

User-facing error message harus jelas.

Bad:

```text
500 Internal Server Error
```

Better:

```text
We couldn't send your response.
Please try again.
```

Developer log tetap menyimpan technical details.

---

# 60. Spotify URL Validation

Accept only recognized Spotify domains/routes.

Example:

```text
open.spotify.com/track/...
```

Do not fetch arbitrary user-supplied URL server-side tanpa allowlist karena SSRF risk.

---

# 61. External URL Safety

External URL seperti Instagram atau Spotify:

- validate scheme,
- allow `https`,
- normalize,
- prevent javascript/data URLs.

---

# 62. Story Link

Story Card sebaiknya memiliki CTA:

```text
Send me yours
```

dan short recognizable domain.

Jika QR digunakan:

- jangan terlalu dominan,
- link harus tetap readable.

---

# 63. Story Share UX

Flow:

```text
Open response
     ↓
Share
     ↓
Choose Theme
     ↓
Preview
     ↓
Generate
     ↓
Share / Save
```

Optional:

```text
Copy Link
```

---

# 64. Notifications MVP

In-app only.

Examples:

```text
Someone sent you a song.
Someone answered your Drop.
```

Email notifications dapat ditambahkan kemudian.

---

# 65. Realtime Strategy

Realtime optional.

Do not overuse.

Good:

```text
Inbox badge updates
```

Not necessary:

```text
every profile page detail realtime
```

---

# 66. Future Features

Do not implement unless requested.

Potential:

## Music Compatibility

```text
User A
+
User B
↓
Music Taste Match
87%
```

## Friendship Soundtrack

Friends submit songs → public/shared playlist-like result.

## Vibe Result

Responses aggregated:

```text
58% mysterious
22% calm
12% chaotic
8% sunshine
```

## Story Chain

One user shares prompt → responder creates their own → viral chain.

## Guess Sender

Receiver guesses sender, sender may reveal voluntarily.

## 24 Hour Drop

Drop expires automatically.

## Public Explore

Trending Drop templates.

## Native Mobile App

React Native / Expo.

---

# 67. Features Explicitly NOT in MVP

Do not implement initially:

- follower system,
- public feed,
- direct messaging,
- group chat,
- video upload,
- audio upload,
- marketplace,
- payments,
- premium subscription,
- AI recommendation engine,
- full Spotify playback client,
- Instagram auto-post,
- scraping,
- native mobile app,
- live streaming,
- geographic matching.

---

# 68. Development Phases

## Phase 0 — Setup

- repository,
- Next.js,
- TypeScript,
- Tailwind,
- shadcn/ui,
- Supabase local/project config,
- environment schema,
- linting,
- formatting.

---

## Phase 1 — Authentication

- register,
- login,
- logout,
- reset password,
- protected dashboard,
- profile creation.

Acceptance:

- user dapat signup,
- profile row dibuat,
- route dashboard protected.

---

## Phase 2 — Profile

- edit profile,
- username,
- Instagram username,
- avatar,
- public profile.

Acceptance:

```text
/@username
```

dapat dibuka publik.

---

## Phase 3 — Drops

- templates,
- create Drop,
- public Drop URL,
- active/inactive.

Acceptance:

User dapat membuat:

```text
Send Me A Song
Anonymous Message
```

---

## Phase 4 — Anonymous Responses

- anonymous session,
- message validation,
- rate limit,
- response insert,
- success screen.

Acceptance:

Visitor tanpa login dapat merespons public Drop.

---

## Phase 5 — Inbox

- list,
- unread/read,
- detail,
- delete/hide.

Acceptance:

Owner hanya melihat response miliknya.

---

## Phase 6 — Music

- Spotify URL input,
- URL validation,
- metadata/embed,
- song card.

Acceptance:

Song response tersimpan dan tampil di Inbox.

---

## Phase 7 — Story Generator

- choose theme,
- preview,
- generate 1080×1920,
- save/share.

Acceptance:

Generated Story dapat digunakan di Instagram Story.

---

## Phase 8 — Safety

- CAPTCHA/adaptive bot protection,
- report,
- block,
- moderation filters,
- admin panel basic.

---

## Phase 9 — Analytics

- key events,
- referral tracking,
- funnel dashboard.

---

# 69. Testing Strategy

Minimum:

## Unit tests

- username normalization,
- Spotify URL validation,
- Drop schema validation,
- rate-limit logic,
- story data formatter.

## Integration tests

- create Drop,
- submit response,
- owner Inbox access,
- non-owner denied,
- story generation.

## E2E

Flow:

```text
signup
→ create profile
→ create drop
→ open drop as visitor
→ send anonymous response
→ owner opens inbox
→ owner generates story
```

Preferred framework:

```text
Playwright
```

---

# 70. Validation Library

Recommended:

```text
Zod
```

Use shared schema where appropriate.

Example:

```ts
const createResponseSchema = z.object({
  dropId: z.string().uuid(),
  message: z.string().trim().max(500).optional(),
  spotifyUrl: z.string().url().optional(),
});
```

Validate again server-side.

---

# 71. Forms

Recommended:

```text
React Hook Form
+
Zod
```

Do not trust client validation only.

---

# 72. Data Fetching

Prefer native Next.js patterns.

Avoid adding state/query libraries unless truly needed.

Potential future:

```text
TanStack Query
```

only if client caching/interaction becomes complex.

---

# 73. State Management

MVP:

- React state,
- server state,
- URL state.

Do not add Redux by default.

---

# 74. UI Component Rules

Components:

- small,
- reusable,
- typed,
- accessible.

Avoid:

```text
Huge 1000-line page component
```

Separate:

```text
SongCard
DropCard
ResponseCard
StoryPreview
ProfileHeader
```

---

# 75. TypeScript Rules

Use:

```text
strict: true
```

Avoid:

```ts
any
```

unless absolutely necessary and documented.

Prefer:

```ts
unknown
```

for untrusted data.

---

# 76. Coding Style

- meaningful variable names,
- early return,
- server/client boundary clear,
- no dead code,
- no giant utility files,
- minimal comments for obvious code,
- comments for architectural decisions.

---

# 77. Git Workflow

Suggested:

```text
main
develop
feature/*
fix/*
```

For solo MVP, simplified workflow acceptable:

```text
main
feature/*
```

Commit style example:

```text
feat: add anonymous drop submission
fix: validate spotify track urls
chore: configure supabase client
```

---

# 78. README

README must include:

- product overview,
- screenshots later,
- stack,
- prerequisites,
- local setup,
- Supabase setup,
- environment variables,
- migrations,
- running tests,
- deployment.

---

# 79. Local Setup Desired

Ideal:

```bash
pnpm install

cp .env.example .env.local

pnpm dev
```

Database migration command should be documented.

---

# 80. Development Environment

Tools:

```text
Node.js
pnpm
Git
VS Code or equivalent
Supabase
Chrome DevTools
GitHub
Vercel
```

Optional:

```text
Bruno / Postman
```

---

# 81. Cost Philosophy

MVP should target near-zero infrastructure cost.

Use free tiers where reasonable:

- GitHub,
- Supabase free tier,
- hosting free/development tier,
- Turnstile/free bot protection,
- Spotify Embed.

Do not prematurely adopt expensive SaaS.

---

# 82. Scaling Philosophy

Do not optimize for millions of users on day one.

But avoid obvious scaling traps.

Initial architecture:

```text
Next.js
  ↓
Supabase/Postgres
  ↓
Storage
```

Can later add:

- CDN optimization,
- background jobs,
- Redis,
- queue,
- dedicated API,
- dedicated image service,

only when data shows need.

---

# 83. Storage Cost Control

Generated Story images can become expensive.

Strategies:

1. generate on demand,
2. cache same result,
3. delete unused generated images after TTL,
4. regenerate deterministic cards if needed,
5. compress WebP where acceptable.

Do not permanently store every preview.

---

# 84. Data Retention

Initial proposal:

- user profile: until account deletion,
- active responses: until owner deletes/account deleted,
- temporary story output: TTL/cached,
- abuse logs: limited retention based on operational need.

Final policy should be defined before public launch.

---

# 85. Account Deletion

Before serious public launch implement:

```text
Delete Account
```

Expected:

- revoke sessions,
- remove/anonymize profile,
- delete owned Drops,
- delete responses as required,
- clean storage.

---

# 86. Terms / Privacy

Before public release include:

```text
/privacy
/terms
/community-guidelines
```

Content can initially be simple but accurate.

Do not claim privacy behavior that system does not actually provide.

---

# 87. Age / Safety Consideration

Before public launch, decide minimum age and policy based on target market and legal requirements.

Do not collect date of birth unless needed.

---

# 88. SEO

Public profile may be indexable or optionally noindex.

MVP recommendation:

- landing page indexable,
- public profile setting can control discoverability,
- Drop pages may use `noindex` by default to avoid exposing personal content in search results.

---

# 89. Open Graph

Public Drop URL should have Open Graph metadata.

Example:

```text
@flowlow wants your song 🎧
Send one anonymously on VYBE.
```

Do not leak anonymous responses via OG tags.

---

# 90. Share Metadata

Use dynamic metadata for:

- user profile,
- Drop pages.

Story share remains image-based.

---

# 91. Observability

MVP:

- Vercel logs,
- Supabase logs,
- structured server logging.

Future:

- Sentry or equivalent.

Do not add paid observability until useful.

---

# 92. Failure Scenarios

The app must gracefully handle:

## Spotify unavailable

Show:

```text
Unable to load Spotify preview.
Open on Spotify instead.
```

Core response tetap tersedia.

## Story generator fails

Allow retry.

## Database temporarily unavailable

Show recoverable error.

## Spam detected

Do not reveal anti-abuse logic detail.

---

# 93. Abuse UX

If rate limited:

```text
You're sending responses too quickly.
Try again later.
```

Do not reveal exact internal thresholds if that weakens abuse defense.

---

# 94. Business Model — Future Only

Potential:

- premium profile themes,
- premium Story templates,
- custom branding removal,
- analytics,
- profile customization,
- creator tools.

Do not implement payment MVP.

---

# 95. Product Success Criteria MVP

MVP dianggap berhasil secara produk apabila user dapat:

1. membuat akun,
2. memiliki profile URL,
3. membuat Drop,
4. membagikan Drop,
5. menerima anonymous response,
6. menerima Spotify song link,
7. melihat Inbox,
8. membuat Story Card,
9. membagikan hasil ke Instagram.

Semua itu harus bekerja dari mobile browser.

---

# 96. Technical Acceptance Criteria

MVP minimum:

- no TypeScript build errors,
- responsive mobile,
- auth secure,
- RLS active,
- private Inbox inaccessible to others,
- anonymous response rate limited,
- Spotify URL validation,
- generated Story correct 9:16,
- secrets server-only,
- production build works,
- no critical console errors.

---

# 97. Performance Acceptance

Target pragmatic:

- landing/profile usable quickly on mobile,
- avoid >1 MB unnecessary JavaScript,
- optimize media,
- avoid blocking animations,
- Story generation response ideally cached.

Exact performance budget can be added later.

---

# 98. UX Acceptance

Anonymous sender:

```text
open link
→ understand prompt
→ send response
```

harus dapat dilakukan tanpa kebingungan.

Ideal interaction:

```text
3–4 taps maximum
```

untuk simple message submission setelah page load.

---

# 99. Primary Screens

Required:

```text
Landing
Register
Login
Profile Setup
Dashboard
Create Drop
Public Profile
Public Drop
Response Success
Inbox
Response Detail
Story Theme Selection
Story Preview
Settings
```

Later:

```text
Admin
Analytics
Spotify Connect
```

---

# 100. Dashboard Concept

Example:

```text
Good evening 👋

27 new responses

[ Create a Drop ]

Recent

🎧 About You
Someone sent you this song
2m ago

💭 Anonymous
"gue kira dulu..."
12m ago
```

Do not overload dashboard.

---

# 101. Create Drop Screen

Example:

```text
Create a Drop

Choose one:

🎧 Send me a song
🎶 Describe me with a song
💭 Tell me something
👀 First impression

[ Continue ]
```

Next:

```text
Customize prompt

"Send me a song that reminds you of me."

Anonymous responses: ON

[ Create & Share ]
```

---

# 102. Response Success Screen

After anonymous submission:

```text
Sent ✨

Your response was delivered anonymously.

[ Send another ]
[ Create your own VYBE ]
```

This screen is a key acquisition opportunity.

CTA:

```text
Create your own
```

should be visible but not aggressive.

---

# 103. Viral Acquisition

Every visitor who submits response dapat ditawarkan:

```text
Want your own?
Create a VYBE.
```

Do not force signup before responding.

---

# 104. Referral Loop

Share link structure can include creator/referral context.

Metrics:

```text
responses generated per share
new accounts generated per share
```

---

# 105. Profile Theme MVP

Keep simple:

```text
Dark
Light
Gradient
```

Story theme separate from profile theme.

---

# 106. Settings

MVP:

```text
Profile
Instagram username
Anonymous messages
Privacy
Account
Logout
```

---

# 107. Username Validation

Suggested:

- 3–30 characters,
- lowercase,
- letters,
- numbers,
- underscore,
- dot optional.

Example regex can be determined carefully.

Do not allow confusing URL path characters.

---

# 108. Instagram Username Validation

Do not perform aggressive verification in MVP.

Store normalized username.

Link:

```text
https://instagram.com/{username}
```

Validate allowed characters.

---

# 109. Music Input UX

MVP:

```text
Paste Spotify song link
```

Then card preview.

Future:

```text
Search Spotify
```

Do not delay MVP because search API is unavailable.

---

# 110. Spotify Embed UX

Show:

- artwork,
- song,
- artist,
- button/open embed where allowed.

Do not autoplay.

Do not create unauthorized audio streaming.

---

# 111. Story Generation Security

Story generation endpoint must:

- authorize owner,
- validate referenced response belongs to owner,
- validate template/theme,
- sanitize displayed text,
- prevent arbitrary remote fetch SSRF.

---

# 112. Story Text Handling

Long response must:

- truncate elegantly,
- wrap,
- resize within limits,
- never overflow image.

Potential:

```text
max visible Story text 240 characters
```

If longer, show excerpt.

---

# 113. Story Image Composition

Safe zones:

- avoid top/bottom edges used by Instagram UI,
- keep important text centered,
- maintain 9:16.

Suggested margin:

```text
top safe area
bottom safe area
```

Exact pixel values can be tuned through testing.

---

# 114. Design Tokens

Create centralized tokens:

```text
background
surface
text
muted
accent
border
radius
shadow
spacing
```

Tailwind theme/CSS variables.

---

# 115. Empty States

Examples:

Inbox empty:

```text
No responses yet.

Share your Drop to Instagram
and let people answer.

[ Share Drop ]
```

Drops empty:

```text
Create your first Drop.
```

---

# 116. Loading States

Use:

- skeleton,
- button spinner,
- optimistic UI only where safe.

Avoid blank screens.

---

# 117. Mobile Browser Considerations

Test:

- Chrome Android,
- Safari iOS,
- Instagram in-app browser if possible.

Important because most traffic may originate from Instagram.

---

# 118. Instagram In-App Browser

Avoid relying on unsupported browser APIs.

Fallback:

- copy link,
- save image.

Detecting browser may be used only for UX enhancement, not core functionality.

---

# 119. Web Share API

Use when available:

```js
navigator.share(...)
```

Always provide fallback:

```text
Copy Link
Download Story
```

---

# 120. PWA

Not required MVP.

May later add:

- manifest,
- installable web app,
- push notifications.

Do not prioritize over core loop.

---

# 121. Future Mobile App

Only after product validation.

Preferred future:

```text
React Native
Expo
```

Benefits:

- native share,
- push,
- deeper Instagram integration,
- better media handling.

---

# 122. AI Usage in Product

AI is not necessary for MVP.

Possible future:

- moderation,
- vibe summaries,
- generated question prompts,
- response grouping.

Avoid adding AI just for marketing.

---

# 123. Questions AI Developer Should NOT Ask Repeatedly

If this document already specifies it, do not ask again:

- frontend framework,
- database,
- auth provider,
- whether Instagram password is needed,
- whether mobile app is MVP,
- whether Spotify OAuth is mandatory,
- whether anonymous responses need safety.

Use this document as source of truth.

---

# 124. Areas Still Open for Decision

These can be decided during development:

- final brand name,
- exact color palette,
- final domain,
- exact Story typography,
- exact rate limit thresholds,
- email provider,
- analytics provider,
- whether Google auth launches in MVP,
- whether profile pages are indexed.

Choose reversible defaults.

---

# 125. First Development Milestone

The first meaningful milestone should be:

```text
User can:
1. register,
2. create profile,
3. create anonymous Drop,
4. open public Drop URL in another browser,
5. send anonymous message,
6. receive it in Inbox.
```

Do **not** begin Spotify/story features until this works.

---

# 126. Second Development Milestone

```text
Spotify link can be attached to response.
```

---

# 127. Third Development Milestone

```text
Response can be converted to 1080×1920 Story image.
```

---

# 128. Fourth Development Milestone

```text
Share flow works well from mobile.
```

---

# 129. Recommended Implementation Order

Exact order:

```text
1. Project setup
2. Supabase
3. Auth
4. Profile
5. RLS
6. Drops
7. Anonymous session
8. Responses
9. Inbox
10. Rate limiting
11. Spotify link
12. Story generator
13. Share flow
14. Report/block
15. Admin
16. Analytics
```

Do not implement in random order.

---

# 130. Definition of Done — Feature

A feature is considered done when:

- implementation complete,
- loading state exists,
- error state exists,
- mobile responsive,
- authorization checked,
- validation server-side,
- tests reasonable,
- no TypeScript error,
- production build passes.

---

# 131. Definition of Done — MVP

MVP done when:

```text
Profile
Drops
Anonymous Response
Inbox
Spotify Link
Story Generator
Share Flow
Safety Basics
```

all work end-to-end.

---

# 132. AI Coding Behavior

When developing:

1. Explain architecture changes before major refactor.
2. Keep patches focused.
3. Do not replace working stack unnecessarily.
4. Preserve existing behavior.
5. Run lint/typecheck/test after meaningful changes.
6. Update README if setup changes.
7. Update `.env.example` when adding environment variables.
8. Add migration for schema changes.
9. Never commit secrets.
10. Avoid fake/mock implementation unless clearly labeled.

---

# 133. Initial Command Recommendation

When project work officially begins, start by:

```text
1. Initialize Next.js + TypeScript
2. Configure Tailwind
3. Install shadcn/ui
4. Add Supabase client/server helpers
5. Create environment validation
6. Create initial migration
7. Implement auth
```

Do not create every screen as static mock first unless specifically requested.

Prefer vertical end-to-end slices.

---

# 134. Vertical Slice Philosophy

First vertical slice:

```text
Register
→ Profile
→ Create Drop
→ Anonymous Submit
→ Inbox
```

Then:

```text
Spotify
```

Then:

```text
Story
```

This proves product functionality earlier.

---

# 135. Branding Placeholder

Until branding final:

```text
Product name: VYBE
Logo: text-based temporary
Primary tagline: Say it with a song.
```

Do not spend excessive development time on logo.

---

# 136. Suggested Initial Landing Copy

Temporary only:

```text
VYBE

Say it with a song.

Create your page.
Share it to your Story.
Let your friends send anonymous thoughts,
songs, and vibes.

[ Create your VYBE ]
```

---

# 137. Suggested Public Profile CTA

```text
Send anonymously
```

For song:

```text
Send this song
```

---

# 138. Suggested Story CTA

```text
Send me yours
```

URL:

```text
vybe.app/@username
```

Domain placeholder until purchased.

---

# 139. Important Architecture Principle

The app must remain functional under this scenario:

```text
Spotify API unavailable
Instagram API unavailable
```

Minimum still works:

```text
Profile
Anonymous text Drops
Spotify URL/open link
Story image
Web sharing
```

This is a critical design requirement.

---

# 140. Final Product Summary

VYBE is:

```text
a mobile-first social web app
for Instagram users
to receive anonymous messages
and song-based interactions,
then convert those interactions
into beautiful Story Cards
that can be shared back to Instagram.
```

Core stack:

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
Motion
Supabase
PostgreSQL
Supabase Auth
Supabase Storage
Satori
Sharp
Spotify Link/Embed
Vercel
GitHub
```

Core principle:

```text
Instagram = distribution
VYBE      = interaction
Spotify   = music expression
```

Core viral loop:

```text
Create
→ Share
→ Receive
→ Reveal
→ Re-share
→ New user
```

---

# 141. Instruction to the AI Receiving This File

When this file is provided to you for the first time:

1. Read the entire specification.
2. Treat it as the project source of truth.
3. Do not immediately add features outside scope.
4. First inspect the existing repository if one exists.
5. If no repository exists and the user explicitly says to start, begin with **Phase 0 and the first vertical slice**.
6. Preserve the architecture described here.
7. Inform the user before making any major architectural deviation.
8. Prioritize a working end-to-end MVP over feature quantity.
9. Keep integrations modular so Spotify and Instagram are not hard dependencies.
10. Keep security, privacy, anti-spam, and moderation in scope from the beginning.

**Do not start implementation until the user explicitly confirms that development should begin.**

---

# 142. Short AI Context Block

If a coding agent needs a condensed reminder, use:

```text
Build VYBE as a mobile-first Next.js + TypeScript social web application.

Core flow:
profile → create Drop → share → anonymous response → Inbox → Story Card → Instagram share.

Stack:
Next.js, React, TypeScript, Tailwind, shadcn/ui, Motion, Supabase/Postgres/Auth/Storage, Satori + Sharp, Vercel.

MVP:
auth, profile, Instagram username, Drops, anonymous responses, Inbox, Spotify URL/embed, Story generator, share flow, rate limiting, report/block basics.

Do not use Instagram scraping or passwords.
Do not make Spotify OAuth mandatory.
Do not add follower/feed/chat/payment/mobile-native features yet.
Use RLS.
Keep anonymous abuse controls.
Do not start coding until explicitly told to start.
```

---

# 143. Project Status at Creation of This Document

Current status:

```text
Concept defined
Architecture proposed
MVP scope defined
Technology stack defined
No implementation started yet
```

Next step only after explicit confirmation:

```text
BEGIN DEVELOPMENT
```

---

**End of Master Project Brief**
