"use client"
import { useToast } from '@/components/ui/use-toast';
import { useForm } from "react-hook-form"
import React, { useState, useEffect } from 'react'
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const VeriyAccount = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const [remainingTime, setRemainingTime] = useState(3600); 

    useEffect(() => {
        const timer = setTimeout(() => {
            if (remainingTime > 0) {
                setRemainingTime((prevTime) => prevTime - 1);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [remainingTime]);

    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;
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
        <div className='min-h-screen bg-gray-100  flex flex-col gap-12 relative '>
            <header className="bg-gray-800 text-white py-4 px-8 flex gap-4 items-center">
                <img src={'/logo.png'} height={80} width={80} />
                <h1 className="text-3xl font-bold font-serif">Feed ME</h1>
            </header>
            <div className="flex justify-center top-[35%] absolute left-[40%] w-[25%]">
                <div className=' p-8 space-y-8 shadow-md items-center  '>
                    <h1 className="font-bold text-xl mb-1 capitalize ">Please verify code sent to the registered email</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification Code :{'  '} {'  '}{'  '}{' '}{hours}
                                            :{minutes}:{seconds} </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter the code" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-center ">
                                <Button type="submit" className="shadow-md" disabled={isSubmitting} >{isSubmitting ? (<div className="flex flex-row gap-2"><h1>Please Wait</h1><Loader2 className="mr-2 h-4 w-4 animate-spin" /></div>) : ('Verify')}</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default VeriyAccount;
