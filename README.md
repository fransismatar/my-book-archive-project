# My Book Archive

A Single Page Application (SPA) for managing a personal book library.

## Features

- Display books in responsive cards
- Add a new book
- Edit existing books
- Delete books
- Mark books as favorite
- Real-time search by book title
- Responsive design with Tailwind CSS
- Data stored using MockAPI

## Technologies

- React
- TypeScript
- Vite
- Tailwind CSS
- MockAPI
- Lucide React

## Project Structure

```
src/
├── components/
│   ├── BookCard.tsx
│   ├── BookModal.tsx
│   └── SearchBar.tsx
├── types/
│   └── book.ts
├── App.tsx
├── index.css
└── main.tsx
```

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
VITE_BOOKS_API_URL=https://YOUR_MOCKAPI_URL/books
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## CRUD Operations

- **GET** – Load all books
- **POST** – Add a new book
- **PUT** – Edit a book
- **PUT** – Toggle favorite status
- **DELETE** – Remove a book

## Author

Fransis Mattar