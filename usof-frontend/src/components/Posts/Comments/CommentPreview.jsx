
import { useEffect, useState } from 'react';
import { useComment } from '../../../hooks/useComment';
import MaterialIcons from '../../ui/MaterialIcons';
import parse from 'html-react-parser';
import '../PostContent.css'
import { useAuth } from '../../../hooks/useAuth';
import Reactions from '../../Reactions/Reactions';
import { Link, useLocation } from 'react-router-dom';
import { formattedDate } from '../../../utils/helpers';

const CommentPreview = ({comment, comments, handleDelComment, sort}) => {
    const { postCommentLike, isReactions, getCommentRating, commentRating, deleteComment } = useComment();
    const auth = useAuth();
    const location = useLocation();
    const [isCommentDislike, setIsCommentDislike] = useState(false);
    const [isCommentLike, setIsCommentLike] = useState(false);
    // const [ commentRating, setCommentRating ] = useState(0);

    const postReactionComment = async (commentId, type) => {
        await postCommentLike(commentId, type);
        const {isLike, isDislike} = await isReactions(comment.id);
        setIsCommentDislike(isDislike)
        setIsCommentLike(isLike)
    }

    const getCommentReactions = async () => {
        await getCommentRating(comment.id);
        const {isLike, isDislike} = await isReactions(comment.id);
        setIsCommentDislike(isDislike)
        setIsCommentLike(isLike)
    }

    useEffect(() => {
        getCommentReactions();
    }, [comments])

    return (
        <div className='comment-container'>
            <Reactions 
                postReaction={postReactionComment} 
                itemId={comment.id} 
                isItemLike={isCommentLike} 
                isItemDislike={isCommentDislike}
                rating={commentRating} />

            <div className='post_content_main-comment'>
                <div className='asked_by_comment_section'>
                    <div className='default-bg asked_by_comment_section-top'>
                        <p className='asked_by_comment'>
                            <span className='asked-span'>by </span>
                            <Link to={`/users/${comment?.user_id}`}>{comment?.user_login}</Link>
                        </p>
                        <span>{formattedDate(comment.publish_date)}</span>
                    </div>
                </div>
                <div className='post_content-comment'>{parse(comment.content)}</div>
            </div>
            {
                auth?.id == comment.user_id && (
                    <div className='post_content-comment-actions'>
                        <div className='post_content-comment-delete_cont' onClick={() => { handleDelComment(comment.id) } }>
                            <MaterialIcons iconName={'Delete'} />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default CommentPreview