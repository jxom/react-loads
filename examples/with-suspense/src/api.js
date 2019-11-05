const movies = [
  {
    id: 1,
    title: 'Movie 43',
    year: '2013',
    rated: 'R',
    released: '25 Jan 2013',
    runtime: '94 min',
    genre: 'Comedy, Horror, Thriller',
    director:
      'Elizabeth Banks, Steven Brill, Steve Carr, Rusty Cundieff, James Duffy, Griffin Dunne, Peter Farrelly, Patrik Forsberg, Will Graham, James Gunn, Brett Ratner, Jonathan van Tulleken, Bob Odenkirk',
    writer:
      "Rocky Russo, Jeremy Sosenko, Ricky Blitt, Rocky Russo (screenplay), Jeremy Sosenko (screenplay), Bill O'Malley (story), Will Graham, Jack Kukoda, Rocky Russo, Jeremy Sosenko, Matt Portenoy, Rocky Russo (screenplay), Jeremy Sosenko (screenplay), Claes Kjellstrom (story), Jonas Wittenmark (story), Tobias Carlson (story), Will Carlough, Jonathan van Tulleken, Elizabeth Shapiro, Patrik Forsberg, Olle Sarri, Jacob Fleisher, Greg Pritikin, Rocky Russo, Jeremy Sosenko, James Gunn",
    actors: 'Dennis Quaid, Greg Kinnear, Common, Charlie Saxton',
    plot:
      'A series of interconnected short films follows a washed-up producer as he pitches insane story lines featuring some of the biggest stars in Hollywood.',
    language: 'English',
    country: 'USA',
    awards: '4 wins & 5 nominations.',
    poster: 'https://m.media-amazon.com/images/M/MV5BMTg4NzQ3NDM1Nl5BMl5BanBnXkFtZTcwNjEzMjM3OA@@._V1_SX300.jpg',
    ratings: [
      {
        Source: 'Internet Movie Database',
        Value: '4.3/10'
      },
      {
        Source: 'Rotten Tomatoes',
        Value: '5%'
      },
      {
        Source: 'Metacritic',
        Value: '18/100'
      }
    ],
    metascore: '18',
    imdbRating: '4.3',
    imdbVotes: '92,291',
    imdbID: 'tt1333125',
    type: 'movie',
    dvd: '18 Jun 2013',
    boxOffice: '$8,700,000',
    production: 'Relativity Media',
    website: 'http://www.facebook.com/WhatIsMovie43'
  },
  {
    id: 2,
    title: 'Scary Movie',
    year: '2000',
    rated: 'R',
    released: '07 Jul 2000',
    runtime: '88 min',
    genre: 'Comedy',
    director: 'Keenen Ivory Wayans',
    writer: 'Shawn Wayans, Marlon Wayans, Buddy Johnson, Phil Beauman, Jason Friedberg, Aaron Seltzer',
    actors: 'Carmen Electra, Dave Sheridan, Frank B. Moore, Giacomo Baessato',
    plot:
      'A year after disposing of the body of a man they accidentally killed, a group of dumb teenagers are stalked by a bumbling serial killer.',
    language: 'English',
    country: 'USA',
    awards: '7 wins & 5 nominations.',
    poster:
      'https://m.media-amazon.com/images/M/MV5BMGEzZjdjMGQtZmYzZC00N2I4LThiY2QtNWY5ZmQ3M2ExZmM4XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    ratings: [
      {
        Source: 'Internet Movie Database',
        Value: '6.2/10'
      },
      {
        Source: 'Rotten Tomatoes',
        Value: '53%'
      },
      {
        Source: 'Metacritic',
        Value: '48/100'
      }
    ],
    metascore: '48',
    imdbRating: '6.2',
    imdbVotes: '213,907',
    imdbID: 'tt0175142',
    type: 'movie',
    dvd: '12 Dec 2000',
    boxOffice: 'N/A',
    production: 'Dimension Films',
    website: 'http://www.scarymovie.com'
  },
  {
    id: 3,
    title: 'Jackass 3D',
    year: '2010',
    rated: 'R',
    released: '15 Oct 2010',
    runtime: '94 min',
    genre: 'Documentary, Action, Comedy',
    director: 'Jeff Tremaine',
    writer:
      "Jeff Tremaine (concepts by), Johnny Knoxville (concepts by), Bam Margera (concepts by), Steve-O (concepts by), Chris Pontius (concepts by), Ryan Dunn (concepts by), Jason 'Wee Man' Acuña (concepts by), Preston Lacy (concepts by), Ehren McGhehey (concepts by), Dave England (concepts by), Spike Jonze (concepts by), Loomis Fall (concepts by), Barry Owen Smoler (concepts by), The Dudesons (concepts by), Dave Carnie (concepts by), Mike Kassak (concepts by), Madison Clapp (concepts by), Knate Lee (concepts by), Derek Freda (concepts by), Trip Taylor (concepts by), Sean Cliver (concepts by), Dimitry Elyashkevich (concepts by), J.P. Blackmon (concepts by), Rick Kosick (concepts by), Harrison Stone",
    actors: 'Johnny Knoxville, Bam Margera, Ryan Dunn, Steve-O',
    plot:
      'Johnny Knoxville and company return for the third installment of their TV show spin-off, where dangerous stunts and explicit public displays rule.',
    language: 'English',
    country: 'USA',
    awards: '1 win & 4 nominations.',
    poster: 'https://m.media-amazon.com/images/M/MV5BMjI3NTQ1NTE4OV5BMl5BanBnXkFtZTcwMzEzMzA3NA@@._V1_SX300.jpg',
    ratings: [
      {
        Source: 'Internet Movie Database',
        Value: '7.0/10'
      },
      {
        Source: 'Rotten Tomatoes',
        Value: '65%'
      },
      {
        Source: 'Metacritic',
        Value: '56/100'
      }
    ],
    metascore: '56',
    imdbRating: '7.0',
    imdbVotes: '53,134',
    imdbID: 'tt1116184',
    type: 'movie',
    dvd: '08 Mar 2011',
    boxOffice: '$117,222,007',
    production: 'Paramount Pictures/MTV Films',
    website: 'http://www.jackassmovie.com/'
  },
  {
    id: 4,
    title: 'Titanic',
    year: '1997',
    rated: 'PG-13',
    released: '19 Dec 1997',
    runtime: '194 min',
    genre: 'Drama, Romance',
    director: 'James Cameron',
    writer: 'James Cameron',
    actors: 'Leonardo DiCaprio, Kate Winslet, Billy Zane, Kathy Bates',
    plot:
      'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
    language: 'English, Swedish, Italian',
    country: 'USA',
    awards: 'Won 11 Oscars. Another 111 wins & 77 nominations.',
    poster:
      'https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg',
    ratings: [
      {
        Source: 'Internet Movie Database',
        Value: '7.8/10'
      },
      {
        Source: 'Rotten Tomatoes',
        Value: '89%'
      },
      {
        Source: 'Metacritic',
        Value: '75/100'
      }
    ],
    metascore: '75',
    imdbRating: '7.8',
    imdbVotes: '951,902',
    imdbID: 'tt0120338',
    type: 'movie',
    dvd: '10 Sep 2012',
    boxOffice: 'N/A',
    production: 'Paramount Pictures',
    website: 'http://www.titanicmovie.com/'
  }
];

const reviews = [
  {
    id: 1,
    movieId: 1,
    comment: 'Absolutely terrible, why would anyone watch this piece of junk?',
    reviewer: 'Dan Wheeler',
    rating: 3
  },
  {
    id: 2,
    movieId: 1,
    comment: 'I like the idea of this movie. It is inspiring.',
    reviewer: 'Michael Abramov',
    rating: 5
  },
  {
    id: 3,
    movieId: 2,
    comment: 'I feel like you need to take some sort of drug before you see this movie.',
    reviewer: 'Tom Trombone',
    rating: 4
  },
  {
    id: 4,
    movieId: 3,
    comment: 'This is awesome.',
    reviewer: 'Paul Plots',
    rating: 9
  }
];

export async function getMovies() {
  console.log('fetchMovies');
  return new Promise(res => setTimeout(() => res(movies), 1000));
}

export async function getMovie(movieId) {
  console.log('fetchMovie');
  const movie = movies.find(movie => movie.id === movieId);
  return new Promise(res => setTimeout(() => res(movie), 1000));
}

export async function getReviewsByMovieId(movieId) {
  const movieReviews = reviews.filter(review => review.movieId === movieId);
  return new Promise(res => setTimeout(() => res(movieReviews), 2000));
}
