import { useEffect, useState } from 'react';
import './MaterialIcons.css'
// import Navbar from './Navbar';

import { TbJewishStar } from "react-icons/tb";
import { BiSolidToTop } from "react-icons/bi";
import { RiUserStarLine } from "react-icons/ri";
import { BsArrowRightSquareFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { BsPinFill } from "react-icons/bs";
import { BsPinAngle } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropupCircle } from "react-icons/io";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdCloudUpload } from "react-icons/md";
import { IoStarSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { CgMenu } from "react-icons/cg";

const MaterialIcons = ({iconName}) => {
    const [activeEdit, setActiveEdit] = useState(false);

    const onClickEdit = () => {
        setActiveEdit(activeEdit => !activeEdit)
    }

    return (
        <>
            {
                iconName === 'Close' ? <div className='icon_close-button icon'>
                </div> : iconName === 'Edit' ? <div className={`icon_edit icon`}>
                    <BiSolidEditAlt fill='var(--light-orange)' size={'100%'} />
                </div> : iconName === 'EditButton' ? <div className={`icon_edit-button icon ${activeEdit && 'icon_edit_black-button'}`} onClick={onClickEdit} >
                </div> : iconName === 'Back' ? <div className='icon_back-button icon'>
                </div> : iconName === 'More' ? <div className='icon_more-button icon'>
                    <FiMoreHorizontal stroke='var(--text-color)' size={'100%'} />
                </div> : iconName === 'Star' ? <div className='icon'>
                    <TbJewishStar stroke='var(--light-green)' size={'100%'} />
                </div> : iconName === 'Top' ? <div className='icon'>
                    <BiSolidToTop fill='var(--light-orange)' size={'100%'} />
                </div> : iconName === 'FollowingPosts' ? <div className='icon'>
                    <RiUserStarLine fill='var(--red-color)' size={'100%'} />
                </div> : iconName === 'ArrowRight' ? <div className='arrow_right-button icon'>
                    <BsArrowRightSquareFill fill='var(--extralight-gray)' size={'100%'} />
                </div> : (iconName === 'HeartActive') ? <div className='heart-button-cont icon'>
                    <FaHeart className='active heart-button-fill' style={{ width: '100%', height: '90%', fill: 'var(--red-color)', stroke: 'var(--red-color)', strokeWidth: '40px' }} />
                </div> : (iconName === 'HeartInactive') ? <div className='heart-button-cont icon'>
                    <FaHeart className='heart-button' style={{ width: '100%', height: '90%', fill: 'transparent', stroke: 'var(--red-color)', strokeWidth: '40px' }} />
                </div> : (iconName === 'FavoriteInactive') ? <div className='favorite-button icon'>
                </div> : (iconName === 'FavoriteActive') ? <div className='favorite-button-active icon'>
                </div> : iconName === 'Pin' ? <div className='pin-button icon'>
                    <BsPinAngle fill='var(--light-orange)' size={'100%'} />
                </div> : iconName === 'PinActive' ? <div className='pin-button icon'>
                    <BsPinFill fill='var(--light-orange)' size={'100%'} />
                </div> : iconName === 'ArrowDown' ? <div className='arrow_down-button icon'>
                    <IoIosArrowDown fill='var(--gray-text-color)' size={'100%'} />
                </div> : iconName === 'CommentDislike' ? <div className='dislike-button icon'>
                    <IoIosArrowDropdown fill='var(--gray-text-color)' size={'100%'} />
                </div> : iconName === 'CommentLike' ? <div className='like-button icon'>
                    <IoIosArrowDropup fill='var(--gray-text-color)' size={'100%'} />
                </div> : iconName === 'CommentDislikeActive' ? <div className='dislike-button icon'>
                    <IoIosArrowDropdownCircle fill='var(--gray-text-color)' size={'100%'} />
                </div> : iconName === 'CommentLikeActive' ? <div className='like-button icon'>
                    <IoIosArrowDropupCircle fill='var(--gray-text-color)' size={'100%'} />
                </div> : iconName === 'Delete' ? <div className='delete-button icon'>
                    <AiOutlineDelete fill='var(--red-color)' size={'100%'} />
                </div> : iconName === 'FileUploader' ? <div className='file_uploader-button icon'>
                    <MdCloudUpload fill='var(--red-color)' size={'100%'} />
                </div> : iconName === 'StarRating' ? <div className='Star-button icon'>
                    <IoStarSharp fill='var(--light-green)' size={'100%'} />
                </div> : iconName === 'DeleteClose' ? <div className='delete_close-button icon'>
                    <IoClose fill='var(--red-color)' size={'100%'} />
                </div> : iconName === 'ArrowSettings' ? <div className='delete_close-button icon'>
                    <IoIosArrowForward fill='var(--red-color)' size={'100%'} />
                </div> : iconName === 'Menu' ? <div className='menu-button icon'>
                    <CgMenu fill='var(--text-color)' size={'100%'} />
                </div> : null 
            }
        </>
    )
}

export default MaterialIcons