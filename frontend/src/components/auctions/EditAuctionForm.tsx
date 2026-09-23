"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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

type AuctionFormData =
  z.infer<typeof auctionSchema>;

type EditAuctionFormProps = {
  auctionId: string;
};

export default function EditAuctionForm({
  auctionId,
}: EditAuctionFormProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] =
    useState(true);

  const [submitError, setSubmitError] =
    useState("");

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [existingImage, setExistingImage] =
    useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<AuctionFormData>({
    resolver: zodResolver(auctionSchema),
  });

  useEffect(() => {
    async function loadAuction() {
      try {
        const response = await fetch(
          `http://localhost:4000/api/auctions/${auctionId}`
        );

        if (!response.ok) {
          setSubmitError(
            "Could not load auction."
          );

          return;
        }

        const auction =
          await response.json();

        reset({
          title: auction.title,
          description:
            auction.description,
          category:
            auction.category,
          startingPrice:
            auction.startingPrice,
          endDate:
            auction.endsAt.slice(
              0,
              16
            ),
        });

        setExistingImage(
          auction.image || ""
        );

        setImagePreview(
          auction.image || null
        );
      } catch (error) {
        console.error(
          "LOAD AUCTION ERROR:",
          error
        );

        setSubmitError(
          "Could not load auction."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadAuction();
  }, [
    auctionId,
    reset,
  ]);

  async function uploadAuctionImage(
    file: File
  ): Promise<string> {
    const signatureResponse =
      await fetch(
        "http://localhost:4000/api/uploads/signature",
        {
          method: "POST",
          credentials: "include",
        }
      );

    if (
      signatureResponse.status === 401
    ) {
      router.push("/login");

      throw new Error(
        "You must be logged in to upload an image."
      );
    }

    if (!signatureResponse.ok) {
      throw new Error(
        "Could not prepare image upload."
      );
    }

    const {
      timestamp,
      signature,
      folder,
      cloudName,
      apiKey,
    } =
      await signatureResponse.json();

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "api_key",
      apiKey
    );

    formData.append(
      "timestamp",
      String(timestamp)
    );

    formData.append(
      "signature",
      signature
    );

    formData.append(
      "folder",
      folder
    );

    const uploadResponse =
      await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

    const uploadResult =
      await uploadResponse.json();

    if (!uploadResponse.ok) {
      console.error(
        "CLOUDINARY UPLOAD ERROR:",
        uploadResult
      );

      throw new Error(
        uploadResult?.error?.message ||
          "Image upload failed."
      );
    }

    return uploadResult.secure_url;
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setSubmitError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setSubmitError(
        "Please select a JPG, PNG or WebP image."
      );

      event.target.value = "";
      return;
    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      setSubmitError(
        "Image must be smaller than 5MB."
      );

      event.target.value = "";
      return;
    }

    setImageFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(
      previewUrl
    );
  }

  async function onSubmit(
    data: AuctionFormData
  ) {
    setSubmitError("");

    try {
      let imageUrl =
        existingImage;

      /*
        Αν επέλεξε νέα εικόνα,
        κάνουμε πρώτα Cloudinary upload.
      */
      if (imageFile) {
        imageUrl =
          await uploadAuctionImage(
            imageFile
          );
      }

      const response =
        await fetch(
          `http://localhost:4000/api/auctions/${auctionId}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials:
              "include",

            body: JSON.stringify({
              title:
                data.title,

              description:
                data.description,

              category:
                data.category,

              startingPrice:
                Number(
                  data.startingPrice
                ),

              endsAt:
                data.endDate,

              image:
                imageUrl,
            }),
          }
        );

      const result =
        await response.json();

      if (
        response.status === 401
      ) {
        router.push(
          "/login"
        );

        return;
      }

      if (!response.ok) {
        const message =
          result.message ||
          "Could not update auction.";

        setSubmitError(
          message
        );

        toast.error(
          message
        );

        return;
      }

      toast.success(
        "Auction updated successfully."
      );

      router.push(
        "/profile/auctions"
      );

      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not update auction.";

      setSubmitError(
        message
      );

      toast.error(
        message
      );
    }
  }

  if (isLoading) {
    return (
      <p className="text-[var(--bidora-text-secondary)]">
        Loading auction...
      </p>
    );
  }

  return (
    <form
      onSubmit={
        handleSubmit(
          onSubmit
        )
      }
      className="
        rounded-3xl
        border
        border-[var(--bidora-border)]
        bg-white
        p-6
        sm:p-8
      "
    >
      <div className="space-y-6">

        {/* IMAGE */}
        <div>
          <p className="text-sm font-semibold text-[var(--bidora-text)]">
            Item image
          </p>

          <label
            htmlFor="image"
            className="
              mt-2
              flex
              min-h-64
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
                src={
                  imagePreview
                }
                alt="Auction preview"
                className="
                  h-64
                  w-full
                  rounded-xl
                  object-cover
                "
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
                  JPG, PNG or WebP · max 5MB
                </p>
              </>
            )}

            <input
              id="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={
                handleImageChange
              }
              className="hidden"
            />
          </label>

          {imagePreview && (
            <p className="mt-2 text-xs text-[var(--bidora-text-secondary)]">
              Click the image to choose a different one.
            </p>
          )}
        </div>

        {/* TITLE */}
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
            {...register(
              "title"
            )}
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
              {
                errors
                  .title
                  .message
              }
            </p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div>
          <label
            htmlFor="description"
            className="text-sm font-semibold text-[var(--bidora-text)]"
          >
            Description
          </label>

          <textarea
            id="description"
            rows={6}
            {...register(
              "description"
            )}
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
              {
                errors
                  .description
                  .message
              }
            </p>
          )}
        </div>

        {/* CATEGORY */}
        <div>
          <label
            htmlFor="category"
            className="text-sm font-semibold text-[var(--bidora-text)]"
          >
            Category
          </label>

          <select
            id="category"
            {...register(
              "category"
            )}
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
            <option value="Electronics">
              Electronics
            </option>

            <option value="Fashion">
              Fashion
            </option>

            <option value="Gaming">
              Gaming
            </option>

            <option value="Collectibles">
              Collectibles
            </option>

            <option value="Art">
              Art
            </option>

            <option value="Home">
              Home
            </option>
          </select>

          {errors.category && (
            <p className="mt-2 text-sm text-red-500">
              {
                errors
                  .category
                  .message
              }
            </p>
          )}
        </div>

        {/* STARTING PRICE */}
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
              min="0.01"
              step="0.01"
              {...register(
                "startingPrice",
                {
                  valueAsNumber:
                    true,
                }
              )}
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
              {
                errors
                  .startingPrice
                  .message
              }
            </p>
          )}
        </div>

        {/* END DATE */}
        <div>
          <label
            htmlFor="endDate"
            className="text-sm font-semibold text-[var(--bidora-text)]"
          >
            Auction ends
          </label>

          <input
            id="endDate"
            type="datetime-local"
            {...register(
              "endDate"
            )}
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
          />

          {errors.endDate && (
            <p className="mt-2 text-sm text-red-500">
              {
                errors
                  .endDate
                  .message
              }
            </p>
          )}
        </div>

      </div>

      {/* ERROR */}
      {submitError && (
        <div
          className="
            mt-6
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
          "
        >
          <p className="text-sm font-medium text-red-600">
            {submitError}
          </p>
        </div>
      )}

      {/* ACTIONS */}
      <div
        className="
          mt-8
          flex
          flex-col-reverse
          gap-3
          border-t
          border-[var(--bidora-border)]
          pt-6
          sm:flex-row
          sm:justify-end
        "
      >
        <button
          type="button"
          onClick={() =>
            router.back()
          }
          disabled={
            isSubmitting
          }
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
            disabled:opacity-60
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            isSubmitting
          }
          className="
            rounded-xl
            bg-[var(--bidora-primary)]
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:bg-[var(--bidora-primary-hover)]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {isSubmitting
            ? "Saving..."
            : "Save changes"}
        </button>
      </div>
    </form>
  );
}