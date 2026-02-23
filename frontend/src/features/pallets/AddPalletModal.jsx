import { useState, useEffect } from 'react';
import { Modal, Button, TextInput, Stack, Grid, Select, Textarea } from '@mantine/core';
import api from '../../api/axios';

export default function AddPalletModal({ opened, onClose, onRefresh }) {
    const [locations, setLocations] = useState([]);
    const [reasons, setReasons] = useState([]);
    const [form, setForm] = useState({
        palletNumber: '', orderNumber: '', locationId: '', category: '', reason: '',
        operator: '', positionNumber: '', packageNumber: '', finishedGoodNumber: ''
    });

    useEffect(() => {
        if (opened) {
            api.get('/admin/locations').then(res => setLocations(res.data.map(l => ({ value: String(l.id), label: l.name }))));
            api.get('/admin/reasons').then(res => setReasons(res.data.map(r => r.name)));
        }
    }, [opened]);

    const handleSave = async () => {
        const locName = locations.find(l => l.value === form.locationId)?.label || '';
        await api.post('/pallets', { ...form, locationId: parseInt(form.locationId), locationName: locName });
        onRefresh();
        onClose();
        setForm({ palletNumber: '', orderNumber: '', locationId: '', category: '', reason: '', operator: '', positionNumber: '', packageNumber: '', finishedGoodNumber: '' });
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Zatrzymaj nową jednostkę" size="lg">
            <Stack>
                <Grid>
                    <Grid.Col span={6}><TextInput label="ID Jednostki" required onChange={(e)=>setForm({...form, palletNumber: e.target.value})} /></Grid.Col>
                    <Grid.Col span={6}><TextInput label="Zlecenie" onChange={(e)=>setForm({...form, orderNumber: e.target.value})} /></Grid.Col>
                    <Grid.Col span={6}><Select label="Umiejscowienie" data={locations} onChange={(v)=>setForm({...form, locationId: v})} /></Grid.Col>
                    <Grid.Col span={6}><Select label="Kategoria błędu" data={reasons} onChange={(v)=>setForm({...form, category: v})} /></Grid.Col>
                </Grid>
                <Textarea label="Dodatkowy opis" placeholder="Szczegóły niezgodności..." onChange={(e)=>setForm({...form, reason: e.target.value})} />
                <Button color="red" fullWidth onClick={handleSave}>Zatrzymaj paletę</Button>
            </Stack>
        </Modal>
    );
}