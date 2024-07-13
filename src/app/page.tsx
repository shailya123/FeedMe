'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import messages from '@/messages.json';
import Autoplay from 'embla-carousel-autoplay';
import { Mail } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import './globals.css'

export default function Home() {
  return (
    <div className='flex flex-col min-h-[82vh] bg-background'>
      <main className="flex flex-col items-center justify-center flex-grow px-6 md:px-24 py-12 ">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Explore the Realm of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-xl">
            FeedMe - Your Secret, Our Priority
          </p>
        </section>
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl "
        >
          <CarouselContent className='shadow-md'>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>
    </div>
  );
}