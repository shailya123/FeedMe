"use client"
import ProfileDialog from '@/components/self-ui/ProfileDialog';
import { useAuth } from '@/context/UserContext';
import { User } from '@/model/User';
import { Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import '../../../globals.css'
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
                    console.log(userData);

                } catch (err) {
                    console.log("error while fetching unique username", err);
                }
            }
        }
        getUserInfo()
    }, [user])

    return (
        <div className="p-6 flex flex-col gap-5 flex-grow ">
            <div className='flex justify-end items-end'>
                <ProfileDialog user={user} userData={userData}>
                    <Edit />
                </ProfileDialog>
            </div>
            <div className='flex justify-around  flex-1 items-start'>
                <div className="flex flex-col gap-1 items-center">
                    <img src={userData?.profileImg || 'https://images.unsplash.com/photo-1542065435-d6bc2eac3377?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D'}
                        className="w-36 h-36 rounded-full object-cover" />
                    <h1 className="text-2xl font-semibold mt-4">{user?.name || user?.username}</h1>
                    <div className="flex flex-col items-center mt-2">
                        <div className="ml-2 flex">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.063 5.845 1.421 8.257L12 18.896 4.642 23.408l1.421-8.257-6.063-5.845 8.332-1.151z" />
                                </svg>
                            ))}
                        </div>
                        <p className="text-gray-600">5</p>
                    </div>
                </div>
                <div>
                    <div className="w-full mt-4">
                        <h2 className="text-lg font-semibold">Contact Information</h2>
                        <p>Phone: {userData.contactNumber}</p>
                        <p>Address: {userData.address}</p>
                        <p>Email: {user?.email}</p>
                        <p>Website: www.jeremyrose.com</p>
                    </div>
                    <div className="w-full mt-4">
                        <h2 className="text-lg font-semibold">Basic Information</h2>
                        <p>Birthday: June 3, 1992</p>
                        <p>Gender: {userData.gender}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
