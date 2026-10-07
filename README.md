# ⚡ Rakexura PayQR (`rakexura-pay-qr`)
### 🚀 Generative Dynamic UPI Payment & Retail Standee Studio

[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![UPI Protocol](https://img.shields.io/badge/NPCI-UPI_2.0-00d68f?style=for-the-badge&logo=google-pay&logoColor=white)](https://www.npci.org.in/)

**Rakexura PayQR** is a high-performance, generative UPI payment engine and luxury merchant standee creator designed following the **Rakexura Cyber-Luxury Design System** and fintech design patterns from MCP `inspo`.

---

## ✨ Features

- 💸 **Dynamic Price & Amount Engine**:
  - Live instant QR re-rendering as you type amount.
  - Indian Rupees to English Words generator (`₹499` ➔ *"Four Hundred Ninety-Nine Rupees Only"*).
  - Quick amount presets (`₹49`, `₹99`, `₹199`, `₹499`, `₹999`, `₹1,499`, `₹2,499`, `₹4,999`).
  - Incremental quick-add buttons (`+10`, `+50`, `+100`, `+500`, `+1000`).
  - Support for **Open Customer Amount** (leaves amount parameter blank so payers can enter any custom amount on PhonePe/GPay/Paytm).

- 🏦 **Payee VPA & Profile Management**:
  - NPCI UPI VPA format validation (`username@bank`).
  - Saved profile manager (`localStorage`) with quick account switcher.
  - Optional payee name, bill note, and auto-generated transaction reference IDs (`RKX-XXXX-XXX`).

- 🎨 **Generative QR Matrix & Aesthetics**:
  - **Color Gradients**: Cyber Violet, Emerald UPI, Imperial Gold, Cobalt Horizon, and Print-Friendly Counter White.
  - **Dot Patterns**: Smooth squircle, classy dots, tech rounded, and crisp standard.
  - **Corner Eyes**: Soft pill, circle eye, and solid box.
  - **Center Badges**: Official Rakexura crest, BHIM UPI emblem, Google Pay, PhonePe, Paytm, or custom uploaded brand logos.

- 🪧 **Dual Modes: Studio QR vs Retail Counter Standee**:
  - **Studio Minimalist**: Clean digital payment QR for e-commerce checkout and invoices.
  - **Retail Standee Card**: Countertop acrylic standee with brand badge, accepted UPI apps, payable amount pill, and NPCI verification mark.

- 📲 **Instant Actions & Deep Links**:
  - Direct mobile payment launcher (`upi://pay?...` opens Google Pay, PhonePe, or Paytm).
  - Export High-Resolution PNG (2000px HD).
  - Export Scalable Vector Graphics (SVG).
  - Direct Copy QR Image to Clipboard (`navigator.clipboard`).
  - Printable Standee Card layout (`window.print()`).
  - History drawer tracking recently generated bills with one-click restore.

---

## 🛠️ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Development server runs on: **`http://localhost:5174`**
