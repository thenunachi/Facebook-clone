// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import {Triangle} from 'react-loader-spinner';
// import './sticker.css';
// const STICKER_URL = 'https://api.giphy.com/v1/stickers/search';
// const API_KEY = '2qo2Fm1rH0oWXOMxeyZonYDePjeroAwN'; // Replace with your Giphy API key

// const Sticker = () => {
//   const [stickerData, setStickerData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasMoreData, setHasMoreData] = useState(true);

//   // Function to load more sticker data
//   const loadMoreStickerData = async () => {
//     try {
//       setIsLoading(true);

//       const results = await axios.get(
//         `${STICKER_URL}?api_key=${API_KEY}&q=funny&limit=10&offset=${currentPage * 10}&rating=G&lang=en`
//       );

//       const newData = results.data.data;

//       setStickerData((prevData) => [...prevData, ...newData]);

//       // Check if there is more data to load
//       if (newData.length < 10) {
//         setHasMoreData(false);
//       }

//       setCurrentPage((prevPage) => prevPage + 1);
//     } catch (error) {
//       console.error('Error fetching stickers:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <InfiniteScroll
//       dataLength={stickerData.length}
//       next={loadMoreStickerData}
//       hasMore={hasMoreData}
//       loader={
//         isLoading ? (
//           <div className="spinner">
//             <Triangle type="Puff" color="#00BFFF" height={100} width={100} />
//           </div>
//         ) : null
//       }
//     >
//       <div className="sticker">
//         {stickerData.map((sticker, index) => (
//           <div
//             className="sticker__image-container"
//             key={index}
//             onClick={() => {
//               // Handle sticker selection (e.g., add the sticker URL to the chat input)
//               console.log('Selected sticker URL:', sticker.images.fixed_height.url);
//             }}
//           >
//             <img
//               className="sticker__image"
//               src={sticker.images.fixed_height.url}
//               alt="gif"
//             />
//           </div>
//         ))}
//       </div>
//     </InfiniteScroll>
//   );
// };

// export default Sticker;
