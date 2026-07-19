import {
  BookOpen,
  Heart,
  LibraryBig,
  LoaderCircle,
  Plus,
  RefreshCw,
} from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState,
} from "react";

import BookCard from "./components/BookCard";
import BookModal from "./components/BookModal";
import SearchBar from "./components/SearchBar";

import type { Book, BookFormData } from "./types/book";

const API_URL =
  import.meta.env.VITE_BOOKS_API_URL ||
  "https://6a5ce71d0ad09982aef6a6df.mockapi.io/api/v1/books";

const emptyFormData: BookFormData = {
  title: "",
  author: "",
  description: "",
  coverImage: "",
};

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] =
    useState<BookFormData>(emptyFormData);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [updatingFavoriteId, setUpdatingFavoriteId] = useState<
    string | null
  >(null);

  useEffect(() => {
    void fetchBooks();
  }, []);

  async function fetchBooks() {
    if (!API_URL) {
      setError(
        "API URL is missing. Check VITE_BOOKS_API_URL inside the .env file.",
      );
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch books.");
      }

      const data = (await response.json()) as Book[];

      setBooks(data);
    } catch (error) {
      console.error("Fetch books error:", error);
      setError("Could not load your books. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function openAddModal() {
    setEditingBook(null);
    setFormData(emptyFormData);
    setFormError("");
    setIsModalOpen(true);
  }

  function openEditModal(book: Book) {
    setEditingBook(book);

    setFormData({
      title: book.title,
      author: book.author,
      description: book.description ?? "",
      coverImage: book.coverImage,
    });

    setFormError("");
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isSaving) {
      return;
    }

    setIsModalOpen(false);
    setEditingBook(null);
    setFormData(emptyFormData);
    setFormError("");
  }

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    if (formError) {
      setFormError("");
    }
  }

  function validateForm(): string {
    if (!formData.title.trim()) {
      return "Book title is required.";
    }

    if (!formData.author.trim()) {
      return "Author name is required.";
    }

    if (!formData.coverImage.trim()) {
      return "Cover image URL is required.";
    }

    try {
      const imageUrl = new URL(formData.coverImage.trim());

      if (!["http:", "https:"].includes(imageUrl.protocol)) {
        return "The image URL must begin with http:// or https://.";
      }
    } catch {
      return "Please enter a valid image URL.";
    }

    return "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    const bookPayload = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      description: formData.description.trim(),
      coverImage: formData.coverImage.trim(),
      isFavorite: editingBook?.isFavorite ?? false,
    };

    try {
      setIsSaving(true);
      setFormError("");
      setError("");

      const requestUrl = editingBook
        ? `${API_URL}/${editingBook.id}`
        : API_URL;

      const response = await fetch(requestUrl, {
        method: editingBook ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookPayload),
      });

      if (!response.ok) {
        throw new Error(
          editingBook
            ? "Failed to update book."
            : "Failed to create book.",
        );
      }

      const savedBook = (await response.json()) as Book;

      if (editingBook) {
        setBooks((currentBooks) =>
          currentBooks.map((book) =>
            book.id === savedBook.id ? savedBook : book,
          ),
        );
      } else {
        setBooks((currentBooks) => [savedBook, ...currentBooks]);
      }

      setIsModalOpen(false);
      setEditingBook(null);
      setFormData(emptyFormData);
      setFormError("");
    } catch (error) {
      console.error("Save book error:", error);

      setFormError(
        editingBook
          ? "Could not update the book. Please try again."
          : "Could not add the book. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleFavorite(book: Book) {
    try {
      setUpdatingFavoriteId(book.id);
      setError("");

      const response = await fetch(`${API_URL}/${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: book.title,
          author: book.author,
          description: book.description ?? "",
          coverImage: book.coverImage,
          isFavorite: !book.isFavorite,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update favorite status.");
      }

      const updatedBook = (await response.json()) as Book;

      setBooks((currentBooks) =>
        currentBooks.map((currentBook) =>
          currentBook.id === updatedBook.id
            ? updatedBook
            : currentBook,
        ),
      );
    } catch (error) {
      console.error("Favorite update error:", error);
      setError("Could not update the favorite status.");
    } finally {
      setUpdatingFavoriteId(null);
    }
  }

  async function handleDeleteBook(book: Book) {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete "${book.title}"?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_URL}/${book.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete book.");
      }

      setBooks((currentBooks) =>
        currentBooks.filter(
          (currentBook) => currentBook.id !== book.id,
        ),
      );
    } catch (error) {
      console.error("Delete book error:", error);
      setError("Could not delete the book. Please try again.");
    }
  }

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(normalizedSearchTerm),
  );

  const favoriteBooksCount = books.filter(
    (book) => book.isFavorite,
  ).length;

  return (
    <div className="min-h-screen bg-[#f7f7fb] text-slate-900">
      <header className="relative overflow-hidden border-b border-slate-200 bg-slate-950 text-white">
        <div className="absolute -left-24 -top-28 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-xl backdrop-blur">
                <LibraryBig size={28} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-violet-300">
                  Personal Collection
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                  My Book Archive
                </h1>

                <p className="mt-2 text-sm text-slate-300 sm:text-base">
                  Organize and manage your favorite books in one place.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-violet-950/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Plus size={20} />
              Add Book
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Total Books
                </p>

                <p className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
                  {books.length}
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <BookOpen size={26} />
              </div>
            </div>
          </div>

          <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Favorite Books
                </p>

                <p className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
                  {favoriteBooksCount}
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <Heart size={26} className="fill-current" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <p className="shrink-0 text-sm font-medium text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-900">
              {filteredBooks.length}
            </span>{" "}
            {filteredBooks.length === 1 ? "book" : "books"}
          </p>
        </section>

        {error && (
          <div
            role="alert"
            className="mt-6 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm font-semibold">{error}</p>

            <button
              type="button"
              onClick={() => void fetchBooks()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
            >
              <RefreshCw size={17} />
              Try Again
            </button>
          </div>
        )}

        {isLoading ? (
          <section className="mt-8 flex min-h-80 flex-col items-center justify-center rounded-[30px] border border-slate-200 bg-white shadow-sm">
            <LoaderCircle
              size={44}
              className="animate-spin text-violet-600"
            />

            <h2 className="mt-5 text-lg font-bold text-slate-800">
              Loading your library
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Please wait while we retrieve your books.
            </p>
          </section>
        ) : filteredBooks.length === 0 ? (
          <section className="mt-8 flex min-h-80 flex-col items-center justify-center rounded-[30px] border border-dashed border-slate-300 bg-white px-6 text-center shadow-sm">
            <div className="flex h-18 w-18 items-center justify-center rounded-3xl bg-violet-100 text-violet-700">
              <BookOpen size={34} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              {searchTerm
                ? "No matching books found"
                : "Your archive is empty"}
            </h2>

            <p className="mt-2 max-w-md leading-7 text-slate-500">
              {searchTerm
                ? `We could not find a book matching "${searchTerm}". Try another title.`
                : "Add your first book and start building your personal collection."}
            </p>

            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Clear Search
              </button>
            ) : (
              <button
                type="button"
                onClick={openAddModal}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-6 py-3 font-bold text-white transition hover:bg-violet-700"
              >
                <Plus size={19} />
                Add First Book
              </button>
            )}
          </section>
        ) : (
          <section className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isUpdatingFavorite={
                  updatingFavoriteId === book.id
                }
                onEdit={openEditModal}
                onDelete={(selectedBook) =>
                  void handleDeleteBook(selectedBook)
                }
                onToggleFavorite={(selectedBook) =>
                  void handleToggleFavorite(selectedBook)
                }
              />
            ))}
          </section>
        )}
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
          My Book Archive · React · TypeScript · Tailwind CSS · MockAPI
        </div>
      </footer>

      <BookModal
        isOpen={isModalOpen}
        editingBook={editingBook}
        formData={formData}
        formError={formError}
        isSaving={isSaving}
        onClose={closeModal}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default App;