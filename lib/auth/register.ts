"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { isAuthJsEnabled } from "@/auth";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import { signIn } from "@/auth";

export async function registerUser(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/signup?error=missing-fields");
  }

  if (password.length < 8) {
    redirect("/signup?error=password-short");
  }

  if (!isAuthJsEnabled || !isDatabaseConfigured()) {
    redirect("/signup?error=auth-not-configured");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect("/signup?error=email-exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    await prisma.user.create({
      data: {
        email,
        name: name || email.split("@")[0],
        passwordHash,
        subscription: {
          create: { status: "NONE" },
        },
      },
    });
  } catch (err) {
    console.error("[register] user create failed", {
      emailPrefix: email.slice(0, 3),
      code: (err as { code?: string }).code,
    });
    redirect("/signup?error=server-error");
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/app",
    });
  } catch (err) {
    console.error("[register] sign-in after create failed", err);
    redirect("/login?error=account-created-sign-in");
  }
}
