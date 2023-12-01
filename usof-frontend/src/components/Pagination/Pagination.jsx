import { Link, useLocation, useNavigate } from "react-router-dom";
import './Pagination.css'
import { useState } from "react";
import { usePagination } from "../../hooks/usePagination";

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];
    const location = useLocation();

    for (let i = 0; i < Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    useState(() => {
        paginate(1)
    }, [location])

    return (
        <nav className="pagination-section">
            {pageNumbers.length > 1 && (
            <ul className="pagination ul">{
                pageNumbers.map(number => (
                    <li key={number} className={`pagination-item default-bg`}>
                        <Link to={`${location.pathname}`} className={`pagination-link default-bg hover-cont ${currentPage === number + 1 && 'active_page'}`} onClick={() => paginate(number + 1)}>
                            {number + 1}
                        </Link>
                    </li>
                ))
            }</ul>
            )}
        </nav>
    )
}

export default Pagination
