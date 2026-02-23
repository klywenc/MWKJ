import React, { useState } from 'react';
import { Badge, Text, Collapse, Box, Group, Stack, ActionIcon, Button, Divider } from '@mantine/core';
import { MessageSquare, ChevronRight, ChevronDown, Star } from 'lucide-react';
import ChatModal from './ChatModal';

export default function PalletRow({ pallet, expanded, onToggle, user }) {
  const [chatOpened, setChatOpened] = useState(false);
  const isOk = pallet.status === 'OK';

  return (
    <Box 
      style={{ 
        borderBottom: '1px solid var(--mantine-color-slate-1)',
        backgroundColor: expanded ? 'var(--mantine-color-blue-0)' : 'transparent',
        transition: 'background-color 0.15s ease'
      }}
    >
      <Group wrap="nowrap" py={12} px="md" gap="sm" align="flex-start" onClick={onToggle} style={{ cursor: 'pointer' }}>
        <Star size={14} color={expanded ? "#fab005" : "#dee2e6"} fill={expanded ? "#fab005" : "none"} style={{ marginTop: 4 }} />
        
        <Stack gap={2} style={{ flex: 1 }}>
          <Group gap="xs">
            <Badge color={isOk ? 'yt-green.6' : 'wojcik-red.9'} variant="filled" size="sm" radius="sm">
              {pallet.palletNumber}
            </Badge>
            <Text size="sm" fw={600} c="wojcik-blue.9">{pallet.reason || 'Brak opisu zgłoszenia'}</Text>
          </Group>
          
          <Group gap="xl">
            <MetaItem label="Zlecenie" value={pallet.orderNumber} />
            <MetaItem label="Kategoria" value={pallet.category} />
            <MetaItem label="Lokalizacja" value={pallet.locationName} />
            <MetaItem label="Status" value={pallet.status} color={isOk ? 'green.7' : 'red.8'} />
          </Group>
        </Stack>

        <Group gap="lg">
          <Stack gap={0} align="flex-end">
            <Text size="xs" fw={700} c="slate.6">{pallet.operator}</Text>
            <Text size="10px" c="slate.4">18.02.2026</Text>
          </Stack>
          <ActionIcon variant="transparent" c="slate.3">
            {expanded ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
          </ActionIcon>
        </Group>
      </Group>

      <Collapse in={expanded}>
        <Box px={50} pb="md">
          <Divider mb="sm" variant="dashed" />
          <Group justify="space-between">
            <Box>
               <Text size="10px" fw={800} c="slate.4" tt="uppercase" mb={4}>Dane Techniczne</Text>
               <Text size="sm">Pozycja: <b>{pallet.positionNumber || '—'}</b> | Paczka: <b>{pallet.packageNumber || '—'}</b></Text>
            </Box>
            <Button 
              variant="light" 
              color="wojcik-blue" 
              size="xs" 
              leftSection={<MessageSquare size={14}/>}
              onClick={(e) => { e.stopPropagation(); setChatOpened(true); }}
            >
              Komentarze ({pallet.commentCount || 0})
            </Button>
          </Group>
        </Box>
      </Collapse>
      <ChatModal opened={chatOpened} onClose={() => setChatOpened(false)} pallet={pallet} user={user} />
    </Box>
  );
}

function MetaItem({ label, value, color }) {
  return (
    <Group gap={4}>
      <Text size="11px" c="slate.4">{label}:</Text>
      <Text size="11px" fw={700} c={color || "slate.6"}>{value}</Text>
    </Group>
  );
}