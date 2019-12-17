import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Button, Container, Group, Heading, LayoutSet, List, Input, Spinner, ThemeProvider } from 'fannypack';
import * as Loads from 'react-loads';

async function getUsers() {
  const response = await axios.get('https://jsonplaceholder.typicode.com/users');
  return response.data;
}

function addUser({ name }) {
  return async meta => {
    const response = await axios.post('https://jsonplaceholder.typicode.com/users', {
      data: { name }
    });
    const currentUsers = meta.cachedRecord.response;
    const newUser = response.data.data;
    return [...currentUsers, newUser];
  };
}

function deleteUser(user) {
  return async meta => {
    await axios.delete(`https://jsonplaceholder.typicode.com/users/${user.id}`);
    const currentUsers = meta.cachedRecord.response;
    const newUsers = currentUsers.filter(_user => _user.id !== user.id);
    return newUsers;
  };
}

export const usersResource = Loads.createResource({
  context: 'users',
  load: getUsers,
  add: addUser,
  delete: deleteUser
});

function App() {
  const [name, setName] = React.useState();
  const [deletingUserId, setDeletingUserId] = React.useState();

  const getUsersRecord = usersResource.useLoads();
  const users = getUsersRecord.response;

  const addUserRecord = usersResource.add.useDeferredLoads();

  const deleteUserRecord = usersResource.delete.useDeferredLoads();

  async function handleAddUser() {
    await addUserRecord.load({ name });
    setName('');
  }

  async function handleDeleteUser(user) {
    setDeletingUserId(user.id);
    await deleteUserRecord.load(user);
    setDeletingUserId();
  }

  return (
    <ThemeProvider>
      <Container breakpoint="mobile" padding="major-2">
        <Heading fontSize="500">Users</Heading>
        {getUsersRecord.isPending && <Spinner />}
        {getUsersRecord.isResolved && (
          <LayoutSet>
            <List listStyleType="disc" listStylePosition="inside">
              {users.map(user => (
                <List.Item key={user.id}>
                  {user.name}
                  <Button
                    isLoading={deleteUserRecord.isReloading && deletingUserId === user.id}
                    kind="ghost"
                    marginLeft="major-1"
                    onClick={() => handleDeleteUser(user)}
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
              <Button isLoading={addUserRecord.isReloading} onClick={handleAddUser} palette="primary">
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
ReactDOM.render(<App />, rootElement);
