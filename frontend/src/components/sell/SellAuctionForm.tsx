"use client";

import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


const auctionSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(80, "Title must be less than 80 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),

  category: z
    .string()
    .min(1, "Please select a category"),

  startingPrice: z
    .number()
    .positive("Starting price must be greater than 0"),

  endDate: z
    .string()
    .min(1, "Please select when the auction should end"),
});

type AuctionFormData = z.infer<typeof auctionSchema>;

export default function SellAuctionForm() {


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuctionFormData>({
    resolver: zodResolver(auctionSchema),
  });

  function onSubmit(data: AuctionFormData) {
    console.log(data);
  }

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
              type="text"
              {...register("title")}
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
            {errors.title && (
              <p className="mt-2 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
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
              {...register("description")}
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

            {errors.description && (
              <p className="mt-2 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
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
              {...register("category")}
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

            {errors.category && (
              <p className="mt-2 text-sm text-red-500">
                {errors.category.message}
              </p>
            )}
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
                overflow-hidden
                rounded-2xl
                border
                border-dashed
                border-[var(--bidora-border)]
                bg-[var(--bidora-background)]
                p-3
                text-center
                transition
                hover:border-[var(--bidora-primary)]
              "
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Auction preview"
                  className="h-56 w-full rounded-xl object-cover"
                />
              ) : (
                <>
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
                </>
              )}

              <input
                id="image"
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleImageChange}
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
                type="number"
                step="0.01"
                {...register("startingPrice", {
                  valueAsNumber: true,
                })}
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
            {errors.startingPrice && (
              <p className="mt-2 text-sm text-red-500">
                {errors.startingPrice.message}
              </p>
            )}
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
                type="datetime-local"
                {...register("endDate")}
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

            {errors.endDate && (
              <p className="mt-2 text-sm text-red-500">
                {errors.endDate.message}
              </p>
            )}
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
