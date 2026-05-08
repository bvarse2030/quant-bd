/*
|-----------------------------------------
| setting up GenerateImgeDialog for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export const generateImageDialogComponentFile = (): string => {
  return `import Image from 'next/image'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

const ImageDialog = ({
    handleAddImages,
}: {
    handleAddImages: (newImage: string) => void
}) => {
    const [allImages, setAllImages] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [selectImg, setSelectImg] = useState('')

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setLoading(true)
            const formData = new FormData()
            formData.append('image', file)

            const response = await fetch(
                \`https://api.imgbb.com/1/upload?key=\${process.env.NEXT_PUBLIC_IMGBB_API_KEY}\`,
                {
                    method: 'POST',
                    body: formData,
                }
            )

            const data = await response.json()
            if (data.success) {
                // Save image data to our server
                const saveResponse = await fetch('/api/media', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        delete_url: data.data.delete_url,
                        url: data.data.url,
                        display_url: data.data.display_url,
                    }),
                })

                if (!saveResponse.ok) {
                    throw new Error('Error! Cannot save the image.')
                }
                setAllImages([data?.data?.url, ...allImages])
                toast.success('Image uploaded successfully!')
                setShowUploadModal(false)
            } else {
                toast.error('Error! Cannot upload the image')
            }
        } catch (error) {
            console.error('Error uploading image:', error)
            toast.error('Error! Cannot upload the image')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('/api/media')
                if (!response.ok) {
                    throw new Error('Failed to fetch images');
                }
                const data = await response.json()
                const lstImage: string[] = data?.data.map(
                    (i: { url: string }) => i.url
                )
                setAllImages(lstImage)
            } catch (error) {
                console.error('Failed to fetch images:', error)
            }
        }
        fetchImages()
    }, [])

    const handleSelect = (url: string) => {
        if (selectImg === url) {
            setSelectImg('')
            // Optionally, you might want to call a function to remove the image
        } else {
            handleAddImages(url)
            setSelectImg(url)
        }
    }

    return (
        <ScrollArea className="w-full h-[60vh] p-1 pr-2 border rounded-md">
            <main className="w-full min-h-[60vh] flex flex-col">
                <div className="flex justify-between items-center border-b p-2 mb-2">
                    <h1 className="text-lg font-semibold w-full">
                        Select an Image or Upload
                    </h1>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowUploadModal(true)}
                    >
                        Upload New
                    </Button>
                </div>
                {showUploadModal ? (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                            <h3 className="text-xl font-semibold mb-4">
                                Upload Image
                            </h3>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={loading}
                            />
                            {loading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
                            <div className="flex justify-end gap-2 mt-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowUploadModal(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        {allImages.length > 0 ? (
                            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {allImages.map((imageUrl, index) => (
                                    <div
                                        onClick={() => handleSelect(imageUrl)}
                                        key={index + imageUrl}
                                        className={\`relative w-full aspect-square border-2 rounded-lg overflow-hidden cursor-pointer transition-all \${selectImg === imageUrl ? 'border-blue-500 ring-2 ring-blue-500' : 'border-slate-300 hover:border-slate-500'}\`}
                                    >
                                        <Image
                                            src={imageUrl}
                                            layout="fill"
                                            alt="Media"
                                            objectFit="cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col w-full items-center justify-center mt-10 text-gray-500">
                                <p>No images found.</p>
                                <p className="text-sm">Try uploading one!</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </ScrollArea>
    )
}
export default ImageDialog
`;
};
