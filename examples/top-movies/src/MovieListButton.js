import React from 'react';
import { Box, Card, Text, palette, styled } from 'fannypack';

const Button = styled(Card)`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  text-decoration: none;

  &:hover {
    background-color: ${palette('white600')};
  }
`;

export default function MovieListButton(props) {
  const { movie, isLoading, ...rest } = props;
  return (
    <Button key={movie.id} {...rest}>
      <Box lineHeight="1.2">
        <Text fontSize="300" fontWeight="semibold">
          {movie.title}
        </Text>
        <br />
        <Text fontSize="150">{movie.year}</Text>
      </Box>
      {isLoading ? 'loading...' : '>'}
    </Button>
  );
}
