"use client"
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import * as z from 'zod';
import React from 'react'
import { resetPassowrdSchema } from "@/schemas/resetPasswordSchema";
import Link from "next/link";

const ForgotPassword = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isresendOtpSubmitting, setIsresendOtpSubmitting] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof resetPassowrdSchema>>({
        resolver: zodResolver(resetPassowrdSchema),
    })
    const onSubmit = async (data: z.infer<typeof resetPassowrdSchema>) => {
        try {
            setIsSubmitting(true);
            const res = await fetch(`/api/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: params.username, email: data.email }),
            })
            const val = await res.json();
            if (val.success) {
                setIsSubmitting(false);
                toast({
                    title: 'Success',
                    description: val.result.message,
                    duration: 3000,
                    style: {
                        background: 'black',
                        color: 'white',
                        font: 'semi-bold'
                    },
                })
                form.reset();
                router.push(`/sign-in`);
            }
            else {
                setIsSubmitting(false);
                toast({
                    title: 'Failure',
                    description: val.result.message,
                    duration: 3000,
                    style: {
                        background: 'red',
                        color: 'white',
                        font: 'semi-bold'
                    },
                })
            }
        }
        catch (err) {
            setIsSubmitting(false);
            console.error("error while submitting username", err);
            toast({
                title: 'Signup failed',
                description: 'error',
                variant: 'destructive'
            })

        }
    }


    return (
        <div className=' bg-background flex flex-col gap-12'>
            <div className="flex justify-center top-[35%] absolute left-[40%] w-[25%]">
                <div className=' p-8 space-y-4 shadow-md items-center border rounded-xl  '>
                    <h1 className="font-bold text-xl mb-1  ">Please enter your registered email to get the forgot password link</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Email</FormLabel>
                                        <FormControl className="shadow-md">
                                            <Input placeholder="Enter Email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-center ">
                                <Button type="submit" className="shadow-md" disabled={isSubmitting} >{isSubmitting ? (<div className="flex flex-row gap-2"><h1>Please Wait</h1><Loader2 className="mr-2 h-4 w-4 animate-spin" /></div>) : ('Reset Password')}</Button>
                            </div>
                        </form>
                    </Form>
                    <div className="flex justify-center">
                        <p>
                            <Link href="/sign-in" className='text-blue-500 hover:text-blue-700'>Remember Password?</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ForgotPassword;
