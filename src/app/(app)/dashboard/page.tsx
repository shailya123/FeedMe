"use client"
import MessageCard from '@/components/cards/MessageCard';
import useWebSocket from '@/components/hooks/useWebHook';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/UserContext';
import { Message } from '@/model/User';
import { acceptMessagesSchema } from '@/schemas/acceptMessageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@radix-ui/react-separator';
import { Download, Loader, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import qrcode from 'qrcode';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import '../../globals.css';
import RatingComponent from '@/components/self-ui/Rating';

const Page = () => {
  const { toast } = useToast();
  const { data: session } = useSession();
  const { user } = useAuth();
  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema),
  });
  const { register, watch, setValue } = form;
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [qrUrl, setQrUrl] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [acceptMessages, setAcceptMessages] = useState(false); // Example initial state, adjust as needed
  const [averageUserRating, setAverageUserRating] = useState(0);
  const [ratingsDistribution, setRatingsDistribution] = useState({});

  const calculateAverageRating = useCallback((messageArray: Message[]) => {
    if (!messageArray || messageArray?.length === 0) return [];
    const totalRating = messageArray?.reduce((acc, curr) => acc + curr.rating, 0);
    return (totalRating / messageArray?.length);
  }, [setMessages])

  const calculateRatingsDistribution = useCallback((messages: Message[]) => {
    return messages?.reduce((acc: any, message: Message) => {
      console.log(Math.floor(message.rating))
      acc[Math.floor(message?.rating)] = (acc[Math.floor(message?.rating)] || 0) + 1;
      return acc;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  }, [setMessages]);

  const fetchAcceptMessage = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/accept-messages');
      const data = await res.json();
      setValue('acceptMessages', data.isAcceptingMessages);
    } catch (err) {
      console.error('Error fetching accept messages:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch accept messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(true);
    try {
      const res = await fetch('/api/get-messages');
      const data = await res.json();
      setMessages(data.result.messages || []);
      console.log(data.result.messages)
      if (data) {
        setAverageUserRating(calculateAverageRating(data?.result?.messages).toFixed(2));
        setRatingsDistribution(calculateRatingsDistribution(data?.result?.messages))
      }
      if (refresh) {
        toast({
          title: 'Messages Refreshed',
          description: 'Showing latest messages',
          duration: 3000,
          style: {
            background: 'black',
            color: 'white',
            font: 'semi-bold',
          },
        });
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch messages',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
      setIsLoading(false);
    }
  }, [setMessages]);

  const handleSwitchChange = async () => {
    try {
      const res = await fetch(`/api/accept-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ acceptMessages: !acceptMessages }),
      });
      const val = await res.json();
      setAcceptMessages(!acceptMessages);
      toast({
        title: 'Success',
        description: val.result.message,
        duration: 3000,
        style: {
          background: 'black',
          color: 'white',
          font: 'semi-bold',
        },
      });
    } catch (err) {
      console.error('Error switching messages:', err);
      toast({
        title: 'Error',
        description: 'Failed to switch messages',
        variant: 'destructive',
      });
    }
  };

  const getQrCode = async () => {
    await qrcode.toDataURL(`http://localhost:3000/u/${session?.user.username}/feedback`).then(setQrUrl);
  }

  const handleNewMessage = useCallback((message: any) => {
    console.log("message", message);
    if (message?.type !== 'greeting') {
      setNotifications((prev) => [...prev, message]);
      toast({
        title: 'New Message',
        description: <div className='flex flex-col items-left'><h1>{message.text}</h1> <h1>Rated:{message.rating}</h1></div>,
        duration: 3000,
        style: {
          background: 'black',
          color: 'white',
          font: 'semi-bold',
        },
      });
    }
  }, [setNotifications]);

  useWebSocket(handleNewMessage, session?.user?.username);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessage();
  }, [session]);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    getQrCode();
  }, [session]);




  if (!session || !session.user) {
    return <div className="flex w-full min-h-[80vh] justify-center items-center"><Loader className="animate-spin w-6 h-6 " /></div>;
  }

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}/feedback`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
      duration: 3000,
      style: {
        background: 'black',
        color: 'white',
        font: 'semi-bold',
      },
    });
  };

  const shareImage = async () => {
    try {
      if (navigator.share) {
        const response = await fetch(qrUrl);
        const blob = await response.blob();
        const file = new File([blob], 'FeedMeQrcode.png', { type: 'image/png' });

        await navigator.share({
          title: 'Feed Me QR Code',
          text: 'Check out this QR code!',
          files: [file],
        });
      } else {
        console.error('Web Share API is not supported in your browser.');
      }
    } catch (err) {
      console.error('Failed to share: ', err);
    }
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'feedMeQrcode.png';
    link.click();
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  return (
    <div className="my-8 md:mx-8 lg:mx-auto p-6 bg-background rounded w-full flex-grow flex-1">
      <h1 className="text-4xl font-bold mb-4 capitalize">{username} Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Get Your Unique Link</h2>{' '}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-[25%] p-2 rounded-lg"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
          <div className="flex gap-2 items-center">
            <h1>Or</h1>
            <img src={qrUrl} alt="QR Code" />
            <div className="flex gap-2 items-center cursor-pointer">
              <Button onClick={shareImage}>Share</Button>
              <Download onClick={downloadImage} />
            </div>
          </div>
          <div className='flex-1 justify-end items-end flex pr-6'>
            <RatingComponent averageRating={averageUserRating}
              totalRatings={messages.length}
              ratingsDistribution={ratingsDistribution} />
          </div>
        </div>
      </div>
      {session && (
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
          <Loader className="animate-spin w-6 h-6 " />
        ) : (
          <RefreshCcw className="w-6 h-6" />
        )}
        Refresh Messages
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
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
};

export default Page;




