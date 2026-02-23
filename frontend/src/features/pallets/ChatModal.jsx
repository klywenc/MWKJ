// ChatModal.jsx
import { useState, useEffect, useRef } from 'react';
import { Modal, ScrollArea, TextInput, ActionIcon, Group, Stack, Text, Box, Divider, rem } from '@mantine/core';
import { Send } from 'lucide-react';
import api from '../../api/axios';

export default function ChatModal({ opened, onClose, pallet, user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const viewport = useRef(null);

  const fetchMessages = async () => {
    if (!pallet?.id) return;
    const res = await api.get(`/chat/${pallet.id}`);
    setMessages(res.data);
    setTimeout(() => viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' }), 100);
  };

  useEffect(() => { if (opened) fetchMessages(); }, [opened]);

  const handleSend = async () => {
    if (!text.trim()) return;
    await api.post(`/chat/${pallet.id}`, { senderName: user.username, text: text });
    setText('');
    fetchMessages();
  };

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      size="lg" 
      radius="md" 
      title={<Text fw={700} size="sm" c="wojcik-blue.8">Strumień Aktywności: {pallet?.palletNumber}</Text>} 
      padding="0"
      styles={{ content: { overflow: 'hidden' } }}
    >
      <Stack gap={0}>
        <Box p="md" bg="var(--mantine-color-slate-0)">
          <Text size="xs" fw={600} c="slate.6" tt="uppercase" mb={4}>Pierwotny Powód</Text>
          <Text size="sm" fw={500} c="slate.8">{pallet?.reason}</Text>
        </Box>
        <Divider />
        <ScrollArea h={400} p="md" viewportRef={viewport} type="auto">
          <Stack gap="lg">
            {messages.map((m) => (
              <Box key={m.id} style={{ borderLeft: `2px solid ${m.senderName === user.username ? 'var(--mantine-color-wojcik-blue-7)' : 'var(--mantine-color-slate-3)' }`, paddingLeft: rem(12), overflow: 'hidden' }}>
                <Group gap="xs" mb={4}>
                  <Text size="xs" fw={700} c="wojcik-blue.7">{m.senderName.toUpperCase()}</Text>
                  <Text size="xs" c="slate.5">{new Date(m.sentAt).toLocaleString()}</Text>
                </Group>
                <Text size="sm" c="slate.8" style={{ lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{m.text}</Text>
              </Box>
            ))}
          </Stack>
        </ScrollArea>
        <Box p="md" style={{ borderTop: '1px solid var(--mantine-color-slate-2)' }}>
          <Group gap="xs">
            <TextInput placeholder="Napisz komentarz..." style={{ flex: 1 }} radius="sm" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
            <ActionIcon size="lg" radius="sm" color="wojcik-blue.7" variant="filled" onClick={handleSend}><Send size={18} /></ActionIcon>
          </Group>
        </Box>
      </Stack>
    </Modal>
  );
}