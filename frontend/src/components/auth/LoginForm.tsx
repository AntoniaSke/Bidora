"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
    email: z
        .string()
        .email("Please enter a valid email"),

    password: z
        .string()
        .min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });
    const router = useRouter();
    const [loginError, setLoginError] = useState("");

    async function onSubmit(data: LoginFormData) {
        setLoginError("");

        try {
            const response = await fetch(
                "http://localhost:4000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                setLoginError(
                    result.message || "Invalid email or password"
                );

                return;
            }

            router.push("/profile");
        } catch (error) {
            console.error("Login request failed:", error);

            setLoginError(
                "Could not connect to the server. Please try again."
            );
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

            <div className="mt-5">
                <div className="flex items-center justify-between">
                    <label
                        htmlFor="password"
                        className="text-sm font-semibold text-[var(--bidora-text)]"
                    >
                        Password
                    </label>

                    <a
                        href="#"
                        className="text-sm font-medium text-[var(--bidora-primary)] hover:underline"
                    >
                        Forgot password?
                    </a>
                </div>

                <div className="relative mt-2">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        placeholder="Your password"
                        className="
                            w-full
                            rounded-xl
                            border
                            border-[var(--bidora-border)]
                            px-4
                            py-3.5
                            pr-12
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
                {loginError && (
            <div
                className="
                mt-5
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-600
                "
            >
                {loginError}
            </div>
            )}

            <button
                type="submit"
                className="
                    mt-7
                    w-full
                    rounded-xl
                    bg-[var(--bidora-primary)]
                    py-3.5
                    font-semibold
                    text-white
                    transition
                    hover:bg-[var(--bidora-primary-hover)]
                    "
            >
                Log in
            </button>

            <p className="mt-5 text-center text-sm text-[var(--bidora-text-secondary)]">
                New to Bidora?{" "}
                <a
                    href="/register"
                    className="font-semibold text-[var(--bidora-accent)] hover:underline"
                >
                    Create an account
                </a>
            </p>
        </form>
    );
}