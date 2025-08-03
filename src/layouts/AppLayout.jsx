import { AppShell, Title, Group, ActionIcon } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import useAppStore from '../store/useAppStore';

const AppLayout = ({ children }) => {
  const { darkMode, toggleDarkMode } = useAppStore();

  return (
    <AppShell
      header={{ height: 70 }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title order={2} c="blue">
            Tivix Performance Tracker
          </Title>
          <ActionIcon
            variant="outline"
            size="lg"
            onClick={toggleDarkMode}
            title={darkMode ? 'Modo Claro' : 'Modo Escuro'}
          >
            {darkMode ? <IconSun size={18} /> : <IconMoon size={18} />}
          </ActionIcon>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
};

export default AppLayout;

