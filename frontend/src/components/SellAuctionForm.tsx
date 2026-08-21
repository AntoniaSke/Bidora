"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";

export default function SellAuctionForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    startingPrice: "",
    endDate: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        rounded-3xl
        border
        border-[var(--bidora-border)]
        bg-white
        p-6
        sm:p-8
        lg:p-10
      "
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT COLUMN */}
        <div className="space-y-6">

          <div>
            <label
              htmlFor="title"
              className="text-sm font-semibold text-[var(--bidora-text)]"
            >
              Auction title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Vintage Canon Camera"
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-[var(--bidora-border)]
                bg-white
                px-4
                py-3.5
                outline-none
                transition
                focus:border-[var(--bidora-primary)]
              "
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="text-sm font-semibold text-[var(--bidora-text)]"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the condition, details and anything buyers should know..."
              rows={6}
              className="
                mt-2
                w-full
                resize-none
                rounded-xl
                border
                border-[var(--bidora-border)]
                bg-white
                px-4
                py-3.5
                outline-none
                transition
                focus:border-[var(--bidora-primary)]
              "
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="text-sm font-semibold text-[var(--bidora-text)]"
            >
              Category
            </label>

            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-[var(--bidora-border)]
                bg-white
                px-4
                py-3.5
                outline-none
                focus:border-[var(--bidora-primary)]
              "
            >
              <option value="">Select category</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Gaming">Gaming</option>
              <option value="Collectibles">Collectibles</option>
              <option value="Art">Art</option>
              <option value="Home">Home</option>
            </select>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* IMAGE UPLOAD */}
          <div>
            <p className="text-sm font-semibold text-[var(--bidora-text)]">
              Item image
            </p>

            <label
              htmlFor="image"
              className="
                mt-2
                flex
                min-h-56
                cursor-pointer
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-dashed
                border-[var(--bidora-border)]
                bg-[var(--bidora-background)]
                px-6
                text-center
                transition
                hover:border-[var(--bidora-primary)]
              "
            >
              <ImagePlus
                size={34}
                className="text-[var(--bidora-primary)]"
              />

              <p className="mt-4 font-semibold text-[var(--bidora-text)]">
                Upload an image
              </p>

              <p className="mt-2 text-sm text-[var(--bidora-text-secondary)]">
                PNG or JPG
              </p>

              <input
                id="image"
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label
              htmlFor="startingPrice"
              className="text-sm font-semibold text-[var(--bidora-text)]"
            >
              Starting price
            </label>

            <div className="relative mt-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--bidora-text-secondary)]">
                €
              </span>

              <input
                id="startingPrice"
                name="startingPrice"
                type="number"
                min="0"
                step="0.01"
                value={form.startingPrice}
                onChange={handleChange}
                placeholder="0.00"
                className="
                  w-full
                  rounded-xl
                  border
                  border-[var(--bidora-border)]
                  bg-white
                  py-3.5
                  pl-8
                  pr-4
                  outline-none
                  focus:border-[var(--bidora-primary)]
                "
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="text-sm font-semibold text-[var(--bidora-text)]"
            >
              Auction ends
            </label>

            <div className="mt-2 flex w-full min-w-0 rounded-xl border border-[var(--bidora-border)] bg-white px-4 py-3.5">
              <input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={form.endDate}
                onChange={handleChange}
                className="
                  block
                  w-full
                  min-w-0
                  border-0
                  bg-transparent
                  p-0
                  outline-none
                "
              />
            </div>
          </div>

        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-10 border-t border-[var(--bidora-border)] pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <p className="text-sm text-[var(--bidora-text-secondary)]">
          You can review the auction before publishing.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">

          <button
            type="button"
            className="
              rounded-xl
              border
              border-[var(--bidora-border)]
              bg-white
              px-6
              py-3
              font-semibold
              text-[var(--bidora-text)]
              transition
              hover:border-[var(--bidora-primary)]
            "
          >
            Save draft
          </button>

          <button
            type="submit"
            className="
              rounded-xl
              bg-[var(--bidora-accent)]
              px-7
              py-3
              font-semibold
              text-white
              transition
              hover:opacity-90
            "
          >
            Continue
          </button>

        </div>
      </div>
    </form>
  );
}