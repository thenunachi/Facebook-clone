// import { Carousel } from '@giphy/react-components'
// import { GiphyFetch } from '@giphy/js-fetch-api'
// import { useState } from 'react'

// // use @giphy/js-fetch-api to fetch gifs, instantiate with your api key
// const giphyFetch = new GiphyFetch('n7rGgOGBzm20mrhxC9brUyA3LfCenkMH')

// // configure your fetch: fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
// // const fetchGifs = (offset) => gf.trending({ offset, limit: 6 })

// // Render the React Component and pass it your fetchGifs as a prop

// function CarouselDemo() {
//     const fetchGifs = (offset) =>
//         giphyFetch.search("dog", { offset, limit: 10 });
//     return <div>{<Carousel fetchGifs={fetchGifs} gifHeight={200} gutter={6} />}</div>;
// }

// function GiphyReactions() {

//     const [searchTerm, setSearchTerm] = useState(null);
//     const [showGif, setShowGif] = useState(false);
//     const fetchGifs = (offset) => giphyFetch.search("dog", { offset, limit: 10 });

//     return (
//         <div>
//             {/* <form onSubmit={handleSubmitGif}> */}
//             <input onChange={(e) => setSearchTerm(e.target.value)} />
//             <button className='gifButton' onClick={(e) => {
//                 e.preventDefault();
//                 setShowGif(true);
//             }}>Submit</button>
//             {/* </form> */}

//             <CarouselDemo></CarouselDemo>
//             {/* {
//                 <Carousel fetchGifs={fetchGifs} gifHeight={200} gutter={6} />
//             } */}
//         </div>
//     )
// }
// export default GiphyReactions