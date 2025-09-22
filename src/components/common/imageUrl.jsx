export const getImageUrl = (path) => {
  if (!path) {
    return "https://i.ibb.co/fYZx5zCP/Region-Gallery-Viewer.png"; 
  }
 
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  } else {
    const baseUrl = "http://10.10.7.46:5001";
    return `${baseUrl}/${path}`;
  }
};