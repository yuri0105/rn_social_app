// export default fetchSearch = () =>{
//  try {
//         const API_KEY = 'ib4HezAg3QBRYWs1hKmc2k755scIKNmx';
//         const BASE_URL = 'http://api.giphy.com/v1/gifs/search';
//         const resJson = await fetch(`${BASE_URL}?api_key=${API_KEY}&q=${term}`);
//         const res = await resJson.json();
//         setGifs(res.data);
//       //   console.log('res data->', res.data);
//       } catch (error) {
//         console.warn(error);
//       }
// }

export const fetchGifs = async(setGifs) =>    {
    try{
        const API_KEY = 'ib4HezAg3QBRYWs1hKmc2k755scIKNmx';
        const BASE_URL = 'http://api.giphy.com/v1/gifs/trending';
        const resJson = await fetch(`${BASE_URL}?api_key=${API_KEY}&limit=20`);
        const res = await resJson.json();
        setGifs(res.data);
    }catch (error) {
        console.warn(error);
    }
}

export const fetchSearch =  async(setGifs,term) =>{
    try {
        const API_KEY = 'ib4HezAg3QBRYWs1hKmc2k755scIKNmx';
        const BASE_URL = 'http://api.giphy.com/v1/gifs/search';
        const resJson = await fetch(`${BASE_URL}?api_key=${API_KEY}&q=${term}`);
        const res = await resJson.json();
        setGifs(res.data);
      //   console.log('res data->', res.data);
      } catch (error) {
        console.warn(error);
      }
}


export const gifEmoji = [
    {
        id: 1,
        url : "https://media2.giphy.com/media/lRXY41yFFi9RfNXyPN/giphy.gif",
        name: "Love"
    },
    {
        id: 2,
        url : "https://media4.giphy.com/media/J2awouDsf23R2vo2p5/giphy.gif",
        name: "Hot"
    },
    {
        id: 3,
        url : "https://media3.giphy.com/media/hVlZnRT6QW1DeYj6We/giphy.gif",
        name: "Funny"
    },
    {
        id: 4,
        url : "https://media4.giphy.com/media/QTlmH8hEoVoi83mdJC/giphy.gif",
        name: "Angel"
    },
    {
        id: 5,
        url : 'https://media0.giphy.com/media/4tSHBpzJw7R3rrKUeo/giphy.gif',
        name: "Peace"
    },
    {
        id: 6,
        url: 'https://media0.giphy.com/media/fSM1fAZJOixky6npXS/giphy.gif',
        name: 'Crazy'
    },
     
]

 export const list = [
    {
        id: 0,
        title: 'Tech'
    },
    {
        id: 1,
        title: 'Fashions'
    },
    {
        id: 2,
        title: 'Facts'
    },
    {
        id: 3,
        title: 'Automobile'
    },
    {
        id: 4,
        title: 'Travel'
    },
    {
        id: 5,
        title: ' Food'
    },
    {
        id: 6,
        title: 'Politics'
    },
    {
        id: 7,
        title: 'Business'
    },
    {
        id: 8,
        title: 'Sports'
    },
    {
        id: 9,
        title: 'Movies'
    },
    {
        id: 10,
        title: 'Lifestyle'
    }
];