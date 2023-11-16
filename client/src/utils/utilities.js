<<<<<<< HEAD
export function formatDate(date) {
=======
export function formatDate(dateString) {
    const date = new Date(dateString); // Convert to Date object

>>>>>>> 270dbca7fb099feb1665c5355fcdccad74555b38
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        const seconds = diffInSeconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds} minutes ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes} hours ago`;
    } else if (now.getFullYear() === date.getFullYear()) {
        const options = { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
        return date.toLocaleString('default', options);
    } else {
        const options = { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
        return date.toLocaleString('default', options);
    }
}

