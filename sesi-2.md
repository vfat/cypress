gas — ini **Sesi 2: E2E Happy Path**, masih gaya *VS Code + website publik*, biar gampang dicerna sama tester manual. fokusnya sekarang: ngerangkai **alur lengkap dari login → aksi → verifikasi → logout**, bukan cuma satu form doang.

---

# 🧩 Worksheet Sesi 2 – E2E Happy Path

> **Tujuan:**
> Tester ngerti cara bikin *alur end-to-end* (E2E) yang utuh, termasuk navigasi, form, redirect, dan guard (proteksi halaman).

---

## 🧠 1. Materi

| Topik              | Penjelasan                                                         |
| ------------------ | ------------------------------------------------------------------ |
| **Happy Path**     | Jalur user normal yang ideal tanpa error: login → aksi → logout.   |
| **E2E Flow**       | Menguji seluruh proses dari awal sampai akhir.                     |
| **Redirect Check** | Pastikan user diarahkan ke halaman benar setelah aksi.             |
| **Guard Basic**    | Pastikan user nggak bisa akses halaman tertentu kalau belum login. |

---

## 💻 2. Example (Website: `https://www.saucedemo.com`)

### A. Base URL

`cypress.config.js`

```js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: { baseUrl: "https://www.saucedemo.com", video: false }
});
```

---

### B. File Test `cypress/e2e/happy-path.cy.js`

```js
describe("E2E Happy Path – Saucedemo", () => {
  
  it("Login → Add product → Checkout → Logout", () => {
    // STEP 1: Login
    cy.visit("/");
    cy.get("[data-test=username]").type("standard_user");
    cy.get("[data-test=password]").type("secret_sauce");
    cy.get("[data-test=login-button]").click();
    cy.url().should("include", "/inventory");

    // STEP 2: Tambah 1 produk
    cy.get(".inventory_item").first().within(() => {
      cy.get("button").click();
    });
    cy.get(".shopping_cart_badge").should("contain.text", "1");

    // STEP 3: Masuk ke cart
    cy.get(".shopping_cart_link").click();
    cy.url().should("include", "/cart");

    // STEP 4: Checkout
    cy.get("[data-test=checkout]").click();
    cy.url().should("include", "/checkout-step-one");

    cy.get("[data-test=firstName]").type("Vicky");
    cy.get("[data-test=lastName]").type("Fatrian");
    cy.get("[data-test=postalCode]").type("12345");
    cy.get("[data-test=continue]").click();

    cy.url().should("include", "/checkout-step-two");
    cy.contains("Payment Information").should("be.visible");

    // STEP 5: Selesaikan checkout
    cy.get("[data-test=finish]").click();
    cy.contains("Thank you for your order!").should("be.visible");

    // STEP 6: Logout
    cy.get("#react-burger-menu-btn").click();
    cy.get("#logout_sidebar_link").click();
    cy.url().should("include", "/");
  });

});
```

---

### C. Jalankan

```bash
npx cypress open
```

→ Pilih browser → Klik file `happy-path.cy.js`
Atau headless:

```bash
npx cypress run --browser chrome --spec "cypress/e2e/happy-path.cy.js"
```

---

### D. Penjelasan konsep

| Langkah       | Apa yang dites                        | Kenapa penting                          |
| ------------- | ------------------------------------- | --------------------------------------- |
| Login         | Validasi kredensial dan redirect awal | Semua flow butuh sesi login             |
| Tambah produk | Interaksi dasar (klik tombol dinamis) | Ngetes fungsi utama aplikasi            |
| Checkout      | Navigasi multi-page                   | Uji form dan alur transaksi             |
| Finish        | Verifikasi hasil akhir                | Pastikan proses selesai                 |
| Logout        | State reset                           | Menjamin sesi user ditutup dengan benar |

---

## 🧩 3. Real Task (Website: `https://the-internet.herokuapp.com`)

### A. Base URL

```js
e2e: { baseUrl: "https://the-internet.herokuapp.com" }
```

### B. File Test `cypress/e2e/e2e-flow-heroku.cy.js`

```js
describe("E2E Flow di The Internet", () => {

  it("Login → akses halaman protected → logout", () => {
    // Login
    cy.visit("/login");
    cy.get("#username").type("tomsmith");
    cy.get("#password").type("SuperSecretPassword!");
    cy.get("button[type=submit]").click();

    cy.url().should("include", "/secure");
    cy.contains("Secure Area").should("be.visible");

    // Guard test: akses halaman tanpa login
    cy.visit("/logout");
    cy.url().should("include", "/login");

    // Coba langsung buka /secure (harus redirect login)
    cy.visit("/secure");
    cy.url().should("include", "/login");
  });

});
```

---

### C. Tantangan Lanjutan

1. Tambahkan test untuk **negative flow**:

   * Salah password → gagal login.
   * Akses `/secure` tanpa login → redirect ke `/login`.
2. Tambahkan assertion buat **pesan sukses** saat login benar.
3. Buat file baru `checkout-flow.cy.js` di saucedemo (optional):

   * Login → add dua produk → checkout → pastikan total harga sesuai.

---

## ✅ Checklist Sesi 2

| Item                                 | Status |
| ------------------------------------ | ------ |
| Test E2E Saucedemo sukses dijalankan | ☐      |
| Test guard di Herokuapp jalan        | ☐      |
| Ada minimal 3 assertion di tiap test | ☐      |
| Semua test tanpa `cy.wait(ms)`       | ☐      |
| Flow login–checkout–logout lengkap   | ☐      |

---

## 💡 Catatan Penting

* Gunakan `cy.url()` dan `cy.contains()` buat verifikasi flow berpindah halaman.
* Kalau elemen dinamis (misal tombol Add to Cart berubah jadi Remove),
  tambahkan `.should("contain.text", "Remove")` setelah klik buat jaga validasi state.
* Simpan setiap flow E2E di file terpisah biar mudah di-maintain.

---

📍 **Next (Sesi 3): Network & State Control**

> Lo bakal belajar `cy.intercept()` dan `fixture`, biar bisa ngetes API dan data loading tanpa nunggu server asli — alias full kontrol atas data test.
