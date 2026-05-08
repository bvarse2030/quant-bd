/*
|-----------------------------------------
| setting up ImageUploadFieldSingleCoreCode for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export const ImageUploadFieldSingleCoreCode = `
import Image from 'next/image'
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'

import { Input } from '@/components/ui/input'
import { Loader } from 'lucide-react'

const ImageUploadFieldSingle = () => {
    const [loading, setLoading] = useState(false)
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)

    // You might want to fetch an existing profile image from your API here
    // For simplicity, we'll use the initialImageUrl prop for now.
    useEffect(() => {
        // Example: Fetch user's current profile image if not provided initially
        // const fetchProfileImage = async () => {
        //   const response = await fetch('/api/user/profile-image');
        //   const data = await response.json();
        //   if (data.url) {
        //     setProfileImageUrl(data.url);
        //   }
        // };
        // if (!initialImageUrl) {
        //   fetchProfileImage();
        // }
    }, [])
    const onImageUploadSuccess = (newImageUrl: string) => {
        console.log('new Image url :', newImageUrl)
    }
    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setLoading(true)
            const formData = new FormData()
            formData.append('image', file)

            // Upload to imgbb
            const response = await fetch(
                \`https://api.imgbb.com/1/upload?key=\${process.env.NEXT_PUBLIC_IMGBB_API_KEY}\`,
                {
                    method: 'POST',
                    body: formData,
                }
            )

            const data = await response.json()

            if (data.success) {
                const newImageUrl = data.data.url

                // Save image data to your server, specifically for profile image
                const saveResponse = await fetch('/api/profile-media', {
                    // Changed endpoint to distinguish from generic media
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        delete_url: data.data.delete_url,
                        url: newImageUrl,
                        display_url: data.data.display_url,
                    }),
                })

                if (!saveResponse.ok) {
                    throw new Error('Error! Cannot save the profile image.')
                }

                setProfileImageUrl(newImageUrl)
                toast.success('Profile image uploaded successfully!')
                if (onImageUploadSuccess) {
                    onImageUploadSuccess(newImageUrl)
                }
            } else {
                toast.error('Error! Cannot upload the profile image')
            }
        } catch (error) {
            console.error('Error uploading profile image:', error)
            toast.error('Error! Cannot upload the profile image')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-sm w-full max-w-sm mx-auto">
            <h3 className="text-xl font-semibold mb-4">Profile Image</h3>
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-slate-300 flex items-center justify-center bg-gray-100 mb-4">
                {profileImageUrl ? (
                    <Image
                        src={profileImageUrl}
                        alt="Profile"
                        fill
                        objectFit="cover"
                    />
                ) : (
                    <span className="text-gray-500 text-sm">No Image</span>
                )}
            </div>
            <div className="w-full">
                <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={loading}
                    className="mb-3"
                />
                {loading && (
                    <div className="flex items-center justify-center gap-2 text-blue-500">
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                    </div>
                )}
                {!loading && !profileImageUrl && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                        Upload your profile picture.
                    </p>
                )}
            </div>
        </div>
    )
}

export default ImageUploadFieldSingle
`;
