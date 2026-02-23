import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Paper, TextInput, PasswordInput, Button, Title, Text, Stack, Center, Box, LoadingOverlay, Alert } from '@mantine/core';
import { AlertCircle } from 'lucide-react';
import api from '../../api/axios';

export default function RegisterScreen() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ username: '', password: '' });

    useEffect(() => {
        if (!token) {
            setError("Brak tokenu rejestracyjnego. Poproś administratora o nowy link.");
            setLoading(false);
            return;
        }

        api.get(`/auth/verify-token/${token}`)
            .then(res => {
                setInvitation(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError("Link wygasł, został już zużyty lub jest nieprawidłowy.");
                setLoading(false);
            });
    }, [token]);

    const handleRegister = async () => {
        try {
            await api.post('/auth/register', { ...form, token });
            alert("Konto utworzone pomyślnie!");
            navigate('/login');
        } catch (e) {
            alert("Błąd podczas tworzenia konta. Może ten login jest już zajęty?");
        }
    };

    return (
        <Box h="100vh" bg="gray.1">
            <Center h="100%">
                <Paper withBorder p={40} radius="md" shadow="md" w={450} bg="white" style={{ position: 'relative' }}>
                    <LoadingOverlay visible={loading} />

                    <Title order={2} mb="xs">Rejestracja w OrzełKJ</Title>

                    {error ? (
                        <Stack>
                            <Alert icon={<AlertCircle size={16} />} title="Błąd" color="red">
                                {error}
                            </Alert>
                            <Button variant="outline" onClick={() => navigate('/login')}>Wróć do logowania</Button>
                        </Stack>
                    ) : (
                        <>
                            <Text size="sm" c="dimmed" mb="xl">
                                Rejestrujesz się jako: <b>{invitation?.email}</b> (Rola: {invitation?.role})
                            </Text>
                            <Stack>
                                <TextInput label="Wybierz Login" required value={form.username} onChange={(e)=>setForm({...form, username: e.target.value})} />
                                <PasswordInput label="Ustaw Hasło" required value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} />
                                <Button fullWidth size="md" mt="md" onClick={handleRegister}>Załóż konto i zaloguj</Button>
                            </Stack>
                        </>
                    )}
                </Paper>
            </Center>
        </Box>
    );
}