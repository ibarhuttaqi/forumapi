---

# Dokumentasi Proyek: Forum API - Garuda Game

## 1. Deskripsi Proyek
Forum API adalah layanan Back-End RESTful API yang dibangun untuk mendukung platform diskusi komunitas pemain Garuda Game. Aplikasi ini dirancang agar pemain dapat berinteraksi, berdiskusi mengenai *game*, serta berbagi informasi melalui *thread* dan komentar. API ini dapat dikonsumsi oleh klien web maupun *mobile native*.

Proyek ini dibangun dengan standar rekayasa perangkat lunak modern, berfokus pada skalabilitas, kemudahan *maintenance*, dan keamanan tingkat tinggi.

---

## 2. Arsitektur & Metodologi Sistem

Sistem ini dikembangkan secara ketat menggunakan prinsip-prinsip berikut:

* **Clean Architecture:** Struktur kode mematuhi pemisahan ke dalam 4 *layer* untuk mengenkapsulasi logika bisnis dari *framework* eksternal:
    * **Entities:** Struktur data dan entitas bisnis utama.
    * **Use Case:** Alur atau logika bisnis aplikasi.
    * **Interface Adapter:** *Repository* dan *Handler* yang menjembatani *framework* dengan *Use Case*.
    * **Frameworks:** Lapisan terluar untuk *Database* dan HTTP Server.
* **Test-Driven Development (TDD):** Seluruh fitur dibangun dengan kultur TDD dengan target **100% Test Coverage**.
    * **Unit Testing:** Diimplementasikan pada *Entities* dan *Use Case*.
    * **Integration Testing:** Diimplementasikan pada interaksi *database* (*Repository*).
    * **Functional Testing:** Pengujian pada level *server endpoint* / *HTTP routing*.

---

## 3. Infrastruktur, CI/CD, dan Keamanan

Proyek ini telah terotomatisasi dan diamankan untuk kebutuhan level produksi (*production-ready*).

* **Continuous Integration (CI):** Diimplementasikan via GitHub Actions untuk menjalankan seluruh *test suite* (Unit, Integration, Functional) secara otomatis pada setiap *event* Pull Request ke *branch* utama.
* **Continuous Deployment (CD):** *Deployment* otomatis ke server (misal: EC2 instances) terpicu setiap ada *push* atau *merge* ke *branch* utama.
* **Keamanan & Jaringan:**
    * **HTTPS/SSL:** Seluruh komunikasi data dienkripsi menggunakan protokol HTTPS untuk mencegah serangan *Man-in-the-Middle* (MITM).
    * **Rate Limiting (NGINX):** Akses menuju *resource* `/threads` (dan *path* di dalamnya) dibatasi maksimal **90 request per menit** untuk mencegah serangan DDoS.

---

## 4. Spesifikasi API (API Reference)

Sebagian besar *endpoint* bersifat tertutup (*restricted*) dan mewajibkan penggunaan `Authorization: Bearer <Access_Token>` (berdasarkan Starter Project Auth API). 

### 4.1. Modul Thread

#### Menambahkan Thread Baru
* **Method:** `POST`
* **Path:** `/threads`
* **Access:** Restricted (Requires Token)

**Request Body:**
```json
{
    "title": "Judul thread",
    "body": "Isi detail dari thread"
}
```

**Response (201 Created):**
```json
{
    "status": "success",
    "data": {
        "addedThread": {
            "id": "thread-h_W1Plfpj0TY7wyT2PUPX",
            "title": "Judul thread",
            "owner": "user-DWrT3pXe1hccYkV1eIAxS"
        }
    }
}
```
*(Catatan: Mengembalikan `400 Bad Request` jika properti tidak lengkap/sesuai).*

#### Melihat Detail Thread
* **Method:** `GET`
* **Path:** `/threads/{threadId}`
* **Access:** Public

