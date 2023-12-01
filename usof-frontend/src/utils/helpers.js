
export const formattedDate = (date) => {
    const newDate = new Date(date?.toString());
    const today = new Date();

    if (newDate.getDate() == today.getDate() && newDate.getMonth() == today.getMonth() && newDate.getFullYear() == today.getFullYear()) {
        return 'today';
    }
    
    const options = { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const formattedDate = newDate.toLocaleDateString('en-US', options);

    const result = formattedDate.split(',');
    
    return result[0] + ',' + result[1];
}

export const cutTitle = (title, countSymbols) => {
    if (title.length < countSymbols + 1) return title;
    return title.substring(0, countSymbols).trim() + '...'
}

export const getDaysAgo = (publish_date) => {
    const date = new Date(publish_date?.toString());
    const today = new Date();

    const millisecondsPerDay = 1000 * 60 * 60 * 24; 

    const differenceMilliseconds = today.getTime() - date.getTime();
    const daysAgo = Math.floor(differenceMilliseconds / millisecondsPerDay);

    return daysAgo;
}