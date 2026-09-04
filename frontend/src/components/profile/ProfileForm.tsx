"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const profileSchema = z.object({
  fullName: z
    .string()
    .refine(
      (value) => value === "" || value.length >= 2,
      "Name must be at least 2 characters"
    ),

  username: z.string(),

  email: z.string(),

  phone: z.string().optional(),

  address: z.string().optional(),

  city: z.string().optional(),

  postalCode: z.string().optional(),

  country: z.string().optional(),

  bio: z
    .string()
    .max(300, "Bio must be less than 300 characters")
    .optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(
          "http://localhost:4000/api/auth/me",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          console.error("Could not load profile");
          return;
        }

        const user = await response.json();

        reset({
          fullName: user.name ?? "",
          username: user.username ?? "",
          email: user.email ?? "",
          phone: user.phone ?? "",
          address: user.address ?? "",
          city: user.city ?? "",
          postalCode: user.postalCode ?? "",
          country: user.country ?? "",
          bio: user.bio ?? "",
        });
      } catch (error) {
        console.error("Profile request failed:", error);
      }
    }

    loadProfile();
  }, [reset]);

  async function onSubmit(data: ProfileFormData) {
    setSuccessMessage("");
    setErrorMessage("");

    console.log("SUBMIT CALLED");
    console.log("FORM DATA:", data);

    try {
      const response = await fetch(
        "http://localhost:4000/api/users/me",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: data.fullName || undefined,
            phone: data.phone,
            address: data.address,
            city: data.city,
            postalCode: data.postalCode,
            country: data.country,
            bio: data.bio,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("PROFILE UPDATE ERROR:", result);

        setErrorMessage(
          result.message || "Could not update profile"
        );

        return;
      }

      setSuccessMessage("Profile updated successfully");

      console.log("Profile updated:", result);
    } catch (error) {
      console.error("Profile update failed:", error);

      setErrorMessage("Could not connect to the server");
    }
  }

  function onInvalid(errors: unknown) {
    console.log("VALIDATION FAILED:", errors);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
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
      {/* HEADER */}
      <div className="border-b border-[var(--bidora-border)] pb-6">
        <h2 className="text-2xl font-bold text-[var(--bidora-text)]">
          Personal information
        </h2>

        <p className="mt-2 text-sm text-[var(--bidora-text-secondary)]">
          Update your account and contact information.
        </p>
      </div>

      {/* FORM FIELDS */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">

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
            placeholder="Your full name"
            className="
              mt-2
              w-full
              rounded-xl
              border
              border-[var(--bidora-border)]
              px-4
              py-3.5
              outline-none
              transition
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
            readOnly
            className="
              mt-2
              w-full
              cursor-not-allowed
              rounded-xl
              border
              border-[var(--bidora-border)]
              bg-gray-50
              px-4
              py-3.5
              text-[var(--bidora-text-secondary)]
              outline-none
            "
          />
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
            readOnly
            className="
              mt-2
              w-full
              cursor-not-allowed
              rounded-xl
              border
              border-[var(--bidora-border)]
              bg-gray-50
              px-4
              py-3.5
              text-[var(--bidora-text-secondary)]
              outline-none
            "
          />
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
              transition
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
              transition
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
            placeholder="Athens"
            className="
              mt-2
              w-full
              rounded-xl
              border
              border-[var(--bidora-border)]
              px-4
              py-3.5
              outline-none
              transition
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
            placeholder="15772"
            className="
              mt-2
              w-full
              rounded-xl
              border
              border-[var(--bidora-border)]
              px-4
              py-3.5
              outline-none
              transition
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
              transition
              focus:border-[var(--bidora-primary)]
            "
          >
            <option value="">Select country</option>
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
              transition
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

      {/* ACTIONS */}
      <div
        className="
          mt-8
          flex
          flex-col
          gap-4
          border-t
          border-[var(--bidora-border)]
          pt-6
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          {successMessage && (
            <p className="text-sm font-medium text-green-600">
              {successMessage}
            </p>
          )}

          {errorMessage && (
            <p className="text-sm font-medium text-red-500">
              {errorMessage}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="
            rounded-xl
            bg-[var(--bidora-primary)]
            px-7
            py-3
            font-semibold
            text-white
            transition
            hover:bg-[var(--bidora-primary-hover)]
            disabled:cursor-not-allowed
            disabled:opacity-60
            cursor-pointer
          "
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}