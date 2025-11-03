biar tester fokus ke *cara ngetesnya*, bukan ribet setup app sendiri. lo bisa pakai website publik yang stabil kayak:

* `https://example.cypress.io` → official demo site Cypress
* `https://www.saucedemo.com` → latihan login/logout UI (punya Sauce Labs)
* `https://the-internet.herokuapp.com` → kumpulan mini page buat tes form, alert, auth, dll

nah biar rapi, gw buatin ulang **worksheet Sesi 0 versi real-world site**
langsung bisa dipraktik di VS Code, tanpa project tambahan.

---

# 🧩 Worksheet Sesi 0 – Setup & First Test (VS Code + Cypress)

> **Tujuan:**
> Tester bisa install Cypress, bikin test pertama, dan ngetes website yang udah online tanpa harus punya sistem internal.

---

## 🧠 1. Materi

| Konsep            | Penjelasan                                                                                   |
| ----------------- | -------------------------------------------------------------------------------------------- |
| **Cypress**       | Framework UI automation. Bisa visit halaman, klik tombol, isi form, dan verifikasi tampilan. |
| **Assertion**     | Kondisi yang wajib benar biar test dianggap lulus.                                           |
| **Base URL**      | Alamat default web yang mau dites. Bisa site publik.                                         |
| **Runner Mode**   | UI visual buat lihat klik-kliknya jalan di browser.                                          |
| **Headless Mode** | Jalan di terminal, tanpa buka browser.                                                       |

---

## 💻 2. Example (pakai `https://example.cypress.io`)

### A. Setup project

Buka terminal di folder kosong:

```bash
npm init -y
npm i -D cypress
```

### B. Jalankan Cypress pertama kali

```bash
npx cypress open
```

Pilih **E2E Testing → Chrome → Start E2E Testing in Chrome**.
Ini bakal bikin folder `cypress/` dan `cypress.config.js`.

---

### C. Ubah base URL

Edit `cypress.config.js`:

```js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://example.cypress.io",
    video: false
  }
});
```

---

### D. Buat file test

`cypress/e2e/example-site.cy.js`

```js
describe("Contoh test di example.cypress.io", () => {
  it("buka homepage dan cek teks", () => {
    cy.visit("/");
    cy.contains("Kitchen Sink").should("be.visible");
  });

  it("navigasi ke halaman Querying", () => {
    cy.contains("Commands").click();
    cy.contains("Querying").click();
    cy.url().should("include", "/commands/querying");
    cy.contains("GET").should("be.visible");
  });
});
```

---

### E. Jalankan test

**UI Mode:**

```bash
npx cypress open
```

**Headless Mode:**

```bash
npx cypress run --browser chrome
```

---

## 🧩 3. Real Task (pakai `https://www.saucedemo.com`)

> Situs demo login e-commerce.
> Username: `standard_user`, Password: `secret_sauce`

### A. Ubah base URL

Edit `cypress.config.js`:

```js
e2e: {
  baseUrl: "https://www.saucedemo.com"
}
```

### B. Buat test login

`cypress/e2e/login.cy.js`

```js
describe("Login saucedemo", () => {
  it("login berhasil dengan user valid", () => {
    cy.visit("/");
    cy.get("[data-test=username]").type("standard_user");
    cy.get("[data-test=password]").type("secret_sauce");
    cy.get("[data-test=login-button]").click();
    cy.url().should("include", "/inventory");
    cy.contains("Products").should("be.visible");
  });

  it("login gagal dengan password salah", () => {
    cy.visit("/");
    cy.get("[data-test=username]").type("standard_user");
    cy.get("[data-test=password]").type("salahbanget");
    cy.get("[data-test=login-button]").click();
    cy.get("[data-test=error]").should("contain.text", "Username and password do not match");
  });
});
```

### C. Jalankan test

```bash
npx cypress run --browser chrome
```

---

## ✅ Checklist

| Item                                | Status |
| ----------------------------------- | ------ |
| Cypress terinstal & bisa dijalankan | ☐      |
| Test `example.cypress.io` lulus     | ☐      |
| Test login `saucedemo.com` lulus    | ☐      |
| Assertion minimal 2 per file        | ☐      |
| Tidak ada `cy.wait(2000)`           | ☐      |

---

## 💡 Tips Cepat

* Selector pakai `[data-test=...]` biar stabil.
* Gunakan `cy.contains("text")` buat elemen yang gampang diidentifikasi.
* Mau eksplor fitur lebih lanjut? Coba `https://the-internet.herokuapp.com` buat latihan form, dropdown, upload, dan alert.

