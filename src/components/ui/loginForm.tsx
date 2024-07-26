"use client"

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { auth, db } from '@/app/data/firebase';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Link } from "lucide-react";

// Import Firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  useEffect(() => {
    if (!auth) {
      console.error("Auth is not initialized");
    }
    if (!db) {
      console.error("Firestore is not initialized");
    }
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      if (isLogin) {
        // Login
        await signInWithEmailAndPassword(auth, values.email, values.password);
        console.log("User logged in successfully");
      } else {
        // Register
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;
        
        // Save user data including selected platforms
        await setDoc(doc(db, "users", user.uid), {
          email: values.email,
          selectedPlatforms: selectedPlatforms,
        });
        
        console.log("User registered successfully");
      }
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isLogin && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormDescription>
          Password must contain at least 8 characters
        </FormDescription>
        <Button type="submit">{isLogin ? "Login" : "Register"}</Button>
        <Button type="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need to create an account?" : "Already have an account?"}
        </Button>
      </form>
    </Form>
  )
}