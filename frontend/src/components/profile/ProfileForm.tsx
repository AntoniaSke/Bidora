"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username is too long"),

  email: z
    .string()
    .email("Please enter a valid email"),

  phone: z
    .string()
    .optional(),

  address: z
    .string()
    .optional(),

  city: z
    .string()
    .optional(),

  postalCode: z
    .string()
    .optional(),

  country: z
    .string()
    .optional(),

  bio: z
    .string()
    .max(300, "Bio must be less than 300 characters")
    .optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),

    // Demo data for now.
    defaultValues: {
      fullName: "Demo User",
      username: "demo_user",
      email: "demo@bidora.com",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "Greece",
      bio: "",
    },
  });

  function onSubmit(data: ProfileFormData) {
    console.log(data);
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
      {/* Header */}
      <div className="border-b border-[var(--bidora-border)] pb-6">

        <h2 className="text-2xl font-bold text-[var(--bidora-text)]">
          Personal information
        </h2>

        <p className="mt-2 text-sm text-[var(--bidora-text-secondary)]">
          Update your account and contact information.
        </p>

      </div>

      {/* FORM */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* FULL NAME */}
        <div>
          <label
            htmlFor="fullName"
            className="text-sm font-semibold text-[var(--bidora-text)]"
          >
            Full name
          </label>

          <input
            id="fullName"
            type="text"
            {...register("fullName")}
            className="
              mt-2
              w-full
              rounded-xl
              border
              border-[var(--bidora-border)]
              px-4
              py-3.5
              outline-none
              focus:border-[var(--bidora-primary)]
            "
          />

          {errors.fullName && (
            <p className="mt-2 text-sm text-red-500">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* USERNAME */}
        <div>
          <label
            htmlFor="username"
            className="text-sm font-semibold text-[var(--bidora-text)]"
          >
            Username
          </label>

          <input
            id="username"
            type="text"
            {...register("username")}
            className="
              mt-2
              w-full
              rounded-xl
              border
              border-[var(--bidora-border)]
              px-4
              py-3.5
              outline-none
              focus:border-[var(--bidora-primary)]
            "
          />

          {errors.username && (
            <p className="mt-2 text-sm text-red-500">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label
            htmlFor="email"
            className="text-sm font-semibold text-[var(--bidora-text)]"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            {...register("email")}
            className="
              mt-2
              w-full
              rounded-xl
              border
              border-[var(--bidora-border)]
              px-4
              py-3.5
              outline-none
              focus:border-[var(--bidora-primary)]
            "
          />

          {errors.email && (
            <p className="mt-2 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* PHONE */}
        <div>
          <label
            htmlFor="phone"
            className="text-sm font-semibold text-[var(--bidora-text)]"
          >
            Phone number
          </label>

          <input
            id="phone"
            type="tel"
            {...register("phone")}
            placeholder="+30..."
            className="
              mt-2
              w-full
              rounded-xl
              border
              border-[var(--bidora-border)]
              px-4
              py-3.5
              outline-none
              focus:border-[var(--bidora-primary)]
            "
          />
        </div>

        {/* ADDRESS */}
        <div className="md:col-span-2">
          <label
            htmlFor="address"
            className="text-sm font-semibold text-[var(--bidora-text)]"
          >
            Address
          </label>

          <input
            id="address"
            type="text"
            {...register("address")}
            placeholder="Street and number"
            className="
              mt-2
              w-full
              rounded-xl
              border
              border-[var(--bidora-border)]
              px-4
              py-3.5
              outline-none
              focus:border-[var(--bidora-primary)]
            "
          />
        </div>

        {/* CITY */}
        <div>
          <label
            htmlFor="city"
            className="text-sm font-semibold text-[var(--bidora-text)]"
          >
            City
          </label>

          <input
            id="city"
            type="text"
            {...register("city")}
            className="
              mt-2
              w-full
              rounded-xl
              border
              border-[var(--bidora-border)]
              px-4
              py-3.5
              outline-none
              focus:border-[var(--bidora-primary)]
            "
          />
        </div>

        {/* POSTAL CODE */}
        <div>
          <label
            htmlFor="postalCode"
            className="text-sm font-semibold text-[var(--bidora-text)]"
          >
            Postal code
          </label>

          <input
            id="postalCode"
            type="text"
            {...register("postalCode")}
            className="
              mt-2
              w-full
              rounded-xl
              border
              border-[var(--bidora-border)]
              px-4
              py-3.5
              outline-none
              focus:border-[var(--bidora-primary)]
            "
          />
        </div>

        {/* COUNTRY */}
        <div className="md:col-span-2">
          <label
            htmlFor="country"
            className="text-sm font-semibold text-[var(--bidora-text)]"
          >
            Country
          </label>

          <select
            id="country"
            {...register("country")}
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
            <option value="Greece">Greece</option>
            <option value="Cyprus">Cyprus</option>
            <option value="Italy">Italy</option>
            <option value="France">France</option>
            <option value="Germany">Germany</option>
          </select>
        </div>

        {/* BIO */}
        <div className="md:col-span-2">
          <label
            htmlFor="bio"
            className="text-sm font-semibold text-[var(--bidora-text)]"
          >
            Bio
          </label>

          <textarea
            id="bio"
            {...register("bio")}
            rows={4}
            placeholder="Tell buyers and sellers a little about yourself..."
            className="
              mt-2
              w-full
              resize-none
              rounded-xl
              border
              border-[var(--bidora-border)]
              px-4
              py-3.5
              outline-none
              focus:border-[var(--bidora-primary)]
            "
          />

          {errors.bio && (
            <p className="mt-2 text-sm text-red-500">
              {errors.bio.message}
            </p>
          )}
        </div>

      </div>

      {/* SAVE */}
      <div className="mt-8 flex justify-end border-t border-[var(--bidora-border)] pt-6">

        <button
          type="submit"
          className="
            rounded-xl
            bg-[var(--bidora-primary)]
            px-7
            py-3
            font-semibold
            text-white
            transition
            hover:bg-[var(--bidora-primary-hover)]
          "
        >
          Save changes
        </button>

      </div>
    </form>
  );
}