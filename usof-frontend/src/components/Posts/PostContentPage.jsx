import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import './Posts.css'
import './PostContent.css'
import { usePost } from '../../hooks/usePost';
import PostPreview from './PostPreview';
import { SortedContext, TopPostsContext } from '../../pages/Layout';
import { SortedOptions } from '../../data/sortedOptions';
import Pagination from '../Pagination/Pagination';
import { usePagination } from '../../hooks/usePagination';
import parse from 'html-react-parser';
import Editor from './Editor';
import MaterialIcons from '../ui/MaterialIcons';
import { useComment } from '../../hooks/useComment';
import CommentPreview from './Comments/CommentPreview';
import { toastr } from 'react-redux-toastr';
import axios from '../../API/axios';
import { CONFIG } from '../../App';
import Reactions from '../Reactions/Reactions';
import { formattedDate } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import BackButton from '../Buttons/BackButton';

const PostContentPage = () => {
    const { postId } = useParams();
    const [ comments, setComments ] = useState();
    const [ answer, setAnswer ] = useState();
    const [ isOpenMore, setIsOpenMore ] = useState(false);
    const { getPostById, currentPost, getPostComments, postAnswerToPost, getPostReactions, clickLike, isPostDislike, isPostLike, rating, addToBlocked, getBlockedPosts, dislikesCount, likesCount } = usePost();
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [ isBlock, setIsBlock ] = useState(false); 
    const { getCommentRating } = useComment();
    const [sort, setSort] = useState('rating');

    const getPost = async () => {
        await getPostById(postId);
    }

    const getComments = async () => {
        const resp = await getPostComments(postId);
        setComments(resp)
    }

    const getPostLikes = async (id) => {
        await getPostReactions(id);
    }

    const handleClickLike = async (id, type) => {
        await clickLike(id || currentPost.post_id, type);
        navigate(`/posts/${postId}`)
    }
    
    const handlePostAnswer = async () => {
        if (!answer) return
        await postAnswerToPost(postId, answer);
        getComments();
        setAnswer(null);
    }

    const handleClickEdit = async () => {
        navigate(`/edit_post/${postId}`)
    }

    const handleClickDelete = async () => {
        toastr.confirm("Confirm deletion", {
            onOk: async () => {
                await axios.delete(`/api/posts/${postId}`, CONFIG);
                navigate('/');
            }
        });
    }

    const handleDelComment = async (comment_id) => {
        toastr.confirm("Confirm deletion", {
            onOk: async () => {
                await axios.delete(`/api/comments/${comment_id}`, CONFIG);
                getComments();
            }
        });
    }

    const handleClickMore = () => {
        setIsOpenMore(isOpenMore => !isOpenMore)
    }

    const handleBlock = async () => {
        const res = await addToBlocked(postId);
        if (res == 'blocked') setIsBlock(true);
        else setIsBlock(false);
    }

    const handleSort = async () => {  
        const resp = await getPostComments(postId);
        let sortedComments;

        if (sort == 'rating') {
            const ratingPromises = resp.map(async comment => await getCommentRating(comment.id));
            const commentRatings = await Promise.all(ratingPromises);
            resp.forEach((comment, index) => {
                comment.rating = commentRatings[index]; 
            });

            sortedComments = resp.sort((a, b) => b.rating - a.rating);
        } else if (sort == 'date') {
            sortedComments = resp.sort((a, b) => {
                const dateA = new Date(a.publish_date).getTime();
                const dateB = new Date(b.publish_date).getTime();
                return dateB - dateA; 
            });
        }

        setComments(sortedComments)
    }

    const checkBlock = async () => {
        const res = await getBlockedPosts(); 
        res.forEach(post => {
            if (post.id == postId) {
                setIsBlock(true);
                return
            }
            setIsBlock(false);
        });
    }

    useEffect(() => {
        getPost();
        getPostLikes(postId);
        checkBlock()
        getComments();
        handleSort();
    }, [location, sort]);

    return (
    <div className='center_section post_content_section'>
        <div className='post_content-top_section'> 
            <div className='post_content-top_section-head'>
                <div className='post_content-top_section-left'>
                    <BackButton backLink={'/'} />
                    <h2>{currentPost?.title}</h2>
                </div>
                {auth && (
                    <div className='post_content-top_section-right' onClick={handleClickMore}>
                        <MaterialIcons iconName={'More'} />
                        {isOpenMore && (
                            <ul className='morePostMenu ul'>
                                <li className='morePostMenu-item' onClick={handleBlock}>{isBlock ? 'Unblock' : 'Block'}</li>
                            </ul>
                        )}
                    </div>
                )}
            </div>
            <div className='post_content-top_section-info default-bg'>
                <div className='post_content-top_section-addInfo'>
                    <p><span className='asked-span'>Asked </span>{formattedDate(currentPost?.publish_date)}</p>
                    <p className='asked-span-flex'>
                        <span className='asked-span'>by </span>
                        <Link to={`/users/${currentPost?.user_id}`}>{currentPost?.login}</Link>
                    </p>
                </div>
                <div className='post_content-top_section-rigth'>
                    {currentPost?.user_id == auth?.id && (
                        <div className='post_content-action_buttons'>
                            <div className='edit-button-cont' onClick={handleClickEdit}>
                                <MaterialIcons iconName={'Edit'} />
                            </div>
                            <div className='delete-button-cont' onClick={handleClickDelete}>
                                <MaterialIcons iconName={'Delete'} />
                            </div>
                        </div>
                    )}
                    <div className='count_likes-cont'>
                        <div>{likesCount} likes</div>
                        <div>{dislikesCount} dislikes</div>
                    </div>
                </div>
            </div>
        </div>
         <div className='post_content-content_section'>
            <Reactions
                postReaction={handleClickLike} 
                itemId={postId} 
                isItemLike={isPostLike} 
                isItemDislike={isPostDislike}
                rating={rating || 0}/>
            <div className='post_content-content_container'>
                {currentPost && parse(currentPost.content)}
            </div>
        </div>
        {comments?.length > 0 && (
            <div className='post_content-comments_section'>
                {auth && <div className='post_content-comments_sorted-section'>
                    <div>Sorted by: </div>
                    <select onChange={(e) => setSort(e.target.value)}>
                        <option value="rating">Highest rating</option>
                        <option value="date">Date created</option>
                    </select>
                </div>}
                {comments?.map((comment, index) => (
                    <div key={index} className='comment-section'>
                        <CommentPreview comment={comment} comments={comments} setComments={setComments} handleDelComment={handleDelComment} sort={sort} />
                    </div>
                ))}
            </div>
        )}

        {auth && (
            <div className={`post_content-comment_answer-section`}>
                <div className='post_content-comment_answer-title'>
                    <h3>Your answer</h3>
                    <button onClick={handlePostAnswer} className='submit_btn button-yellow'>Post answer</button>
                </div>
                <Editor content={answer} setContent={setAnswer} />
            </div>
        )}
    </div>
    )
}

export default PostContentPage