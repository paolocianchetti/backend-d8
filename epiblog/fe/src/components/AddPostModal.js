import React, {useState} from 'react';
import AxiosClient from "../client/client";
const client = new AxiosClient()

const AddPostModal = ({ close }) => {
    const [file, setFile] = useState(null)
    const [formData, setFormData] = useState({})

    const onChangeSetFile = (e) => {
        setFile(e.target.files[0])
    }

    const uploadFile = async (cover) => {
        const fileData = new FormData()
        fileData.append('cover', cover)

        try {
            const response = await fetch('http://localhost:5050/posts/cloudUpload', {
                method: "POST",
                body: fileData
            })
            return await response.json()
        } catch (error) {
            console.log(error, 'Errore in uploadFile')
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        if (file) {
            try {
                const uploadCover = await uploadFile(file)
                console.log(uploadCover)
                const finalBody = {
                    ...formData,
                    cover: uploadCover.cover
                }
                const response = await fetch('http://localhost:5050/posts/create', {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: 'POST',
                    body: JSON.stringify(finalBody)
                })

                return response.json()
            } catch(error) {
                console.log(error)
            }
        } else {
            console.error('Per favore seleziona almeno un file!')
        }
    }

    return (
        <div className="h-screen w-screen fixed top-1/2 flex items-center left-1/2 backdrop-blur-lg transform -translate-y-1/2 -translate-x-1/2 z-30">
            <div className="fixed z-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-100 shadow-xl w-fit min-w-[500px] h-fit p-4 rounded-xl hover:scale-110 duration-1000">
                <h1 className="font-bold text-4xl mb-4 text-orange-700 text-center">
                    Aggiungi post
                </h1>
                <div className="w-full h-fit p-4 rounded-lg flex justify-center items-center">
                    <form
                        encType="multipart/form-data"
                        onSubmit={onSubmit}
                        className="flex flex-col justify-center items-center gap-4">
                        <input
                            className="w-[400px] p-1 rounded"
                            placeholder="title"
                            name="title"
                            type="text"
                            onChange={(e) => setFormData({
                                ...formData,
                                title: e.target.value
                            })}
                        />
                        <input
                            placeholder="category"
                            className="w-[400px] p-1 rounded"
                            name="category"
                            type="text"
                            onChange={(e) => setFormData({
                                ...formData,
                                category: e.target.value
                            })}
                        />
                        <input
                            className="w-[400px] p-1 rounded"
                            name="cover"
                            type="file"
                            onChange={onChangeSetFile}
                        />
                        <input
                            placeholder="price"
                            className="w-[400px] p-1 rounded"
                            name="price"
                            type="number"
                            onChange={(e) => setFormData({
                                ...formData,
                                price: Number(e.target.value)
                            })}
                        />
                        <input
                            placeholder="rate"
                            className="w-[400px] p-1 rounded"
                            name="rate"
                            type="number"
                            onChange={(e) => setFormData({
                                ...formData,
                                rate: Number(e.target.value)
                            })}
                        />
                        <input
                            placeholder="author"
                            className="w-[400px] p-1 rounded"
                            name="author"
                            type="text"
                            onChange={(e) => setFormData({
                                ...formData,
                                author:e.target.value
                            })}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => close(false)}
                                className="p-2 bg-amber-700 text-white rounded">
                                Chiudi
                            </button>
                            <button type="submit" className="p-2 bg-green-700 text-white rounded">
                                Aggiungi
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPostModal;

