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
import { signInSchema } from "@/schemas/signInSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { signIn } from "next-auth/react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from "react-hook-form"
import * as z from "zod"
const page = () => {
    
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const router = useRouter();


    //zod imple.
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        const result = await signIn('credentials', {
            identifier: data.identifier,
            password: data.password
        })
        console.log(result);
        if (result?.error) {
            setIsSubmitting(false);
            toast({
                title: 'Login Failed',
                description: 'Incorrect username or password',
                duration: 3000,
                style: {
                    background: 'red',
                    color: 'white',
                    font: 'semi-bold'
                },
            })
        }
        if (result?.url) {
            setIsSubmitting(false);
            toast({
                title: 'Success',
                description: 'Logged In successfully',
                duration: 3000,
                style: {
                    background: 'black',
                    color: 'white',
                    font: 'semi-bold'
                },
            })
            // router.push('/dashboard');
        }
    }
    return (
        <div className=' min-h-screen bg-gray-100 relative flex flex-col gap-12'>
            <header className="bg-gray-800 text-white py-4 px-8 flex gap-4 items-center">
                <img src={'/logo.png'} height={80} width={80} />
                <h1 className="text-3xl font-bold font-serif">Feed ME</h1>
            </header>
            <div className="flex justify-center items-center">
                <div className='w-full max-w-md p-8 space-y-12 shadow-md '>
                    <div className='text-left'>
                        <h1 className="font-bold text-2xl mb-3">Sign-In</h1>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                                <FormField
                                    control={form.control}
                                    name="identifier"
                                    render={({ field }) => (
                                        <FormItem >
                                            <FormLabel>Email/Username</FormLabel>
                                            <FormControl className="shadow-md">
                                                <Input placeholder="Enter Email/Username" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                                <div className="flex items-center justify-center ">
                                    <Button type="submit" className="shadow-md" disabled={isSubmitting} >{isSubmitting ? (<div className="flex flex-row gap-2"><h1>Please Wait</h1><Loader2 className="mr-2 h-4 w-4 animate-spin" /></div>) : ('Sign In')}</Button>
                                </div>
                            </form>
                        </Form>
                        <div className='text-center mt-4'>
                            <p>
                                New member?{' '}
                                <Link href="/sign-up" className='text-blue-500 hover:text-blue-700'>Sign up</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default page;
