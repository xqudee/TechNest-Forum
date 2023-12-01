import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { usePost } from '../../hooks/usePost';
import MaterialIcons from '../ui/MaterialIcons';
import './Reactions.css'
import { useAuth } from '../../hooks/useAuth';


const Reactions = ({postReaction, itemId, isItemLike, isItemDislike, rating}) => {
    const auth = useAuth();
    return (
        <>
            {auth && (
                <div className='reactions'>
                    <div className='reaction' onClick={() => postReaction(itemId, 'like')}>
                        {isItemLike ? (
                            <MaterialIcons iconName={'CommentLikeActive'} />
                        ) : (
                            <MaterialIcons iconName={'CommentLike'} />
                        )}
                    </div>
                    <div className='comment-rating'>
                        {rating}
                    </div>
                    <div className='reaction' onClick={() => postReaction(itemId, 'dislike')}>
                        {isItemDislike ? (
                            <MaterialIcons iconName={'CommentDislikeActive'} />
                        ) : (
                            <MaterialIcons iconName={'CommentDislike'} />
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default Reactions