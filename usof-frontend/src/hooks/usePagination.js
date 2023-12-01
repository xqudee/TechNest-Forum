import { useMemo, useState } from "react";

export const usePagination = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentItems, setCurrentItems] = useState([]);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const getCurrentItems = (itemsPerPage, itemsArray) => {
        if (itemsArray == null) return [];
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = itemsArray?.slice(indexOfFirstItem, indexOfLastItem);
        setCurrentItems(currentItems);
        return currentItems;
    }
 
    return useMemo(() => ({
        currentPage, paginate, getCurrentItems, currentItems, currentPage
    }), [currentPage, paginate, getCurrentItems, currentItems, currentPage]);
}