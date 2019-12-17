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
  const getUsersRecord = useLoads<Users, any>('users', getUsers);
  const users = (getUsersRecord.response || []);

  return (
    <ThemeProvider>
      <Container breakpoint="mobile" padding="major-1">
        <Heading fontSize="500">Users</Heading>
        {getUsersRecord.isPending && <Spinner />}
        {getUsersRecord.isResolved && (
          <List listStyleType="disc" listStylePosition="inside">
            {users.map(user => (
              <List.Item key={user.id}>{user.name}</List.Item>
            ))}
          </List>
        )}
        {getUsersRecord.isRejected && <Alert type="danger">Error! {getUsersRecord.error.message}</Alert>}
      </Container>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
