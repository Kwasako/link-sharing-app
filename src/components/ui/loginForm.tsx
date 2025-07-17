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
import { useToast } from './toast';

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
  const { showToast } = useToast();
  const [isLogin, setIsLogin] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    try {
      if (isLogin) {
        // Login
        await signInWithEmailAndPassword(auth, values.email, values.password);
        showToast("Welcome back! You've been logged in successfully.", "success");
      } else {
        // Register
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;
        
        // Save user data including selected platforms
        await setDoc(doc(db, "users", user.uid), {
          email: values.email,
          selectedPlatforms: selectedPlatforms,
          createdAt: new Date().toISOString()
        });
        
        showToast("Account created successfully! Welcome to DevLinks!", "success");
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      let userFriendlyMessage = "An error occurred. Please try again.";
      
      // Provide user-friendly error messages
      if (errorMessage.includes("user-not-found")) {
        userFriendlyMessage = "No account found with this email address.";
      } else if (errorMessage.includes("wrong-password")) {
        userFriendlyMessage = "Incorrect password. Please try again.";
      } else if (errorMessage.includes("email-already-in-use")) {
        userFriendlyMessage = "An account with this email already exists.";
      } else if (errorMessage.includes("weak-password")) {
        userFriendlyMessage = "Password is too weak. Please choose a stronger password.";
      } else if (errorMessage.includes("invalid-email")) {
        userFriendlyMessage = "Please enter a valid email address.";
      }
      
      showToast(userFriendlyMessage, "error");
      console.error("Auth Error:", errorMessage);
    } finally {
      setIsSubmitting(false);
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
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-dark-purple hover:bg-dark-purple text-white"
        >
          {isSubmitting ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? "Login" : "Create account")}
        </Button>
        <div className="text-center">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => setIsLogin(!isLogin)}
            disabled={isSubmitting}
            className="text-dark-purple hover:text-dark-purple"
          >
            {isLogin ? "Don't have an account? Create one" : "Already have an account? Login"}
          </Button>
        </div>
      </form>
    </Form>
  )
}