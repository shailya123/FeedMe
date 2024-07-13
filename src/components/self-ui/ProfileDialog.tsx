import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { profileEditSchema } from '@/schemas/profileEditSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit2, Edit2Icon, Loader2 } from "lucide-react";
import { User } from 'next-auth';
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import Selectdemo from "./Select";

type Props = {
  children: React.ReactNode;
  user?: User | null;
  userData: any
};

const ProfileDialog = ({ children, user, userData }: Props) => {
  const router = useRouter();
  const imageFormats = ['image/jpeg', 'image/jpg', 'image/png'];
  const items = ['Male', 'Female', 'Others'];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const userImage=userData?.profileImg;

 
  const form = useForm<z.infer<typeof profileEditSchema>>({
      resolver: zodResolver(profileEditSchema),
      defaultValues:{
      contactNumber:userData.contactNumber,
      profileImg:userData.profileImg,
      state:userData.state,
      city:userData.city,
      country:userData.country,
      address:userData.address,
      birthdate:userData.birthdate
      }
    });

  const onSubmit = async (data: z.infer<typeof profileEditSchema>) => {
    console.log(data);
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/update-userprofile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, email: user?.email }),
      });
      const val = await res.json();

      if (val.success) {
        toast({
          title: 'Success',
          description: val.result.message,
          duration: 3000,
          style: {
            background: 'black',
            color: 'white',
            font: 'semi-bold'
          },
        });
        setIsSubmitting(false);
        form.reset();
      } else {
        toast({
          title: 'Failure',
          description: val.result.message,
          duration: 3000,
          style: {
            background: 'red',
            color: 'white',
            font: 'semi-bold'
          },
        });
        setIsSubmitting(false);
        form.reset();
      }
    } catch (err) {
      console.error("Error while submitting profile", err);
      toast({
        title: 'Profile update failed',
        description: 'An error occurred while updating your profile.',
        variant: 'destructive'
      });
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && imageFormats.includes(file.type)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('profileImg', reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      form.setError('profileImg', { type: 'custom', message: 'Invalid image format. Please use JPEG, JPG, or PNG.' });
    }
  };

  const handleStateAndCountry = async () => {
    const pincode = form.getValues('pincode');
    if (!pincode || pincode.length !== 6) {
      form.setValue('state', '');
      form.setValue('country', '');
      form.setValue('city', '');
      return;
    }

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const results = await response.json();
      if (results[0]?.Status === 'Success') {
        const { State, Country, District } = results[0]?.PostOffice[0];
        form.setValue('state', State);
        form.setValue('country', Country);
        form.setValue('city', District);
      } else {
        form.setValue('state', '');
        form.setValue('country', '');
        form.setValue('city', '');
      }
    } catch (err) {
      console.error("Error while fetching postal data", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Your Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="profileImg"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-2 items-center relative h-36 w-36">
                      <img className="rounded-full h-36 w-36" src={userImage??field.value} alt="Profile" />
                      <input
                        type="file"
                        id="profile-image"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Edit2 type='button' className="text-white absolute right-5 bottom-5 z-10" onClick={() => document.getElementById('profile-image')!.click()}>
                        Edit Photo
                      </Edit2>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl className="shadow-md">
                      <Input placeholder="example: abc, street 1" {...field} defaultValue={userData.address} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl className="shadow-md">
                      <Input placeholder="example: 1234567891" {...field} defaultValue={userData.contactNumber} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl className="shadow-md">
                      <Selectdemo items={items} type={'gender'} onChange={field.onChange}  defaultValue={userData.gender}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl className="shadow-md">
                      <Input placeholder="example: 123456" {...field} onBlur={handleStateAndCountry} defaultValue={userData.pincode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl className="shadow-md">
                      <Input placeholder="Enter the city" {...field}  defaultValue={userData.city}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl className="shadow-md">
                      <Input placeholder="Enter the state" {...field} defaultValue={userData.state}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl className="shadow-md">
                    <Input placeholder="Enter the country" {...field} defaultValue={userData.country}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birthdate</FormLabel>
                  <FormControl className="shadow-md">
                    <Input placeholder="select your date" type="date" {...field} defaultValue={userData.birthdate} max={Date.now()}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>

            <DialogFooter>
              <Button type="submit" onClick={() => onSubmit(form.getValues())} className="shadow-md" disabled={isSubmitting} >{isSubmitting ? (<div className="flex flex-row gap-2"><h1>Please Wait</h1><Loader2 className="mr-2 h-4 w-4 animate-spin" /></div>) : ('Save Changes')}</Button>
              <DialogClose>
                <Button type='button' className='bg-red-500' onClick={() => form.reset()}>Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
