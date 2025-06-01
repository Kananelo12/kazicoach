"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import RippleWaveLoader from "./mvpblocks/ripple-loader";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseAuth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";

/**
 * Returns a Zod schema for authentication forms based on the form type.
 *
 * @param type - The type of the authentication form, either 'sign-in' or 'sign-up'.
 *   - If 'sign-up', the schema requires a `name` field with at least 3 characters.
 *   - If 'sign-in', the `name` field is optional.
 *   - Both types require a valid `email` and a `password` with at least 6 characters.
 * @returns A Zod object schema for validating authentication form inputs.
 */

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long",
    }),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 1. Define your form.
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      if (type === "sign-up") {
        const { name, email, password } = values;

        const userCredential = await createUserWithEmailAndPassword(
          firebaseAuth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email: email,
          password: password,
        });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("Account Created Successfully. Please Sign In.");
        router.push("/sign-in");
      } else {
        const { email, password } = values;

        const userCredential = await signInWithEmailAndPassword(
          firebaseAuth,
          email,
          password
        );
        const idToken = await userCredential.user.getIdToken();

        if (!idToken) {
          toast.error("Failed to retrieve user session. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Signed In Successfully.");
        router.push("/");
        console.log("Sign In Values:", values);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Sign in failed: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  const isSignIn = type === "sign-in";

  return loading ? (
    <RippleWaveLoader />
  ) : (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">KaziCoach</h2>
        </div>

        <h3>Find your career path with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                name="name"
                control={form.control}
                label="Name"
                placeholder="Your name.."
              />
            )}

            <FormField
              name="email"
              control={form.control}
              label="Email"
              placeholder="Your email address.."
              type="email"
            />

            <FormField
              name="password"
              control={form.control}
              label="Password"
              placeholder="Enter your password.."
              type="password"
            />

            <Button type="submit" className="btn">
              {isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}{" "}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
