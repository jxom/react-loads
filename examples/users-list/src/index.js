import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Button, Container, Group, Heading, LayoutSet, List, Input, Spinner, ThemeProvider } from 'fannypack';
import * as Loads from 'react-loads';

async function getUsers() {
  const response = await axios.get('https://jsonplaceholder.typicode.com/users');
  return response.data;
}

async function addUser({ name }, { cachedRecord }) {
  const response = await axios.post('https://jsonplaceholder.typicode.com/users', {
    data: { name }
  });
  const currentUsers = cachedRecord.response;
  const newUser = response.data.data;
  return [...currentUsers, newUser];
}

async function deleteUser(user, { cachedRecord }) {
  await axios.delete(`https://jsonplaceholder.typicode.com/users/${user.id}`);
  const currentUsers = cachedRecord.response;
  const newUsers = currentUsers.filter(_user => _user.id !== user.id);
  return newUsers;
}

export const usersResource = Loads.createResource({
  _namespace: 'users',
  load: getUsers,
  add: [addUser, { defer: true }],
  delete: [deleteUser, { defer: true }]
});

function App() {
  const [name, setName] = React.useState();
  const [deletingUserId, setDeletingUserId] = React.useState();

  const getUsersLoader = usersResource.useLoads();
  const users = getUsersLoader.response;

  const addUserLoader = usersResource.add.useLoads();

  const deleteUserLoader = usersResource.delete.useLoads();

  async function handleAddUser() {
    await addUserLoader.load({ name });
    setName('');
  }

  async function handleDeleteUser(user) {
    setDeletingUserId(user.id);
    await deleteUserLoader.load(user);
    setDeletingUserId();
  }

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
                    isLoading={deleteUserLoader.isPending && deletingUserId === user.id}
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
              <Button isLoading={addUserLoader.isPending} onClick={handleAddUser} palette="primary">
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
  <Loads.Provider>
    <App />
  </Loads.Provider>,
  rootElement
);
