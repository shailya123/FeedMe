"use client"
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User'
import { acceptMessagesSchema } from '@/schemas/acceptMessageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Separator } from '@radix-ui/react-separator';
import { Loader } from 'lucide-react';
import { Switch } from '@radix-ui/react-switch';

const page = () => {
  const [message, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();
  const handleDeleteMessage = (messageId: string) => {
    setMessages(message.filter((message) => message._id !== messageId))
  }
  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema)
  })
  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/accept-messages');
      const data = await res.json();
      setValue('acceptMessages', data.data.isAcceptingMessage)
    }
    catch (err) {
      console.error("error fetching", err);
      toast({
        title: 'Signup failed',
        description: 'error',
        variant: 'destructive'
      })
    }
    finally {
      setIsLoading(false);
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(true);
    try {
      const res = await fetch('/api/get-messages');
      const data = await res.json();
      setMessages(data.result.messages || []);
      if (refresh) {
        toast({
          title: 'Refreshed Messages',
          description: 'Showing latest messages',
          duration: 3000,
          style: {
            background: 'black',
            color: 'white',
            font: 'semi-bold'
          },
        })
      }
      setValue('acceptMessages', data.data.isAcceptingMessage)
    }
    catch (err) {
      console.error("error fetching", err);
      toast({
        title: 'Signup failed',
        description: 'error',
        variant: 'destructive'
      })
    }
    finally {
      setIsSwitchLoading(false);
      setIsLoading(false);
    }
  }, [setIsLoading, setMessages])

  const handleSwitchChange=async ()=>{
    try{
      const res = await fetch(`/api/accept-messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({acceptMessages:!acceptMessages}),
    })
    const val = await res.json();
    setValue('acceptMessages', !acceptMessages)
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
    }
    catch(err){
      toast({
        title: 'Signup failed',
        description: 'error',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    if (!session || !session?.user) return
    fetchAcceptMessage()
    fetchMessages()
  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  if(!session||!session.user){
    return <div>Please login</div>
  }
  return (
    <div>
      <p>shailya</p>
    </div>
  )
}

export default page
