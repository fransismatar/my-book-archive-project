import {
  BookOpen,
  Image,
  LoaderCircle,
  Pencil,
  Plus,
  UserRound,
  X,
} from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";

import type { Book, BookFormData } from "../types/book";

type BookModalProps = {
  isOpen: boolean;
  editingBook: Book | null;
  formData: BookFormData;
  formError: string;
  isSaving: boolean;
  onClose: () => void;
  onInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80";

function BookModal({
  isOpen,
  editingBook,
  formData,
  formError,
  isSaving,
  onClose,
  onInputChange,
  onSubmit,
}: BookModalProps) {
  if (!isOpen) {
    return null;
  }

  const isEditing = Boolean(editingBook);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-modal-title"
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-white/20 bg-white shadow-[0_35px_100px_rgba(15,23,42,0.35)]"
      >
        <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-violet-950 px-6 py-7 text-white sm:px-8">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute -bottom-12 left-24 h-28 w-28 rounded-full bg-fuchsia-400/10 blur-3xl" />

          <div className="relative flex items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur">
                {isEditing ? <Pencil size={23} /> : <BookOpen size={24} />}
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-200">
                  My Book Archive
                </p>

                <h2
                  id="book-modal-title"
                  className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl"
                >
                  {isEditing ? "Edit Book" : "Add New Book"}
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                  {isEditing
                    ? "Update the information and save your changes."
                    : "Add a new title to your personal book collection."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close modal"
              title="Close"
            >
              <X size={21} />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 sm:p-8">
          {formError && (
            <div
              role="alert"
              className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {formError}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[1fr_220px]">
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Book Title <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <BookOpen
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={onInputChange}
                    placeholder="For example: Atomic Habits"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="author"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Author <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <UserRound
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="author"
                    name="author"
                    type="text"
                    value={formData.author}
                    onChange={onInputChange}
                    placeholder="For example: James Clear"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={onInputChange}
                  placeholder="Write a short summary about the book..."
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div>
                <label
                  htmlFor="coverImage"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Cover Image URL <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Image
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="coverImage"
                    name="coverImage"
                    type="url"
                    value={formData.coverImage}
                    onChange={onInputChange}
                    placeholder="https://example.com/book-cover.jpg"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    required
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Use an external image URL from Google Images, Pexels, Unsplash
                  or Picsum.
                </p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-bold text-slate-700">
                Cover Preview
              </p>

              <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100 shadow-sm">
                <div className="aspect-[3/4]">
                  {formData.coverImage ? (
                    <img
                      src={formData.coverImage}
                      alt="Book cover preview"
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src = fallbackImage;
                      }}
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center px-5 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                        <Image size={25} />
                      </div>

                      <p className="mt-4 text-sm font-semibold text-slate-500">
                        Image preview
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        The book cover will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex min-w-44 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isSaving ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {isEditing ? <Pencil size={18} /> : <Plus size={19} />}
                  {isEditing ? "Save Changes" : "Save Book"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookModal;