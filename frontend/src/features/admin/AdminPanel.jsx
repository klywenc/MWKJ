import { useState, useEffect } from 'react';
import { Stack, TextInput, Select, Button, Title, Paper, Text, Group, Grid, Table, ActionIcon, Modal, Badge, rem, ScrollArea, Box, Divider } from '@mantine/core';
import { Trash, Edit, Plus, Users, MapPin, AlertTriangle, Search, ShieldCheck } from 'lucide-react';
import api from '../../api/axios';

export default function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [locations, setLocations] = useState([]);
    const [reasons, setReasons] = useState([]);
    
    const [editingUser, setEditingUser] = useState(null);
    const [qUser, setQUser] = useState('');

    const fetchData = async () => {
        const [u, l, r] = await Promise.all([api.get('/admin/users'), api.get('/admin/locations'), api.get('/admin/reasons')]);
        setUsers(u.data); setLocations(l.data); setReasons(r.data);
    };

    useEffect(() => { fetchData(); }, []);

    return (
      <Stack gap="xl">
        <Box px="xs">
          <Group gap="xs" mb={4}>
            <ShieldCheck size={18} color="var(--mantine-color-sap-blue-7)" />
            <Text size="xs" fw={800} c="slate.4" tt="uppercase" lts={rem(1)}>System Configuration</Text>
          </Group>
          <Title order={2} fw={900}>Panel Zarządzania Master Data</Title>
        </Box>

        {/* USERS TABLE */}
        <Paper radius="xs" withBorder p="0">
          <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-slate-2)' }}>
            <Group justify="space-between">
              <Text fw={800} size="sm" tt="uppercase">Zasoby ludzkie</Text>
              <TextInput placeholder="Filtruj użytkowników..." size="xs" w={250} leftSection={<Search size={14}/>} onChange={(e)=>setQUser(e.target.value)} />
            </Group>
          </Box>
          <Table verticalSpacing="xs" highlightOnHover>
            <Table.Thead bg="slate.0">
              <Table.Tr>
                <Table.Th>Użytkownik</Table.Th><Table.Th>Adres E-mail</Table.Th><Table.Th>Rola</Table.Th><Table.Th textAlign="right">Akcje</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users.filter(u => u.username.includes(qUser)).map(u => (
                <Table.Tr key={u.id}>
                  <Table.Td fw={700} size="sm">{u.username}</Table.Td>
                  <Table.Td size="sm">{u.email}</Table.Td>
                  <Table.Td><Badge radius="xs" variant="outline" size="sm">{u.role}</Badge></Table.Td>
                  <Table.Td textAlign="right">
                    <Group gap={4} justify="flex-end">
                      <ActionIcon variant="subtle" size="sm" onClick={() => setEditingUser(u)}><Edit size={14}/></ActionIcon>
                      <ActionIcon variant="subtle" color="red" size="sm"><Trash size={14}/></ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>

        <Grid gutter="md">
          {/* LOKALIZACJE */}
          <Grid.Col span={6}>
            <DictionaryCard title="Lokalizacje / Umiejscowienie" data={locations} onAdd={(v) => api.post('/admin/locations', {name: v}).then(fetchData)} onDelete={(id) => api.delete(`/admin/locations/${id}`).then(fetchData)} />
          </Grid.Col>
          {/* POWODY */}
          <Grid.Col span={6}>
            <DictionaryCard title="Słownik Powodów (Kategorie)" data={reasons} onAdd={(v) => api.post('/admin/reasons', {name: v}).then(fetchData)} onDelete={(id) => api.delete(`/admin/reasons/${id}`).then(fetchData)} />
          </Grid.Col>
        </Grid>

        <Modal opened={!!editingUser} onClose={() => setEditingUser(null)} title="Edycja użytkownika" radius="xs" centered>
            {/* ... Formularz edycji (skrócony dla przejrzystości) ... */}
            <Button fullWidth radius="xs" onClick={() => setEditingUser(null)}>Zapisz zmiany</Button>
        </Modal>
      </Stack>
    );
}

function DictionaryCard({ title, data, onAdd, onDelete }) {
  const [val, setVal] = useState('');
  return (
    <Paper radius="xs" withBorder>
      <Box p="xs" bg="slate.0" style={{ borderBottom: '1px solid var(--mantine-color-slate-2)' }}>
        <Text fw={800} size="10px" tt="uppercase">{title}</Text>
      </Box>
      <Box p="sm">
        <Group gap="xs" mb="sm">
          <TextInput placeholder="Dodaj nową pozycję..." size="xs" style={{flex: 1}} value={val} onChange={(e)=>setVal(e.target.value)} />
          <Button size="xs" radius="xs" onClick={() => { onAdd(val); setVal(''); }}><Plus size={14}/></Button>
        </Group>
        <ScrollArea h={150}>
          <Table size="xs">
            <Table.Tbody>
              {data.map(item => (
                <Table.Tr key={item.id}>
                  <Table.Td fw={500}>{item.name}</Table.Td>
                  <Table.Td w={30}><ActionIcon color="red" variant="subtle" size="xs" onClick={() => onDelete(item.id)}><Trash size={12}/></ActionIcon></Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Box>
    </Paper>
  );
}