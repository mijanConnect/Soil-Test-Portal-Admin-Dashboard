export const getImageUrl = (path) => {
  if (!path) {
    return "https://i.ibb.co/fYZx5zCP/Region-Gallery-Viewer.png"; 
  }
 
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  } else {
    const baseUrl = "http://146.190.126.8:5001";
    return `${baseUrl}/${path}`;
  }
};