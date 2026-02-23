import { AppShell, Group, Text, NavLink, Stack, Box, ActionIcon, Divider, Avatar, useMantineColorScheme, useComputedColorScheme, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LayoutGrid, LogOut, ShieldCheck, History, Bell, Layers, Sun, Moon, Search, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export default function DashboardLayout({ user, onLogout }) {
  // Flagopened kontroluje czy pasek jest szeroki czy wąski
  const [opened, { toggle }] = useDisclosure(false); 
  const navigate = useNavigate();
  const location = useLocation();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');

  const isAdmin = user?.role === 'Administrator' || user?.role === 0;

  return (
    <AppShell
      navbar={{ 
        width: opened ? 240 : 70, // Dynamiczna szerokość
        breakpoint: 'sm' 
      }}
      padding="0"
    >
      <AppShell.Navbar p="md" bg="slate.9" style={{ border: 'none', transition: 'width 0.2s ease' }}>
        <Stack justify="space-between" h="100%">
          
          {/* GÓRA: LOGO I NAWIGACJA */}
          <Box>
            <Group mb={30} gap={12} wrap="nowrap" px={opened ? 'xs' : 4}>
              <Box 
                bg="wojcik-red.9" 
                w={38} h={38} 
                style={{ borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                <Layers size={22} color="white" strokeWidth={2.5} />
              </Box>
              {opened && (
                <Stack gap={0}>
                  <Text fw={900} size="sm" c="white" lts={-0.5} style={{ lineHeight: 1 }}>MEBLE WÓJCIK</Text>
                  <Text fw={700} size="9px" c="wojcik-red.4" tt="uppercase">Internal</Text>
                </Stack>
              )}
            </Group>

            <Stack gap={4}>
              <SideItem 
                icon={<LayoutGrid size={20}/>} 
                label="Tablica Zgłoszeń" 
                active={location.pathname === '/'} 
                onClick={() => navigate('/')} 
                expanded={opened} 
              />
              <SideItem 
                icon={<History size={20}/>} 
                label="Historia Zmian" 
                active={location.pathname === '/history'} 
                expanded={opened} 
              />
              {isAdmin && (
                <>
                  <Divider my="sm" opacity={0.1} label={opened ? "ADMIN" : null} labelPosition="center" />
                  <SideItem 
                    icon={<ShieldCheck size={20}/>} 
                    label="Zarządzanie" 
                    active={location.pathname === '/admin'} 
                    onClick={() => navigate('/admin')} 
                    expanded={opened} 
                  />
                </>
              )}
            </Stack>
          </Box>

          {/* DÓŁ: NARZĘDZIA I PRZEŁĄCZNIK */}
          <Stack gap="xs">
            <Divider opacity={0.1} mb="xs" />
            
            <SideItem icon={<Search size={20}/>} label="Szukaj" expanded={opened} />
            
            <SideItem 
                icon={computedColorScheme === 'light' ? <Moon size={20} /> : <Sun size={20} />} 
                label={computedColorScheme === 'light' ? "Tryb ciemny" : "Tryb jasny"}
                onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                expanded={opened} 
            />

            <SideItem icon={<Bell size={20}/>} label="Powiadomienia" expanded={opened} />

            <Group gap="sm" px={opened ? 'xs' : 4} py={10} wrap="nowrap">
                <Avatar size="sm" radius="md" color="wojcik-red.9">{user?.username?.charAt(0)}</Avatar>
                {opened && (
                    <Box style={{ flex: 1, overflow: 'hidden' }}>
                        <Text size="xs" fw={700} c="white" truncate>{user?.username}</Text>
                        <Text size="10px" c="slate.5" truncate>{user?.role || 'Użytkownik'}</Text>
                    </Box>
                )}
                <ActionIcon variant="subtle" color="red.5" onClick={onLogout}>
                    <LogOut size={16} />
                </ActionIcon>
            </Group>

            {/* PRZYCISK ROZWIJANIA/ZWIJANIA */}
            <ActionIcon 
              variant="subtle" 
              color="slate.5" 
              onClick={toggle} 
              size="lg" 
              w="100%" 
              mt="xs"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              {opened ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </ActionIcon>
          </Stack>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main bg={computedColorScheme === 'light' ? '#f1f5f9' : 'dark.8'}>
        <Box p="xl">
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}

// Uniwersalny komponent dla elementów menu (obsługuje ikonę + tekst)
function SideItem({ icon, label, active, onClick, expanded }) {
  const content = (
    <NavLink
      label={expanded ? label : null}
      leftSection={icon}
      active={active}
      onClick={onClick}
      styles={{
        root: {
          color: active ? 'white' : '#94a3b8',
          height: '42px',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          backgroundColor: active ? 'var(--mantine-color-wojcik-blue-7)' : 'transparent',
          '&:hover': { backgroundColor: active ? undefined : 'rgba(255,255,255,0.05)', color: 'white' }
        },
        label: { fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }
      }}
    />
  );

  if (expanded) return content;

  return (
    <Tooltip label={label} position="right" withArrow>
      {content}
    </Tooltip>
  );
}