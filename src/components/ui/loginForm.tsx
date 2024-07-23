"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image";
// import Link from "next/link";

import { Button } from "@/components/ui/button"
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

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel><p className="font-instrument text-xs font-normal leading-18 text-left text-dark-gray-400">Email address</p></FormLabel>
              <FormControl>
                <div className="w-full h-8 px-4 py-3 flex items-center gap-3 rounded-lg border bg-white border-[rgba(217,217,217,1)]">
                  <Image src="/ph_envelope-simple-fill.svg" alt="envelop icon" width={16} height={16}/>
                  <input placeholder="ben@example.com |" {...field} className="leading-16 text-dark-gray-400 w-full"/>
                </div>
              </FormControl>
              <FormLabel><p className="font-instrument text-xs font-normal leading-18 text-left text-dark-gray-400">Create password</p></FormLabel>
              <FormControl>
                <div className="w-full h-8 px-4 py-3 flex items-center gap-3 rounded-lg border bg-white border-[rgba(217,217,217,1)]">
                  <Image src="/ph_envelope-simple-fill.svg" alt="envelop icon" width={16} height={16}/>
                  <input placeholder="At least .8 characters" {...field} className="leading-16 text-dark-gray-400 w-full"/>
                </div>
              </FormControl>
              <FormLabel><p className="font-instrument text-xs font-normal leading-18 text-left text-dark-gray-400">Confirm password</p></FormLabel>
              <FormControl>
                <div className="w-full h-8 px-4 py-3 flex items-center gap-3 rounded-lg border bg-white border-[rgba(217,217,217,1)]">
                  <Image src="/ph_envelope-simple-fill.svg" alt="envelop icon" width={16} height={16}/>
                  <input placeholder="At least 8 characters" {...field} className="leading-16 text-custom-gray-400 w-full"/>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="font-instrument text-xs font-normal leading-12 text-left text-custom-gray">Password must contain at least 8 characters</p>
        <Button type="submit" className="w-full bg-[rgba(99,60,255,1)]">Submit</Button>
        <p className="font-instrument text-base font-normal leading-6 text-left text-custom-gray">Already have an account? <a>login</a></p>
      </form>
    </Form>
  )
}