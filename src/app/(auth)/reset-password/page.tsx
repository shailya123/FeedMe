'use client'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { passwordResetingSchema } from "@/schemas/passwordResetingSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from "react-hook-form"
import * as z from "zod"
import '../../../app/globals.css'
import { useRouter,useSearchParams  } from "next/navigation"

const page = () => {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(false)
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    //zod imple.
    const form = useForm<z.infer<typeof passwordResetingSchema>>({
        resolver: zodResolver(passwordResetingSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof passwordResetingSchema>) => {
        setIsSubmitting(true);
        const res = await fetch('/api/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, email, password: data.password }),
        });

        const result = await res.json();
        if (!result?.success) {
            setIsSubmitting(false);
            toast({
                title: 'Reset Failed',
                description: result.result.message,
                duration: 3000,
                style: {
                    background: 'red',
                    color: 'white',
                    font: 'semi-bold'
                },
            })
        }
        if (result?.success) {
            setIsSubmitting(false);
            toast({
                title: 'Success',
                description: result.result.message,
                duration: 3000,
                style: {
                    background: 'black',
                    color: 'white',
                    font: 'semi-bold'
                },
            })
            router.push('/sign-in');
        }
    }
    return (
        <div className=' bg-background  flex flex-col gap-12'>
            <div className="flex justify-center items-center">
                <div className='w-full max-w-md p-8 space-y-4 shadow-md border rounded-xl'>
                    <div className='text-left'>
                        <h1 className="font-bold text-2xl mb-3">Reset Password</h1>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="relative " >
                                            <FormLabel>Password</FormLabel>
                                            <FormControl className="shadow-md">
                                                <Input placeholder="Enter password" {...field} type={passwordVisibility ? 'text' : 'password'} />
                                            </FormControl>
                                            {passwordVisibility ? (
                                                <Eye
                                                    className="absolute right-2 top-1/2   h-4 w-4" onClick={() => setPasswordVisibility(!passwordVisibility)}
                                                />
                                            ) : <EyeOff
                                                className="absolute right-2 top-1/2   h-4 w-4" onClick={() => setPasswordVisibility(!passwordVisibility)}
                                            />}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem className="relative " >
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl className="shadow-md">
                                                <Input placeholder="Enter password again" {...field} type={confirmPasswordVisibility ? 'text' : 'password'} />
                                            </FormControl>
                                            {confirmPasswordVisibility ? (
                                                <Eye
                                                    className="absolute right-2 top-1/2   h-4 w-4" onClick={() => setConfirmPasswordVisibility(!confirmPasswordVisibility)}
                                                />
                                            ) : <EyeOff
                                                className="absolute right-2 top-1/2   h-4 w-4" onClick={() => setConfirmPasswordVisibility(!confirmPasswordVisibility)}
                                            />}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-center justify-center ">
                                    <Button type="submit" className="shadow-md" disabled={isSubmitting} >{isSubmitting ? (<div className="flex flex-row gap-2"><h1>Please Wait</h1><Loader2 className="mr-2 h-4 w-4 animate-spin" /></div>) : ('Save')}</Button>
                                </div>
                            </form>
                        </Form>
                    </div>

                </div>
            </div>
        </div >
    )
}

export default page;
