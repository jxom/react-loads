import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Container, Heading, List, Spinner, ThemeProvider } from 'fannypack';
import * as Loads from 'react-loads';

function UsersList() {
  const getUsers = React.useCallback(async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    return response.data;
  }, []);
  const getUsersLoader = Loads.useLoads(getUsers);
  const users = getUsersLoader.response || [];

  return (
    <List listStyleType="disc" listStylePosition="inside">
      {users.map(user => (
        <List.Item key={user.id}>{user.name}</List.Item>
      ))}
    </List>
  );
}

function App() {
  return (
    <Container breakpoint="mobile" padding="major-1">
      <Heading fontSize="500">Users</Heading>
      <React.Suspense fallback={<Spinner />}>
        <UsersList />
      </React.Suspense>
    </Container>
  );
}

ReactDOM.render(
  <Loads.Provider unstable_enableSuspense={true}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Loads.Provider>,
  document.getElementById('root')
);
