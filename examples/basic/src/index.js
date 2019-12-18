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
  const usersRecord = useLoads('users', getUsers);
  const users = usersRecord.response || [];

  return (
    <ThemeProvider>
      <Container breakpoint="mobile" padding="major-1">
        <Heading fontSize="500">Users</Heading>
        {usersRecord.isPending && <Spinner />}
        {usersRecord.isResolved && (
          <List listStyleType="disc" listStylePosition="inside">
            {users.map(user => (
              <List.Item key={user.id}>{user.name}</List.Item>
            ))}
          </List>
        )}
        {usersRecord.isRejected && <Alert type="danger">Error! {usersRecord.error.message}</Alert>}
      </Container>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
