import { useState } from 'react';
import { Paper, TextInput, PasswordInput, Button, Title, Text, Stack, Box, Center, LoadingOverlay } from '@mantine/core';
import { PackageSearch } from 'lucide-react';
import api from '../../api/axios';

export default function LoginScreen({ onLogin }) {
    const [form, setForm] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', form);
            onLogin(res.data);
        } catch (e) {
            setError('Błędne dane logowania');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box h="100vh" bg="gray.1">
            <Center h="100%">
                <Paper withBorder shadow="md" p={40} radius="md" w={400}>
                    <LoadingOverlay visible={loading} />
                    <Stack align="center" mb={20}>
                        <Box bg="blue.6" p={10} style={{ borderRadius: 8 }}>
                            <PackageSearch size={32} color="white" />
                        </Box>
                        <Title order={2} c="blue.9">ORZEŁ KJ</Title>
                        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>System Zarządzania Jakością</Text>
                    </Stack>

                    {error && <Text color="red" size="sm" mb="sm" textAlign="center">{error}</Text>}

                    <Stack>
                        <TextInput
                            label="Użytkownik"
                            placeholder="Login"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                        />
                        <PasswordInput
                            label="Hasło"
                            placeholder="Hasło"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        />
                        <Button fullWidth mt="md" onClick={handleLogin}>Zaloguj się</Button>
                    </Stack>
                </Paper>
            </Center>
        </Box>
    );
}