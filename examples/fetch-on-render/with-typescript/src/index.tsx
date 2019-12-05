import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Alert, Container, Heading, List, Spinner, ThemeProvider } from 'fannypack';
import { useLoads } from 'react-loads';

type Users = Array<{ id: string; name: string }>;

function App() {
  const getUsers = React.useCallback(async (): Promise<Users> => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    return response.data;
  }, []);
  const getUsersLoader = useLoads<Users, any>('users', getUsers);
  const users = (getUsersLoader.response || []);

  return (
    <ThemeProvider>
      <Container breakpoint="mobile" padding="major-1">
        <Heading fontSize="500">Users</Heading>
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
