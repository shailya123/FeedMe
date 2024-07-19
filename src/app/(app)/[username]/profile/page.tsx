"use client"
import ProfileDialog from '@/components/self-ui/ProfileDialog';
import { useAuth } from '@/context/UserContext';
import { User } from '@/model/User';
import { Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaLinkedinIn } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import '../../../globals.css'
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Profile = () => {
    const { user } = useAuth();
    const userImage = user?.image?.toString();

    const [userData, setUserData] = useState<User>({});
    useEffect(() => {
        const getUserInfo = async () => {
            if (user?.username) {
                try {
                    const res = await fetch(`/api/get-userprofile?username=${user?.username}`)
                    const data = await res.json();
                    if (data.success)
                        setUserData(data.result.data);
                } catch (err) {
                    console.log("error while fetching unique username", err);
                }
            }
        }
        getUserInfo()
    }, [user])

    return (
        <div className="p-10 text-foreground max-w-6xl flex justify-center items-center">
            <div>
                <Link href={'/dashboard'}><Button className="text-green-500 text-lg" variant='link' size='icon'>&lt; Back</Button></Link>
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between mt-8">
                    <div className="flex flex-col items-center md:items-start">
                        <h1 className="text-5xl font-bold mb-2 capitalize">{user?.username}</h1>
                        <h2 className="text-2xl text-gray-400 mb-4">CEO @ Sendlane</h2>
                        <div className="flex space-x-4 mb-4">
                            <Link href="#" className="text-green-500 text-xl"><FaInstagram /></Link>
                            <Link href="#" className="text-green-500 text-xl"><FaLinkedinIn /></Link>
                        </div>
                    </div>
                    <img
                        src={
                            userData?.profileImg ||
                            'https://images.unsplash.com/photo-1542065435-d6bc2eac3377?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D'
                        }
                        className="w-48 h-48 rounded-full object-cover shadow-lg"
                        alt="Profile Image"
                    />
                </div>
                <p className="mt-8 text-lg leading-relaxed text-gray-300">
                    Jimmy is a former eCommerce retailer and email marketer turned SaaS founder. Located in sunny San Diego,
                    Jimmy loves helping businesses grow and scale through effective email marketing strategies.
                </p>
                <div className="mt-8">
                    <ProfileDialog user={user} userData={userData}>
                        <Button className="flex items-center space-x-2 bg-green-500 text-foreground px-4 py-2 rounded-md">
                            <Edit className="w-5 h-5" />
                            <span>Edit Profile</span>
                        </Button>
                    </ProfileDialog>
                </div>
            </div>
        </div>
    );
};

export default Profile
