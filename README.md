# Evመሪ – EV Charging Station Management Web Frontend

Evመሪ is a modern web application for managing electric vehicle (EV) charging stations in Ethiopia. It empowers station owners to register, monitor, and optimize their charging infrastructure with real-time analytics, QR code management, revenue tracking, and more.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Core Functionality](#core-functionality)
- [QR Code Management](#qr-code-management)
- [Styling & UI](#styling--ui)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Station Owner Registration & Profile Verification**
- **Station Management**: Add, edit, view, and delete stations
- **Connector Management**: Manage connectors and their QR codes
- **QR Code Management**: View, download, and regenerate QR codes for each connector
- **Analytics Dashboard**: Real-time revenue, energy, and session statistics
- **Reports**: Downloadable analytics reports (PDF)
- **Revenue & Wallet**: Track transactions, add funds, and withdraw earnings
- **Reviews**: Monitor and respond to customer feedback
- **Settings**: Manage notification preferences and company info
- **Responsive Design**: Works on desktop and mobile devices

---

## Project Structure

```
web_frontend/
├── public/                # Static assets (images, icons)
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication & profile components
│   │   ├── dashboard/     # Dashboard sidebar and widgets
│   │   ├── landing/       # Landing page, About, Footer, etc.
│   │   ├── reports/       # Analytics and reporting
│   │   ├── revenue/       # Revenue, wallet, and payment modals
│   │   ├── reviews/       # Reviews and feedback
│   │   ├── settings/      # User/company settings
│   │   ├── stations/      # Station & connector management, QR code modal
│   ├── styles/            # Custom CSS files
│   ├── App.jsx            # Main app routing
│   ├── main.jsx           # App entry point
│   └── index.css          # Tailwind and global styles
├── index.html             # App HTML entry
├── package.json           # Project dependencies and scripts
├── tailwind.config.js     # Tailwind CSS config
├── vite.config.js         # Vite build config
└── README.md              # Project documentation
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-org/evmeri-frontend.git
   cd web_frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## Available Scripts

- `npm run dev` – Start the development server
- `npm run build` – Build for production
- `npm run preview` – Preview the production build
- `npm run lint` – Run ESLint

---

## Core Functionality

### Authentication & Profile

- Register as a station owner, verify email, and complete business profile
- Upload required documents for verification
- Login/logout and password reset flows

### Station & Connector Management

- Add, edit, and delete stations
- Manage station details: address, amenities, opening hours, etc.
- Add, edit, and remove connectors for each station

### QR Code Management

- View QR codes for each connector in a modal ([`QRCodeModal`](src/components/stations/QRCodeModal.jsx))
- Download QR codes as PNG for printing
- Regenerate QR codes for security
- Copy payment URLs for mobile payments

### Analytics & Reports

- Dashboard with revenue, energy, and session metrics
- Visual charts for energy and revenue trends
- Download analytics reports as PDF

### Revenue & Wallet

- View transaction history
- Add funds and withdraw earnings
- Manage payment methods

### Reviews

- View and respond to customer reviews for each station

---

## QR Code Management

- Access QR codes from the station table row actions or dropdown
- Modal displays all connectors with QR codes, payment URLs, and status
- Download or regenerate QR codes with a single click
- Copy payment URLs to clipboard for sharing

For more details, see [QR_CODE_FEATURE.md](QR_CODE_FEATURE.md).

---

## Styling & UI

- Built with [Tailwind CSS](https://tailwindcss.com/) for rapid UI development
- Custom styles in `src/styles/`
- Responsive design for mobile and desktop
- Accessible and modern UI components

---

## API Integration

- All data is fetched from a REST API (see `.env` or code for base URL)
- Authenticated requests use a token stored in `localStorage`
- See `src/components/` for API usage examples

---

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Acknowledgements

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [react-icons](https://react-icons.github.io/react-icons/)

---

For more information, see the [QR_CODE_FEATURE.md](QR_CODE_FEATURE.md) and in-code documentation.
