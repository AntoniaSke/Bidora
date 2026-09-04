"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const registerSchema = z
    .object({

        username: z
            .string()
            .min(2, "Username must be at least 2 characters"),
        email: z
            .string()
            .email("Please enter a valid email"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters"),

        confirmPassword: z
            .string()
            .min(1, "Please confirm your password"),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        }
    );

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });
    const router = useRouter();

    async function onSubmit(data: RegisterFormData) {
        try {
            const response = await fetch(
                "http://localhost:4000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                       
                        username: data.username,
                        email: data.email,
                        password: data.password,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                console.error(result.message);
                return;
            }

            router.push("/login");
        } catch (error) {
            console.error("Registration request failed:", error);
        }
    }

    const [showPassword, setShowPassword] = useState(false);
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
        "
        >
            {/* NAME */}
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
                    placeholder="Your username"
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
            <div className="mt-5">
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
                    placeholder="you@example.com"
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

            {/* PASSWORD */}
            <div className="mt-5">
                <label
                    htmlFor="password"
                    className="text-sm font-semibold text-[var(--bidora-text)]"
                >
                    Password
                </label>
                <div className="relative mt-2">


                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        placeholder="Minimum 8 characters"
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
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="
                            absolute
                            right-4
                            top-1/2
                            -translate-y-1/2
                            text-[var(--bidora-text-secondary)]
                            transition
                            hover:text-[var(--bidora-primary)]
                            "
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="mt-2 text-sm text-red-500">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mt-5">
                <label
                    htmlFor="confirmPassword"
                    className="text-sm font-semibold text-[var(--bidora-text)]"
                >
                    Confirm password
                </label>
                <div className="relative mt-2">


                    <input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        {...register("confirmPassword")}
                        placeholder="Repeat your password"
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

                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="
                            absolute
                            right-4
                            top-1/2
                            -translate-y-1/2
                            text-[var(--bidora-text-secondary)]
                            transition
                            hover:text-[var(--bidora-primary)]
                            "
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-500">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                className="
          mt-7
          w-full
          rounded-xl
          bg-[var(--bidora-accent)]
          py-3.5
          font-semibold
          text-white
          transition
          hover:opacity-90
        "
            >
                Create account
            </button>

            <p className="mt-5 text-center text-sm text-[var(--bidora-text-secondary)]">
                Already have an account?{" "}
                <a
                    href="/login"
                    className="font-semibold text-[var(--bidora-primary)] hover:underline"
                >
                    Log in
                </a>
            </p>
        </form>
    );
}