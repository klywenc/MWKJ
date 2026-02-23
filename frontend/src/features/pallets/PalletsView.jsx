import React, { useState, useEffect } from 'react';
import { Title, Group, Button, Table, Paper, Stack, Text, Box, rem, TextInput, Select } from '@mantine/core';
import { Plus, RefreshCw, Filter, ListFilter } from 'lucide-react';
import api from '../../api/axios';
import PalletRow from './PalletRow';
import AddPalletModal from './AddPalletModal';

export default function PalletsView({ user }) {
  const [pallets, setPallets] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [search, setSearch] = useState('');

  const fetchPallets = async () => {
    try {
        const res = await api.get('/pallets');
        setPallets(res.data);
    } catch (e) {
        console.error("Błąd pobierania", e);
    }
  };

  useEffect(() => { fetchPallets(); }, []);

  const isAdminOrKJ = user?.role === 'Administrator' || user?.role === 'Kontroler' || user?.role === 0 || user?.role === 1;

  // Proste filtrowanie po stronie klienta dla demo
  const filteredPallets = pallets.filter(p => 
     p.palletNumber.toLowerCase().includes(search.toLowerCase()) || 
     p.orderNumber.toLowerCase().includes(search.toLowerCase())
  );

return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-end">
        <Box>
           <Text size="xs" fw={700} c="wojcik-red.8" tt="uppercase" lts={1} mb={4}>System Wewnętrzny</Text>
           <Title order={2} fw={800} c="slate.9" lts={-0.5}>Zatrzymane Jednostki</Title>
        </Box>
        
        {isAdminOrKJ && (
            <Button color="wojcik-red" leftSection={<Plus size={16}/>} onClick={() => setModalOpened(true)}>
              Zgłoś niezgodność
            </Button>
          )}
      </Group>

      <Paper radius="sm" withBorder shadow="none" bg="white" style={{ overflow: 'hidden' }}>
        {/* TOOLBAR */}
        <Box p="sm" bg="slate.0" style={{ borderBottom: '1px solid var(--mantine-color-slate-2)' }}>
          <Group justify="space-between">
            <Group gap="xs">
               <TextInput 
                  placeholder="Filtruj zgłoszenia..." 
                  leftSection={<Filter size={14}/>} 
                  size="xs" w={300} 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
               />
               <Select 
                  placeholder="Sortuj: Ostatnio zmienione" 
                  data={['Ostatnio zmienione', 'ID Rosnąco']} 
                  size="xs" w={200}
               />
            </Group>
            <Text size="xs" fw={600} c="slate.5">{filteredPallets.length} wyników</Text>
          </Group>
        </Box>

        {/* LISTA ZAMIAST TABELI */}
        <Box>
          {filteredPallets.map(p => (
            <PalletRow 
              key={p.id} 
              pallet={p} 
              user={user}
              expanded={expandedId === p.id} 
              onToggle={() => setExpandedId(expandedId === p.id ? null : p.id)} 
            />
          ))}
          
          {filteredPallets.length === 0 && (
            <Box py={40} ta="center">
              <Text c="dimmed" size="sm">Nie znaleziono żadnych zgłoszeń.</Text>
            </Box>
          )}
        </Box>
      </Paper>
      <AddPalletModal opened={modalOpened} onClose={() => setModalOpened(false)} onRefresh={fetchPallets} />
    </Stack>
  );
}