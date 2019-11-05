import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Alert, Container, Heading, List, Spinner, ThemeProvider } from 'fannypack';
import { useLoads } from 'react-loads';

function App() {
  const getUsers = React.useCallback(async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    return response.data;
  }, []);
  const getUsersLoader = useLoads(getUsers);
  const users = getUsersLoader.response;

  return (
    <ThemeProvider>
      <Container breakpoint="mobile" padding="major-1">
        <Heading fontSize="500">Users</Heading>
        <button onClick={getUsersLoader.load}>Load</button>
        {getUsersLoader.isPending && <Spinner />}
        {getUsersLoader.isResolved && (
          <List listStyleType="disc" listStylePosition="inside">
            {users.map(user => (
              <List.Item key={user.id}>{user.name}</List.Item>
            ))}
          </List>
        )}
        {getUsersLoader.isRejected && <Alert type="danger">Error! {getUsersLoader.error.message}</Alert>}
      </Container>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
