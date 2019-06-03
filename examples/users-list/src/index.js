import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Button, Container, Group, Heading, LayoutSet, List, Input, Spinner, ThemeProvider } from 'fannypack';
import { LoadsContext, useLoads } from 'react-loads';

function App() {
  const [name, setName] = React.useState();

  const getUsers = React.useCallback(async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    return response.data;
  }, []);
  const getUsersLoader = useLoads(getUsers, {
    context: 'users'
  });
  const users = getUsersLoader.response;

  const addUser = React.useCallback(
    async ({ cachedRecord }) => {
      const response = await axios.post('https://jsonplaceholder.typicode.com/users', {
        data: { name }
      });
      setName('');
      const currentUsers = cachedRecord.response;
      const newUser = response.data.data;
      return [...currentUsers, newUser];
    },
    [name]
  );
  const addUserLoader = useLoads(addUser, {
    context: 'users',
    defer: true
  });

  const deleteUser = React.useCallback(async (user, { cachedRecord }) => {
    await axios.delete(`https://jsonplaceholder.typicode.com/users/${user.id}`);
    const currentUsers = cachedRecord.response;
    const newUsers = currentUsers.filter(_user => _user.id !== user.id);
    return newUsers;
  }, []);
  const deleteUserLoader = useLoads(deleteUser, {
    context: 'users',
    defer: true
  });

  return (
    <ThemeProvider>
      <Container breakpoint="mobile" padding="major-2">
        <Heading fontSize="500">Users</Heading>
        {getUsersLoader.isPending && <Spinner />}
        {getUsersLoader.isResolved && (
          <LayoutSet>
            <List listStyleType="disc" listStylePosition="inside">
              {users.map(user => (
                <List.Item key={user.id}>
                  {user.name}
                  <Button
                    isLoading={deleteUserLoader.isPending}
                    kind="ghost"
                    marginLeft="major-1"
                    onClick={() => deleteUserLoader.load(user)}
                    palette="danger"
                    size="small"
                  >
                    Delete
                  </Button>
                </List.Item>
              ))}
            </List>
            <Group width="300px">
              <Input placeholder="John Smith" onChange={e => setName(e.target.value)} value={name} />
              <Button isLoading={addUserLoader.isPending} onClick={addUserLoader.load} palette="primary">
                Add
              </Button>
            </Group>
          </LayoutSet>
        )}
      </Container>
    </ThemeProvider>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(
  <LoadsContext.Provider>
    <App />
  </LoadsContext.Provider>,
  rootElement
);
