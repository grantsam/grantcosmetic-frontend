# GrantCosmetic Frontend

This is the frontend web application for GrantCosmetic (**backend repository**), built using **React**, **TypeScript**, and **Vite**. It is designed to provide a fast, responsive, and modern user experience for browsing, searching, and booking cosmetic products and services.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Development](#development)
- [ESLint & Code Quality](#eslint--code-quality)
- [License](#license)

---

## Features

- **Product Browsing**: View and filter cosmetics by category and brand.
- **Product Details**: See detailed information, benefits, testimonials, and photos for each cosmetic product.
- **Cart & Booking**: Add products to cart, manage items, and complete bookings with user information.
- **Responsive UI**: Styled with modern CSS and utility classes for a seamless experience on all devices.
- **Type Safety**: Strict TypeScript types for UI, data, and API interactions.

---

## Tech Stack

- **React**: UI library for building interactive interfaces.
- **TypeScript**: Typed JavaScript for safety and developer experience.
- **Vite**: Lightning-fast build tool and development server.
- **CSS**: Custom styles and utility classes for layout and components.
- **ESLint**: Enforced code quality with recommended React and TypeScript rules.
- **API Client**: For fetching cosmetic data and handling bookings.

---

## Project Structure

```
.
├── public/                # Static assets and icons
├── src/
│   ├── pages/             # Main app pages (e.g., MyCartPage.tsx)
│   ├── types/             # TypeScript types (e.g., type.ts)
│   ├── index.css          # Global styles and utility classes
│   └── main.tsx           # App entry point
├── index.html             # HTML entry (mounts React app)
├── vite.config.ts         # Vite configuration
├── eslint.config.js       # ESLint rules and plugins
└── README.md              # Project documentation
```

---

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)

### Getting Started

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Open http://localhost:5173 in your browser
```

### Building for Production

```bash
yarn build
```

### Preview Production Build

```bash
yarn preview
```

---

## ESLint & Code Quality

Type-aware linting for React and TypeScript is enabled. Key configurations include:

- [@eslint/js](https://eslint.org/)
- [typescript-eslint](https://typescript-eslint.io/)
- [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [eslint-plugin-react-refresh](https://www.npmjs.com/package/eslint-plugin-react-refresh)

To expand ESLint with more React rules, consider:

```js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: { 'react-x': reactX, 'react-dom': reactDom },
  rules: {
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

---

## License

This project is licensed under the MIT License.

---
