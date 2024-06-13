"use client"
import MessageCard from '@/components/cards/MessageCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { acceptMessagesSchema } from '@/schemas/acceptMessageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@radix-ui/react-separator';
import { Loader, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

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
      setValue('acceptMessages', data.isAcceptingMessages)
    }
    catch (err) {
      console.error("error fetching", err);
      toast({
        title: 'Error occured',
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
      console.log(data);
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
      // setValue('acceptMessages', data.isAcceptingMessages)
    }
    catch (err) {
      console.error("error fetching", err);
      toast({
        title: 'Error',
        description: 'While fetching the messages',
        variant: 'destructive'
      })
    }
    finally {
      setIsSwitchLoading(false);
      setIsLoading(false);
    }
  }, [setIsLoading, setMessages])

  const handleSwitchChange = async () => {
    try {
      const res = await fetch(`/api/accept-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ acceptMessages: !acceptMessages }),
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
    catch (err) {
      toast({
        title: 'Failure',
        description: 'Error while switching the message status',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    if (!session || !session?.user) return;
    fetchAcceptMessage();
  }, []);

  useEffect(() => {
    if (!session || !session?.user) return;
    fetchMessages();
  }, [session]);

  if (!session || !session.user) {
    return <div className="flex w-full min-h-[80vh] justify-center items-center"><Loader className="animate-spin w-6 h-6 " /></div>;
  }

  const { username } = session.user as User;
  const { name } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username === '' ? name : username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
      duration: 3000,
      style: {
        background: 'black',
        color: 'white',
        font: 'semi-bold'
      },
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-background rounded w-full max-w-7xl flex-grow flex-1">
      <h1 className="text-4xl font-bold mb-4 capitalize">{username === '' ? name : username} Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>
      {session && session.user && (
        <div className="mb-4">
          <Switch
            {...register('acceptMessages')}

            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessages ? 'On' : 'Off'}
          </span>
        </div>
      )}
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {message.length > 0 ? (
          message.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default page
