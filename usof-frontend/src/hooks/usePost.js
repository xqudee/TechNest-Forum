import { useEffect, useMemo, useState } from 'react';
import axios from '../API/axios';
import { toastr } from 'react-redux-toastr';
import modelsEnum from '../utils/models-enum';
import { CONFIG } from '../App';
import { useAuth } from './useAuth';

export const usePost = () => {
    const [rating, setRating] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [posts, setPosts] = useState([]);
    const [currentPost, setCurrentPost] = useState();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isPostLike, setIsPostLike] = useState(false);
    const [isPostDislike, setIsPostDislike] = useState(false);
    const [ likesCount, setLikesCount ] = useState(0);
    const [ dislikesCount, setDislikesCount ] = useState(0);
    const auth = useAuth();

    // const fetchData = async (sort = null) => {
    //     let request = `/api/posts`;
    //     if (sort) {
    //         request += `?sort=${sort}`;
    //     }
    
    //     try {
    //         const response = await axios.get(request, { withCredentials: true });
    //         if (response) {
    //             setPosts(response.data.data);
    //             return response.data.data;
    //         } else {
    //             setPosts([]);
    //             return [];
    //         }
    //     } catch (error) {
    //         setPosts([]);
    //         return [];
    //     }
    // }

    const fetchData = async () => {
        try {
            const response = await axios.get(`/api/posts`, { withCredentials: true });
            if (response) {
                setPosts(response.data.data);
                return response.data.data;
            } else {
                setPosts([]);
                return [];
            }
        } catch (error) {
            setPosts([]);
            return [];
        }
    }

    const getPostById = async (id) => {
        try {
            const response = await axios.get(`/api/posts/${id}`, { withCredentials: true });
            if (response.data.data) {
                setCurrentPost(response.data.data);
                return response.data.data;
            } else {
                setCurrentPost(null);
                return null;
            }
        } catch (error) {
            setCurrentPost(null);
            return null;
        }
    }

    const getBlockedPosts = async () => {
        try {
            const response = await axios.get(`/api/users/${auth.id}/blocked_posts`, { withCredentials: true });
            if (response.data.data) {
                setPosts(response.data.data);
                return response.data.data;
            } else {
                setPosts([]);
                return [];
            }
        } catch (error) {
            setPosts([]);
            return [];
        }
    }

    const addToBlocked = async (postId) => {
        try {
            const response = await axios.post(`/api/posts/${postId}/block`, null, { withCredentials: true });
            if (response.data.message.includes('unblocked')) return 'unblocked' 
            else if (response.data.message.includes('blocked')) return 'blocked'
            else return 'error'
        } catch (error) {
            return error
        }
    }

    const createPost = async (data) => {
        try {
            const jsonData = JSON.stringify(data);
            const response = await axios.post(`/api/posts`, jsonData, CONFIG);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    const editPost = async (data, id) => {
        try {
            const jsonData = JSON.stringify(data);
            const response = await axios.patch(`/api/posts/${id}`, jsonData, CONFIG);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    const getPostComments = async (postId) => {
        try {
            const response = await axios.get(`/api/posts/${postId}/comments`, { withCredentials: true });
            if (response.data.data) {
                return response.data.data;
            } else {
                return [];
            }
        } catch (error) {
            return [];
        }
    }

    const getFollowingPosts = async () => {
        const id = auth.id;
        
        try {
            const response = await axios.get(`/api/posts/${id}/favorite-posts`, { withCredentials: true });
            if (response.data.data) {
                setPosts(response.data.data);
                return response.data.data;
            } else {
                setPosts([]);
                return [];
            }
        } catch (error) {
            setPosts([]);
            return [];
        }
    }

    const checkFavorite = async (postId) => {
        const userId = auth.id
        try {
            const response = await axios.get(`/api/posts/${userId}/favorite-posts`, { withCredentials: true });
            setIsFavorite(false);
            let flag = false;
            if (response.data.data) {
                response.data.data.forEach(item => {
                    if (item.post_id == postId) {
                        setIsFavorite(true);
                        flag = true;
                        return true;
                    }
                });
                if (flag) return true;
                else return false;
            } else {
                setIsFavorite(false);
                return false;
            }
        } catch (error) {
            setIsFavorite(false);
            return false;
        }
    }


    const clickLike = async (id, type) => {
        const data = {
            type: type
        }
        const jsonData = JSON.stringify(data);

        await axios.post(`/api/posts/${id}/like`, jsonData, CONFIG)
        .then(() => {
        }).catch(() => {
        })
    }

    const postCommentsCount = async (id) => {
        await axios.get(`/api/posts/${id}/comments`, { withCredentials: true })
        .then((response) => {
            if (response) {
                setCommentsCount(response.data.data.length);
            } else {
                setCommentsCount(0);
            }
        }).catch((error) => {
            setCommentsCount(0);
        })
    }

    const getPostReactions = async (id) => {
        try {
            const userId = auth.id;

            const response = await axios.get(`/api/posts/${id}/like`, CONFIG);
            if (response.data) {
                const likesCount = response.data.data?.filter((post) => post.type === 'like').length;
                const dislikesCount = response.data.data?.filter((post) => post.type === 'dislike').length;
                setRating(likesCount - dislikesCount || 0);
                setLikesCount(likesCount)
                setDislikesCount(dislikesCount)

                const isLike = response.data.data?.some((post) => post.type === 'like' && post.user_id == userId);
                const isDislike = response.data.data?.some((post) => post.type === 'dislike' && post.user_id == userId);

                if (isLike) {
                    if (isPostDislike) setIsPostDislike(isPostDislike => !isPostDislike)
                    setIsPostLike(isPostLike => !isPostLike)
                } 
                
                if (isDislike) {
                    if (isPostLike) setIsPostLike(isPostLike => !isPostLike)
                    setIsPostDislike(isPostDislike => !isPostDislike)
                }

                if (!isLike && !isDislike) {
                    setIsPostLike(false)
                    setIsPostDislike(false)
                }

            } else {                
                return 0;
            }
        } catch (error) {    
            setIsPostDislike(isPostDislike => isPostDislike = false)
            setIsPostLike(isPostLike => isPostLike = false);        
            return 0;
        }
    }

    // const clickLike = async (id, type) => {
    //     const data = {
    //         type: type
    //     }
    //     const jsonData = JSON.stringify(data);

    //     await axios.post(`/api/posts/${id}/like`, jsonData, CONFIG)
    //     .then((response) => {
    //         if (response.data.message == "Liked") {
    //             setIsLike(true);
    //         } else {   
    //             setIsLike(false);        
    //         } 
    //     }).catch((error) => {
    //         setIsLike(false);
    //     })
    // }

    const clickFavorite = async (postId) => {

        await axios.post(`/api/posts/${postId}/favorite`, null, { withCredentials: true })
        .then((response) => {
            if (response.data.message == "Post was added to favorites") {
                setIsFavorite(true);
            } else {                
                setIsFavorite(false);
            }
        }).catch((error) => {
            setIsFavorite(false);
        })
    }

    const postAnswerToPost = async (postId, comment) => {
        comment = comment.trim().replace(/'/g, "\\'");
        const data = {
            content: comment
        }
        const jsonData = JSON.stringify(data);

        await axios.post(`/api/posts/${postId}/comments`, jsonData, CONFIG)
        .then((response) => {
            if (response.data.data) {
                return true;
            } else {                
                return false;
            }
        }).catch((error) => {       
            return false;
        })
    }

    const searchPostByName = async (name) => {
        try {
            const response = await axios.get(`/api/posts/post?substring=${name}`, CONFIG);
            if (response) {
                return response.data.data;
            } else {
                return [];
            }
        } catch (error) {
            return [];
        }
    }

    const getPostsByCategory = async (categoryId) => {
        try {
            const response = await axios.get(`/api/categories/${categoryId}/posts`, CONFIG);
            if (response) {
                return response.data.data;
            } else {
                return [];
            }
        } catch (error) {
            if (error.response.data.message == 'Token is missing')
            return null;
        }
    }
 
    return useMemo(() => ({
        getPostReactions, rating, likesCount, dislikesCount, clickLike, postCommentsCount, commentsCount, posts, fetchData, getFollowingPosts, clickFavorite, isFavorite, checkFavorite, currentPost, getPostById, createPost, getPostComments, postAnswerToPost, isPostDislike, isPostLike, editPost, searchPostByName, getPostsByCategory, getBlockedPosts, addToBlocked
    }), [getPostReactions, rating, likesCount, dislikesCount, clickLike, postCommentsCount, commentsCount, posts, fetchData, getFollowingPosts, clickFavorite, isFavorite, checkFavorite, currentPost, getPostById, createPost, getPostComments, postAnswerToPost, isPostDislike, isPostLike, editPost, searchPostByName, getPostsByCategory, getBlockedPosts, addToBlocked]);
}