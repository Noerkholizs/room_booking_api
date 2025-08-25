export const removeTrailingSlash = (url: string) => {
    return (url) ? url.replace(/\/$/, '') : url;
}