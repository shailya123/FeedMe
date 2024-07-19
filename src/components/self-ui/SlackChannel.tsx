'use client'
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { slackMessageSchema } from "@/schemas/sendSlackMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "../ui/textarea";
import { sendMessage } from "../utils/sendMessageToSlack";
import Selectdemo from "./Select";

import slackImage from '../../../public/slackImage.png'
import Image from "next/image";

export default function SlackChannel() {
    const [channels, setChannels] = useState([]);
    const [channelWithId, setChannelsWithId] = useState([]);
    const { data: session } = useSession();
    const [channelSelected, setChannelSelected] = useState('');
    const [message, setMessage] = useState('');
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const fetchChannels = async () => {
            console.log(session?.user);
            try {
                const response = await fetch('/api/slack/channels');
                const data = await response.json();
                if (response.ok) {
                    setChannels(data.channels.map((x: any) => x.name));
                    setChannelsWithId(data.channels.map((x: any) => ({
                        id: x.id,
                        name: x.name
                    })));
                } else {
                    console.error('Error fetching channels:', data.error);
                }
            } catch (error) {
                console.error('Error fetching channels:', error);
            }
        };

        fetchChannels();
    }, []);
    const form = useForm<z.infer<typeof slackMessageSchema>>({
        resolver: zodResolver(slackMessageSchema),
        defaultValues: {
            channel: '',
            message: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof slackMessageSchema>) => {
        const channelId = channelWithId.filter((x: any) => x.name === data.channel)[0]?.id;
        const p = await sendMessage(channelId, data.message);
        if (p.result?.ok) {
            setIsDialogOpen(false);
            form.reset();
        } else {
            toast({
                title: 'Failure',
                description: 'Failed to send message',
                variant: 'destructive',
            });
        }
    }
    return (
        <div className="text-foreground flex flex-1 justify-end pr-6">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-green-500 flex gap-2"><Image src={'/slackImage.png'} alt="slackImage" width={25} height={25}/>Slack</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Slack Dashboard</DialogTitle>
                        <DialogDescription>
                            Send Message to ther Slack Channel
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="channel"
                                render={({ field }) => (
                                    <FormItem className="relative " >
                                        <FormLabel>Channel</FormLabel>
                                        <FormControl className="shadow-md">
                                            <Selectdemo items={channels} type={"channels"} onChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem className="relative " >
                                        <FormLabel>Message</FormLabel>
                                        <FormControl className="shadow-md">
                                            <Textarea
                                                placeholder="Write yout message here"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-center ">
                                <Button type="submit" >Send</Button>
                            </div>
                        </form>
                    </Form>
                    <DialogFooter>

                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
