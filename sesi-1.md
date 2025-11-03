mantap — lanjut ke **Sesi 1: Dasar Cypress**
masih pakai prinsip yang sama: *praktik langsung di VS Code, tanpa codespace, tanpa app internal*. semua tester cukup pakai website publik biar fokus ke konsep *automation mindset* bukan debugging server.

---

# 🧩 Worksheet Sesi 1 – Dasar Cypress

> **Tujuan:**
> Tester manual belajar logika dasar penulisan test otomatis: *command queue, asynchrony, assertion, dan selector yang benar.*

---

## 🧠 1. Materi

| Topik                    | Penjelasan                                                                                                |
| ------------------------ | --------------------------------------------------------------------------------------------------------- |
| **Command Queue**        | Setiap perintah `cy.*` dieksekusi berurutan, Cypress sendiri yang ngatur timing-nya. Jangan pake `await`. |
| **Asynchrony**           | `cy.get()` nggak langsung dapet elemen, dia *nunggu* sampai ketemu — itu sebabnya gak perlu sleep.        |
| **Assertion (`should`)** | Mengecek kondisi benar/salah, otomatis retry sampai pass atau timeout.                                    |
| **Selector Stabil**      | Gunakan `[data-test]`, `[data-testid]`, atau `id` khusus. Hindari selector by class yang gampang berubah. |

---

## 💻 2. Example (Website: `https://www.saucedemo.com`)

### A. Config project

`cypress.config.js`

```js
const { defineConfig } = require("cypress");
module.exports = defineConfig({
  e2e: { baseUrl: "https://www.saucedemo.com", video: false }
});
```

---

### B. File Test `cypress/e2e/login-basic.cy.js`

```js
describe("Dasar command & assertion", () => {

  it("Login sukses (flow basic)", () => {
    cy.visit("/");

    // isi form
    cy.get("[data-test=username]").type("standard_user");
    cy.get("[data-test=password]").type("secret_sauce");

    // klik tombol
    cy.get("[data-test=login-button]").click();

    // assertions
    cy.url().should("include", "/inventory");
    cy.contains("Products").should("be.visible");
  });

  it("Login gagal (assertion text error)", () => {
    cy.visit("/");
    cy.get("[data-test=username]").type("standard_user");
    cy.get("[data-test=password]").type("salah");
    cy.get("[data-test=login-button]").click();

    cy.get("[data-test=error]")
      .should("be.visible")
      .and("contain.text", "Username and password do not match");
  });

});
```

---

### C. Jalankan

```bash
npx cypress open
```

→ pilih browser → klik `login-basic.cy.js`
Atau jalankan headless:

```bash
npx cypress run --browser chrome
```

---

### D. Penjelasan kode

| Baris                            | Fungsi                                |
| -------------------------------- | ------------------------------------- |
| `cy.visit("/")`                  | Buka base URL dari config.            |
| `cy.get("[data-test=username]")` | Ambil elemen input username.          |
| `.type("text")`                  | Isi field dengan teks.                |
| `.click()`                       | Klik tombol.                          |
| `.should("be.visible")`          | Pastikan elemen terlihat di layar.    |
| `.and("contain.text", "…")`      | Assertion tambahan untuk konten teks. |

---

## 🧩 3. Real Task (Website: `https://the-internet.herokuapp.com/login`)

### A. Base URL

```js
e2e: { baseUrl: "https://the-internet.herokuapp.com" }
```

### B. Tulis test `cypress/e2e/login-herokuapp.cy.js`

```js
describe("Login test di the-internet.herokuapp.com", () => {

  it("Login sukses menampilkan secure area", () => {
    cy.visit("/login");
    cy.get("#username").type("tomsmith");
    cy.get("#password").type("SuperSecretPassword!");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/secure");
    cy.get(".flash.success").should("contain.text", "You logged into a secure area!");
  });

  it("Login gagal menampilkan error", () => {
    cy.visit("/login");
    cy.get("#username").type("tomsmith");
    cy.get("#password").type("salahbanget");
    cy.get('button[type="submit"]').click();

    cy.get(".flash.error")
      .should("be.visible")
      .and("contain.text", "Your password is invalid!");
  });

});
```

---

### C. Tantangan lanjutan

1. Tambahkan assertion bahwa tombol logout muncul setelah login berhasil.

   ```js
   cy.get("a.button").should("contain.text", "Logout");
   ```
2. Ganti selector class `.flash.success` menjadi selector CSS yang lebih spesifik (pakai attribute atau text).
3. Tambahkan negative assertion: pastikan pesan error **tidak** muncul saat login benar.

   ```js
   cy.get(".flash.error").should("not.exist");
   ```

---

## ✅ Checklist Sesi 1

| Item                                            | Status |
| ----------------------------------------------- | ------ |
| Login sukses & gagal keduanya pass              | ☐      |
| Tidak ada `cy.wait(2000)`                       | ☐      |
| Paham fungsi `.should()` dan `.and()`           | ☐      |
| Gunakan selector yang stabil (bukan class acak) | ☐      |
| Minimal 2 file test dibuat                      | ☐      |

---

## 💡 Catatan Pentester-junior-friendly

* Cypress otomatis nunggu elemen muncul sampai timeout (default 4 detik). Jangan panik tambah sleep.
* Kalau test gagal, cek screenshot/video di `cypress/screenshots` dan `cypress/videos`.
* Semua test bisa dijalankan sekaligus:

  ```bash
  npx cypress run --browser chrome --spec "cypress/e2e/*.cy.js"
  ```

---

> Sesi selanjutnya (Sesi 2) bakal fokus ke **E2E Happy Path**:
> gabungin beberapa aksi user (login → add item → logout) supaya tester mulai ngerti *alur end-to-end* yang sebenarnya.
