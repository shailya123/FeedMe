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
import '../../../../app/globals.css';

const VeriyAccount = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isresendOtpSubmitting, setIsresendOtpSubmitting] = useState(false);
    const [isCodeExpired, setIsCodeExpired] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })
    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            setIsSubmitting(true);
            const res = await fetch(`/api/verify-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: params.username, code: data.code }),
            })
            const val = await res.json();
            if (val.success) {
                setIsSubmitting(false);
                setIsCodeExpired(false);
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
                setIsCodeExpired(true);
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
            setIsCodeExpired(true);
            console.error("error while submitting username", err);
            toast({
                title: 'Signup failed',
                description: 'error',
                variant: 'destructive'
            })

        }
    }

    const resendOtp = async () => {
        try {
            setIsresendOtpSubmitting(true);
            const res = await fetch(`/api/resend-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: params.username }),
            })
            const val = await res.json();
            if (val.success) {
                setIsresendOtpSubmitting(false);
                setIsCodeExpired(false);
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
            }
            else {
                setIsresendOtpSubmitting(false);
                setIsCodeExpired(true);
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
            setIsresendOtpSubmitting(false);
            setIsCodeExpired(true);
            console.error("error while submitting username", err);
            toast({
                title: 'Signup failed',
                description: 'error',
                variant: 'destructive'
            })

        }
    }

    return (
        <div className=' bg-background flex flex-col gap-12 '>
            <div className="flex justify-center top-[35%] absolute left-[40%] w-[25%]">
                <div className=' p-8 space-y-4 shadow-md items-center border rounded-xl  '>
                    <h1 className="font-bold text-xl mb-1 capitalize ">Please verify code sent to the registered email</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification Code </FormLabel>
                                        <FormControl className="shadow-md">
                                            <Input placeholder="Enter the code" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-center ">
                                <Button type="submit" className="shadow-md" disabled={isSubmitting || isresendOtpSubmitting} >{isSubmitting ? (<div className="flex flex-row gap-2"><h1>Please Wait</h1><Loader2 className="mr-2 h-4 w-4 animate-spin" /></div>) : ('Verify')}</Button>
                            </div>
                        </form>
                    </Form>
                    <div className="flex items-center justify-center ">
                        <Button variant={"link"} className="shadow-md " disabled={isresendOtpSubmitting}  onClick={()=>resendOtp()}  >{isresendOtpSubmitting ? (<div className="flex flex-row gap-2"><h1>Please Wait</h1><Loader2 className="mr-2 h-4 w-4 animate-spin" /></div>) : ('Resend OTP')}</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VeriyAccount;
