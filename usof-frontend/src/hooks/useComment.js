import { useEffect, useMemo, useState } from 'react';
import axios from '../API/axios';
import { toastr } from 'react-redux-toastr';
import modelsEnum from '../utils/models-enum';
import { CONFIG } from '../App';
import { useAuth } from './useAuth';
import { usePost } from './usePost';

export const useComment = () => {
    const auth = useAuth();
    const [commentRating, setCommentRating] = useState(0);
    const [ isCommentLike, setIsCommentLike ] = useState(false);
    const [ isCommentDislike, setIsCommentDislike ] = useState(false);
    const { getPostComments } = usePost();

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
    //         console.error(error);
    //         setPosts([]);
    //         return [];
    //     }
    // }

    const isReactions = async (commentId) => {
        try {
            const userId = auth.id;

            const response = await axios.get(`/api/comments/${commentId}/like`, CONFIG);
            if (response.data) {
                const isLike = response.data.data?.some((comment) => comment.type === 'like' && comment.user_id == userId);
                const isDislike = response.data.data?.some((comment) => comment.type === 'dislike' && comment.user_id == userId);

                if (isLike) {
                    if (isCommentDislike) setIsCommentDislike(isCommentDislike => !isCommentDislike)
                    setIsCommentLike(isCommentLike => !isCommentLike)
                } 
                
                if (isDislike) {
                    if (isCommentLike) setIsCommentLike(isCommentLike => !isCommentLike)
                    setIsCommentDislike(isCommentDislike => !isCommentDislike)
                }

                if (!isLike && !isDislike) {
                    setIsCommentLike(false);
                    setIsCommentDislike(false);
                }

                return {isLike: isLike, isDislike: isDislike}
            } else {                
                return 0;
            }
        } catch (error) {    
            setIsCommentDislike(isCommentDislike => isCommentDislike = false)
            setIsCommentLike(isCommentLike => isCommentLike = false);        
            return 0;
        }
    }

    const getCommentRating = async (commentId) => {
        try {
            const userId = auth.id;

            const response = await axios.get(`/api/comments/${commentId}/like`, CONFIG);
            if (response.data) {
                const likesCount = response.data.data?.filter((comment) => comment.type === 'like').length;
                const dislikesCount = response.data.data?.filter((comment) => comment.type === 'dislike').length;
                setCommentRating(likesCount - dislikesCount);
                return likesCount - dislikesCount;
            } else {                
                return 0;
            }
        } catch (error) {    
            setIsCommentDislike(isCommentDislike => isCommentDislike = false)
            setIsCommentLike(isCommentLike => isCommentLike = false);        
            return 0;
        }
    }

    const postCommentLike = async (commentId, type) => {
        const data = {
            type: type
        }
        const jsonData = JSON.stringify(data);

        try {
            const response = await axios.post(`/api/comments/${commentId}/like`, jsonData, CONFIG);
            if (response.data) {
                const rating = await getCommentRating(commentId);
                setCommentRating(rating);
            } 
        } catch (error) {    
            return;
        }
    }

    const deleteComment = async (commentId, postId) => {
        try {
            toastr.confirm("Confirm deletion", {
                onOk: () => {
                    const deleteFunc = async () => {
                        await axios.delete(`/api/comments/${commentId}`, CONFIG);
                        const resp = await getPostComments(postId);
                        return resp;
                    }
                    deleteFunc();
                }
            });
        } catch (error) {    
            return;
        }
    }

    return useMemo(() => ({
        postCommentLike, getCommentRating, commentRating, isCommentDislike, isCommentLike, deleteComment, isReactions
    }), [postCommentLike, getCommentRating, commentRating, isCommentDislike, isCommentLike, deleteComment, isReactions]);
}