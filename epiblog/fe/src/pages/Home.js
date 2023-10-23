import React, {useEffect, useState} from 'react';
import MainLayout from "../layouts/MainLayout";
import AxiosClient from "../client/client";
import PostsCard from "../components/PostsCard";
import AddPostModal from "../components/AddPostModal";
import useSession from "../hooks/useSession";

const client = new AxiosClient()

const Home = () => {
    const [posts, setPosts] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const session = useSession()
    // stampiamo i dati dell'utente ricavati dalla decodifica del token
    console.log(session) 

    const toggleModal = () => setIsModalOpen(!isModalOpen)
    const getPosts = async () => {
        try {
            const response = await client.get('/posts', {
                headers: {
                    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MzY1MmQ0NWMxNDgyY2JiZjE1MzZkYyIsImZpcnN0TmFtZSI6IlBhb2xvIiwibGFzdE5hbWUiOiJDaWFjayIsImVtYWlsIjoicGFvLmNpYWtAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2OTgwNjYwODAsImV4cCI6MTY5ODMyNTI4MH0.WbDCPn9PoAC0j6AZu624_xFJG1-nPsppF5daKFMKg-Q'
                  }
            })
            setPosts(response)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getPosts()
    }, []);

    return (
        <MainLayout>
            <button
                onClick={toggleModal}
                className="p-2 bg-amber-700 text-white rounded">
                crea post
            </button>
            <div className="w-100 flex gap-3 flex-wrap p-2">
                {posts && posts.posts?.map((post, index) => {
                    return(
                        <PostsCard
                            key={index}
                            title={post.title}
                            price={post.price}
                            author={post.author?.firstName}
                            category={post.category}
                            rate={post.rate}
                            cover={post.cover}
                        />
                    )
                })}
            </div>
            {isModalOpen && (
                <AddPostModal close={setIsModalOpen} />
            )}
        </MainLayout>
    );
};

export default Home;