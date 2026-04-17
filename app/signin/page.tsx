"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: "/dashboard",
      prompt: "select_account",
    });
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
      <Card className="w-full max-w-sm border-green-200">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-green-700 sm:text-3xl">
            laboratory of plant systematic
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Laboratory access portal
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-center text-xs text-gray-600 sm:text-sm">
            Sign in with your Google account to access the laboratory management
            system.
          </p>

          <Button
            onClick={handleGoogleSignIn}
            className="w-full bg-green-600 text-white hover:bg-green-700"
            size="lg"
          >
            Sign In with Google
          </Button>

          <Link href="/">
            <Button
              variant="outline"
              className="w-full border-green-300 text-green-700 hover:bg-green-50"
              size="lg"
            >
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
