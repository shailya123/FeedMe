'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { MessagesSchema } from '@/schemas/messageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCompletion } from 'ai/react';
import { Loader2, Star, StarHalf } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import ReactStars from 'react-rating-stars-component'
import '../../../globals.css';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const { toast } = useToast();
  const [selectedRating, setselectedRating] = useState(0);

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof MessagesSchema>>({
    resolver: zodResolver(MessagesSchema),
    defaultValues: {
      content: '',
      rating: 0
    }
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof MessagesSchema>) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, username }),
      })
      const val = await res.json();
      if (val.success) {
        const socket = new WebSocket('ws://localhost:9000');
        socket.onopen = () => {
          socket.send(JSON.stringify({ username, text: data.content, rating: data.rating }));
        };
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
      else {
        toast({
          title: 'Failure',
          description: val.result.message,
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Failure',
        description: 'Error while switching the message status',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false);
      form.reset({ content: '', rating: 0 });
      console.log(form.getValues());
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      //   complete('');
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Handle error appropriately
    }
  };

  const ratingChanged = (newRating: number) => {
    form.setValue('rating', newRating);
    setselectedRating(newRating)
  }
  return (
    <div className=" p-6 bg-background text-foreground flex flex-col items-center gap-5">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <div className="text-right w-full max-w-5xl">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button className="bg-green-500 text-foreground">Create Your Account</Button>
        </Link>
      </div>
      <div className="my-4 w-full max-w-5xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate</FormLabel>
                  <FormControl>
                    <ReactStars
                      count={5}
                      size={36}
                      isHalf={true}
                      onChange={ratingChanged}
                      emptyIcon={<Star />}
                      halfIcon={<StarHalf />}
                      fullIcon={<Star />}
                      activeColor="#ffd700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit" className='bg-green-500 text-foreground' disabled={isLoading || !messageContent}>
                  Send It
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
      <div className="my-4 w-full max-w-5xl">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4 bg-green-500 text-foreground"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card className="bg-gray-800 text-foreground">
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
