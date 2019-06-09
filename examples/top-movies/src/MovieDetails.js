import React from 'react';
import {
  Box,
  Blockquote,
  Button,
  Columns,
  Column,
  Flex,
  Heading,
  Image,
  Label,
  LayoutSet,
  Rating,
  Spinner,
  Text
} from 'fannypack';
import * as Loads from 'react-loads';

import * as api from './api';
import { movieResource, movieReviewsResource } from './resources';

// export default function MovieDetails(props) {
//   const { movieId, onClickBack } = props;

//   const getMoviesLoader = movieResource.useLoads({ defaultParams: [movieId], accessKey: movieId });
//   const movie = getMoviesLoader.response || {};

//   const getReviewsLoader = movieReviewsResource.useLoads({ defaultParams: [movieId], accessKey: movieId });
//   const reviews = getReviewsLoader.response || [];

//   return (
//     <LayoutSet>
//       <Button onClick={onClickBack}>Back</Button>
//       {getMoviesLoader.isPending && <Spinner />}
//       {getMoviesLoader.isResolved && (
//         <LayoutSet>
//           <Box>
//             <Flex alignItems="center" justifyContent="space-between">
//               <Heading marginBottom="0">{movie.title}</Heading>
//               <Rating defaultRating={parseFloat(movie.imdbRating) / 2} />
//             </Flex>
//             <Text fontSize="300">
//               {movie.year} | Rated {movie.rated} | {movie.runtime}
//             </Text>
//           </Box>
//           <Columns>
//             <Column spreadMobile={6}>
//               <LayoutSet spacing="major-2">
//                 <Box>
//                   <Text>{movie.plot}</Text>
//                 </Box>
//                 <Box fontSize="150">
//                   <Label>Genre</Label>
//                   <Text>{movie.genre}</Text>
//                 </Box>
//                 <Box fontSize="150">
//                   <Label>Actors</Label>
//                   <Text>{movie.actors}</Text>
//                 </Box>
//               </LayoutSet>
//             </Column>
//             <Column spreadMobile={6}>
//               <Image src={movie.poster} />
//             </Column>
//           </Columns>
//           <Box>
//             <Heading use="h2">Reviews</Heading>
//             {getReviewsLoader.isPending && <Spinner />}
//             {getReviewsLoader.isResolved && (
//               <LayoutSet spacing="major-2">
//                 {reviews.length === 0 && <Box>No reviews.</Box>}
//                 {reviews.length > 0 &&
//                   reviews.map(review => (
//                     <Box>
//                       <Blockquote>
//                         <Rating defaultRating={review.rating / 2} />
//                         {review.comment}
//                         <br />
//                         <Text fontSize="100" fontWeight="semibold" textTransform="uppercase">
//                           {review.reviewer}
//                         </Text>
//                       </Blockquote>
//                     </Box>
//                   ))}
//               </LayoutSet>
//             )}
//           </Box>
//         </LayoutSet>
//       )}
//     </LayoutSet>
//   );
// }

export default function MovieDetails(props) {
  const { movieId, onClickBack } = props;

  const movie = movieResource.unstable_load({ accessKey: movieId, params: [movieId] });
  const reviews = movieReviewsResource.unstable_load({ accessKey: movieId, params: [movieId] });

  return (
    <LayoutSet>
      <Button onClick={onClickBack}>Back</Button>
      <LayoutSet>
        <Box>
          <Flex alignItems="center" justifyContent="space-between">
            <Heading marginBottom="0">{movie.title}</Heading>
            <Rating defaultRating={parseFloat(movie.imdbRating) / 2} />
          </Flex>
          <Text fontSize="300">
            {movie.year} | Rated {movie.rated} | {movie.runtime}
          </Text>
        </Box>
        <Columns>
          <Column spreadMobile={6}>
            <LayoutSet spacing="major-2">
              <Box>
                <Text>{movie.plot}</Text>
              </Box>
              <Box fontSize="150">
                <Label>Genre</Label>
                <Text>{movie.genre}</Text>
              </Box>
              <Box fontSize="150">
                <Label>Actors</Label>
                <Text>{movie.actors}</Text>
              </Box>
            </LayoutSet>
          </Column>
          <Column spreadMobile={6}>
            <Image src={movie.poster} />
          </Column>
        </Columns>
        <Box>
          <Heading use="h2">Reviews</Heading>
          <LayoutSet spacing="major-2">
            {reviews.length === 0 && <Box>No reviews.</Box>}
            {reviews.length > 0 &&
              reviews.map(review => (
                <Box>
                  <Blockquote>
                    <Rating defaultRating={review.rating / 2} />
                    {review.comment}
                    <br />
                    <Text fontSize="100" fontWeight="semibold" textTransform="uppercase">
                      {review.reviewer}
                    </Text>
                  </Blockquote>
                </Box>
              ))}
          </LayoutSet>
        </Box>
      </LayoutSet>
    </LayoutSet>
  );
}
