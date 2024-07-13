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
import { signupSchema } from '@/schemas/signUpSchema'
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2, User, User2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { useDebounceCallback } from "usehooks-ts"
import * as z from "zod"
import '../../../app/globals.css'
const page = () => {
    const { toast } = useToast()
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const debounced = useDebounceCallback(setUsername, 300);
    const router = useRouter();
    const uniqueUsernameMessage = 'Username is unique'

    //zod imple.
    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsLoading(true);
                setUsernameMessage('')
                try {
                    const res = await fetch(`/api/check-username-unique?username=${username}`)
                    const data = await res.json();
                    setUsernameMessage(data.result.message)
                    setIsLoading(false);
                } catch (err) {
                    console.log("error while fetching unique username", err);
                    setUsernameMessage("error while fetching unique username");
                    setIsLoading(false);
                }

            }
        }
        checkUsernameUnique()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/sign-up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            const val = await res.json();

            if (val.success) {
                setUsernameMessage('')
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

                setIsSubmitting(false)
                form.reset();
                router.push(`/verify/${username}`);
            }
            else {
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
                form.reset();
                setIsSubmitting(false)
                setUsernameMessage('');
            }
        }
        catch (err) {
            console.error("error while submitting username", err);
            setUsernameMessage("error while submitting username");
            toast({
                title: 'Signup failed',
                description: 'error',
                variant: 'destructive'
            })
            setIsSubmitting(false);
        }
    }
    return (
        <div className=' bg-background flex flex-col gap-12 '>
            <div className="flex justify-center items-center ">
                <div className='w-full max-w-md p-8 space-y-4 shadow-md border rounded-xl '>
                    <div className='text-left'>
                        <h1 className="font-bold text-2xl mb-3">Sign-Up</h1>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel>Username</FormLabel>
                                            <FormControl className="shadow-md flex items-center">
                                                <Input
                                                    placeholder="Enter username"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        debounced(e.target.value);
                                                    }}
                                                />
                                            </FormControl>
                                            <h1 className={`${username ? usernameMessage === uniqueUsernameMessage ? 'text-green-500' : 'text-red-500' : ''} capitalize text-xs`}>{username ? usernameMessage : ''}</h1>
                                            {isLoading && (
                                                <Loader2
                                                    className="absolute right-2 top-1/2  animate-spin h-4 w-4"
                                                />
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem >
                                            <FormLabel>Email</FormLabel>
                                            <FormControl className="shadow-md">
                                                <Input placeholder="example@domain.com" {...field} />
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
                                    <Button type="submit" className="shadow-md w-full" disabled={isSubmitting} >{isSubmitting ? (<div className="flex flex-row gap-2"><h1>Please Wait</h1><Loader2 className="mr-2 h-4 w-4 animate-spin" /></div>) : ('Sign up')}</Button>
                                </div>
                            </form>
                        </Form>
                        <div className='text-right text-sm mt-4'>
                            <p>
                                Already a member?{' '}
                                <Link href="/sign-in" className='text-blue-500 hover:text-blue-700'>Sign in</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default page
