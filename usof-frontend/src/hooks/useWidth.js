import { useEffect, useMemo, useState } from 'react';
import axios from '../API/axios';
import { toastr } from 'react-redux-toastr';
import modelsEnum from '../utils/models-enum';
import { CONFIG } from '../App';
import { useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useWidth = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
  
    useEffect(() => {
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    return useMemo(() => ({
        windowWidth
    }), [windowWidth]);
}