**Response (200 OK):**
```json
{
    "status": "success",
    "data": {
        "thread": {
            "id": "thread-h_2FkLZhtgBKY2kh4CC02",
            "title": "sebuah thread",
            "body": "sebuah body thread",
            "date": "2021-08-08T07:19:09.775Z",
            "username": "dicoding",
            "comments": [
                {
                    "id": "comment-_pby2_tmXV6bcvcdev8xk",
                    "username": "johndoe",
                    "date": "2021-08-08T07:22:33.555Z",
                    "content": "sebuah comment",
                    "likeCount": 2,
                    "replies": [
                        {
                            "id": "reply-BErOXUSefjwWGW1Z10Ihk",
                            "content": "**balasan telah dihapus**",
                            "date": "2021-08-08T07:59:48.766Z",
                            "username": "johndoe"
                        }
                    ]
                },
                {
                    "id": "comment-yksuCoxM2s4MMrZJO-qVD",
                    "username": "dicoding",
                    "date": "2021-08-08T07:26:21.338Z",
                    "content": "**komentar telah dihapus**",
                    "likeCount": 0,
                    "replies": []
                }
            ]
        }
    }
}
```
*(Catatan: Mengembalikan `404 Not Found` jika ID Thread tidak valid. Komentar dan balasan diurutkan secara ascending berdasarkan waktu).*

---

### 4.2. Modul Komentar

#### Menambahkan Komentar pada Thread
* **Method:** `POST`
* **Path:** `/threads/{threadId}/comments`
* **Access:** Restricted (Requires Token)

**Request Body:**
```json
{
    "content": "Isi komentar"
}
```

**Response (201 Created):**
```json
{
    "status": "success",
    "data": {
        "addedComment": {
            "id": "comment-_pby2_tmXV6bcvcdev8xk",
            "content": "Isi komentar",
            "owner": "user-CrkY5iAgOdMqv36bIvys2"
        }
    }
}
```

#### Menghapus Komentar
* **Method:** `DELETE`
* **Path:** `/threads/{threadId}/comments/{commentId}`
* **Access:** Restricted (Requires Token - Pemilik Komentar)

**Response (200 OK):**
```json
{
    "status": "success"
}
```
*(Catatan: Menggunakan teknik Soft Delete. Jika diakses oleh bukan pemiliknya, akan mengembalikan `403 Forbidden`).*

#### Menyukai / Batal Menyukai Komentar (Like/Unlike)
* **Method:** `PUT`
* **Path:** `/threads/{threadId}/comments/{commentId}/likes`
* **Access:** Restricted (Requires Token)

**Response (200 OK):**
```json
{
    "status": "success"
}
```
*(Catatan: Sistem bersifat "Toggle". Jika belum menyukai, aksi ini akan menambah like. Jika sudah menyukai, aksi ini akan membatalkan like).*

---

### 4.3. Modul Balasan Komentar (Replies)

#### Menambahkan Balasan pada Komentar
* **Method:** `POST`
* **Path:** `/threads/{threadId}/comments/{commentId}/replies`
* **Access:** Restricted (Requires Token)

**Request Body:**
```json
{
    "content": "Isi balasan"
}
```

**Response (201 Created):**
```json
{
    "status": "success",
    "data": {
        "addedReply": {
            "id": "reply-BErOXUSefjwWGW1Z10Ihk",
            "content": "Isi balasan",
            "owner": "user-CrkY5iAgOdMqv36bIvys2"
        }
    }
}
```

#### Menghapus Balasan
* **Method:** `DELETE`
* **Path:** `/threads/{threadId}/comments/{commentId}/replies/{replyId}`
* **Access:** Restricted (Requires Token - Pemilik Balasan)

**Response (200 OK):**
```json
{
    "status": "success"
}
```
*(Catatan: Menggunakan teknik Soft Delete. Balasan yang dihapus akan ditandai dengan "**balasan telah dihapus**" saat detail thread ditarik).*
