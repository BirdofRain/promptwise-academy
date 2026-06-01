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

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/app",
  });
}
