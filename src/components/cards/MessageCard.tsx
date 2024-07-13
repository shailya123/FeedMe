"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Message } from '@/model/User'
import dayjs from 'dayjs'
import { Trash2 } from 'lucide-react'
import { useToast } from '../ui/use-toast'
type MessageCardProps = {
  message: Message,
  onMessageDelete: (messageId: string) => void
}
const MessageCard = ({ message, onMessageDelete }: MessageCardProps

) => {
  const { toast } = useToast();
  const handleDeleteConfirm = async () => {
    const res = await fetch(`/api/delete-message/${message._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const val = await res.json();
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
    onMessageDelete(message._id)
  }
  return (
    <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='ghost'>
                <Trash2 className="w-5 h-5 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        Rated you: <strong>{message?.rating}/5</strong>
      </CardContent>
      <CardFooter className=' flex text-xs justify-end items-end'>
        <h1>{dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}</h1>
      </CardFooter>
    </Card>
  );
}

export default MessageCard
