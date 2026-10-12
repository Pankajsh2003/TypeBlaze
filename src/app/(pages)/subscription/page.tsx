"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "@/store/useStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

export default function SubscriptionPage() {
  // These values are sent to the existing backend API; keep the property
  // name `varient` as-is because the current API expects it.
  const productId = "subscription";
  const varient = "lifetime";

  const { isAuthenticated, isPremium, upgradeToPremium } = useAuthStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Redirect users who already have premium access.
  useEffect(() => {
    if (isAuthenticated && isPremium) {
      router.push("/premium/themes");
    }
  }, [isAuthenticated, isPremium, router]);

  // Reuse the Razorpay script loaded by the root layout when possible.
  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null;
    let didCreateScript = false;

    const handleScriptLoad = () => setRazorpayLoaded(true);
    const handleScriptError = () => {
      setRazorpayLoaded(false);
      setErrorMessage(
        "Payment gateway failed to load. Please refresh the page and try again."
      );
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`
    );

    if ((window as any).Razorpay) {
      setRazorpayLoaded(true);
    } else if (existingScript) {
      scriptElement = existingScript;
      scriptElement.addEventListener("load", handleScriptLoad);
      scriptElement.addEventListener("error", handleScriptError);
    } else {
      scriptElement = document.createElement("script");
      scriptElement.src = RAZORPAY_SCRIPT_URL;
      scriptElement.async = true;
      scriptElement.addEventListener("load", handleScriptLoad);
      scriptElement.addEventListener("error", handleScriptError);
      document.body.appendChild(scriptElement);
      didCreateScript = true;
    }

    const userAgent = navigator.userAgent.toLowerCase();
    setIsMobile(
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      )
    );

    return () => {
      scriptElement?.removeEventListener("load", handleScriptLoad);
      scriptElement?.removeEventListener("error", handleScriptError);

      // Do not remove a script that may be shared with the root layout.
      // A script created here is intentionally left in place once appended.
      if (didCreateScript) {
        scriptElement = null;
      }
    };
  }, []);

  const handleCheckOut = async () => {
    setErrorMessage(null);

    if (!isAuthenticated) {
      setErrorMessage("Please log in before purchasing premium access.");
      return;
    }

    if (!razorpayLoaded || !(window as any).Razorpay) {
      setErrorMessage(
        "Payment gateway is still loading. Please wait a moment and try again."
      );
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Ask the backend to create a payment order.
      const res = await axios.post<{
        razorpayOrder: {
          id: string;
          amount: number;
          currency: string;
        };
        order: {
          id: string;
        };
      }>("/api/orders", { productId, varient });

      const { razorpayOrder, order } = res.data;

      if (!razorpayOrder?.id || !order?.id) {
        throw new Error("Failed to create a payment order. Please try again.");
      }

      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Typelivo",
        description: "Typelivo Lifetime Premium Access",
        order_id: razorpayOrder.id,
        // Do not hard-code a developer's personal name or phone number here.
        // Razorpay can collect customer details during checkout.
        theme: {
          color: "#6D45F5",
          backdrop_color: "#090914",
        },
        modal: {
          ondismiss: () => setIsLoading(false),
          escape: true,
        },
        handler: async (response: any) => {
          try {
            const verificationRes = await axios.post<{ success: boolean }>(
              "/api/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (!verificationRes.data.success) {
              setErrorMessage(
                "Payment verification failed. Please contact support before trying again."
              );
              setIsLoading(false);
              return;
            }

            // Keep the existing premium activation flow.
            upgradeToPremium();

            try {
              await axios.post("/api/user/upgrade-premium", {
                orderId: order.id,
                paymentId: response.razorpay_payment_id,
              });
            } catch (updateError) {
              console.error("Error updating premium status on the server:", updateError);
              setErrorMessage(
                "Payment was verified, but premium status could not be synced. Please contact support."
              );
              setIsLoading(false);
              return;
            }

            alert("Payment successful! Typelivo Premium is activated.");
            router.push("/premium/themes");
          } catch (error) {
            console.error("Payment verification error:", error);
            setErrorMessage(
              "Payment verification failed. Please try again or contact support."
            );
          } finally {
            setIsLoading(false);
          }
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", () => {
        setErrorMessage("Payment failed. Please try again.");
        setIsLoading(false);
      });
      razorpay.open();
    } catch (error: unknown) {
      console.error("Order creation error:", error);
      // Avoid relying on axios.isAxiosError typing; extract a server message safely.
      const responseMessage =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: unknown } } }).response?.data?.message
          : undefined;
      const message =
        typeof responseMessage === "string" && responseMessage.trim()
          ? responseMessage
          : error instanceof Error && error.message
            ? error.message
            : undefined;
      setErrorMessage(message || "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  if (isAuthenticated && isPremium) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 dark:bg-[#080914] dark:text-white">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        <p className="ml-3">Redirecting to your premium features...</p>
      </div>
    );
  }

  const features = [
    "Custom typing themes",
    "Advanced statistics dashboard",
    "Custom text creation",
    "Daily challenges and rewards",
    "Ad-free experience",
    "Priority support",
  ];

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-16 text-slate-900 dark:bg-[#080914] dark:text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-violet-400/15 blur-[120px] dark:bg-violet-600/15" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-400/10 blur-[100px] dark:bg-indigo-600/10" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300">
            Level up your practice
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Join Typelivo Premium
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Unlock more ways to practise, improve, and track your progress.
          </p>
        </div>

        <Card className="w-full rounded-3xl border-slate-200/80 bg-white/90 shadow-2xl shadow-violet-950/[0.07] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/20">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-2xl font-bold text-violet-600 dark:text-violet-300">
              Lifetime Premium Access
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Unlock all premium features with a one-time purchase
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="text-center">
              <span className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                INR 49
              </span>
              <span className="ml-2 text-slate-500 dark:text-slate-400">
                / one-time
              </span>
            </div>

            <ul className="mt-8 space-y-3">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 sm:text-base"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-violet-600 dark:text-violet-300" />
                  {feature}
                </li>
              ))}
            </ul>

            {errorMessage && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </CardContent>

          <CardFooter className="pb-6">
            {isAuthenticated ? (
              <Button
                onClick={handleCheckOut}
                variant="premium"
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-6 font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/25"
                disabled={isLoading || !razorpayLoaded}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Preparing secure checkout...
                  </>
                ) : !razorpayLoaded ? (
                  "Loading payment gateway..."
                ) : (
                  "Get Premium Access"
                )}
              </Button>
            ) : (
              <TooltipProvider>
                <Tooltip open={isHovered} onOpenChange={setIsHovered}>
                  <TooltipTrigger asChild>
                    <div
                      className="w-full"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <Button
                        disabled
                        variant="premium"
                        className="w-full cursor-not-allowed rounded-xl py-6 font-bold"
                      >
                        Log in to get Premium
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <div className="flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4 text-violet-500" />
                      <span>Please log in first to proceed.</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </CardFooter>
        </Card>

        <p className="mt-5 text-center text-xs leading-5 text-slate-500 dark:text-slate-500">
          Payments are processed securely through Razorpay. Premium activation
          depends on successful server-side payment verification.
        </p>
      </div>
    </main>
  );
}
