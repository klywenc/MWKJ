import { useState, useEffect } from 'react';
import { Paper, Title, TextInput, Button, Group, Table, ActionIcon, Stack, Text } from '@mantine/core';
import { Trash, MapPin, Plus } from 'lucide-react';
import api from '../../api/axios';

export default function LocationManager() {
    const [locations, setLocations] = useState([]);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchLocations = async () => {
        const res = await api.get('/admin/locations');
        setLocations(res.data);
    };

    useEffect(() => { fetchLocations(); }, []);

    const handleAdd = async () => {
        if (!newName) return;
        setLoading(true);
        try {
            await api.post('/admin/locations', { name: newName });
            setNewName('');
            fetchLocations();
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Czy na pewno usunąć tę lokalizację?")) {
            await api.delete(`/admin/locations/${id}`);
            fetchLocations();
        }
    };

    return (
        <Paper withBorder p="xl" radius="md" shadow="none">
            <Stack gap="md">
                <Group>
                    <MapPin size={20} color="#005eb8" />
                    <Title order={4}>Zarządzanie Umiejscowieniem</Title>
                </Group>

                <Text size="xs" c="dimmed">
                    Dodaj lokalizacje (np. Hala A, Linia 01, Magazyn), które będą dostępne w formularzu zatrzymania.
                </Text>

                <Group align="flex-end">
                    <TextInput
                        label="Nazwa lokalizacji"
                        placeholder="np. Linia Produkcyjna 05"
                        style={{ flex: 1 }}
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    />
                    <Button onClick={handleAdd} loading={loading} leftSection={<Plus size={16}/>}>
                        Dodaj
                    </Button>
                </Group>

                <Table verticalSpacing="sm" mt="md" withTableBorder>
                    <Table.Thead bg="gray.0">
                        <Table.Tr>
                            <Table.Th>Nazwa Umiejscowienia</Table.Th>
                            <Table.Th w={80} textAlign="right">Akcja</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {locations.map((loc) => (
                            <Table.Tr key={loc.id}>
                                <Table.Td fw={500}>{loc.name}</Table.Td>
                                <Table.Td>
                                    <Group justify="flex-end">
                                        <ActionIcon color="red" variant="subtle" onClick={() => handleDelete(loc.id)}>
                                            <Trash size={16} />
                                        </ActionIcon>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                        {locations.length === 0 && (
                            <Table.Tr>
                                <Table.Td colSpan={2} textAlign="center" py="xl" c="dimmed">
                                    Brak zdefiniowanych lokalizacji
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </Stack>
        </Paper>
    );
}