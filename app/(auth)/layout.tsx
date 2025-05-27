import { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
  title: "Filmguide - Auth",
  description: "Sign in or sign up to access your filmguide account",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
