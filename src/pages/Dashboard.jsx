import { Container, Title, Grid, Card, Text, Badge, Button, Group, ActionIcon, Modal, TextInput, Select, Tabs, Menu, ColorInput } from '@mantine/core';
import { IconPlus, IconUser, IconFileReport, IconTrendingUp, IconArchive, IconRestore, IconDots, IconUsers } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import useAppStore from '../store/useAppStore';
import { createDeveloper, createTeam } from '../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [teamModalOpened, { open: openTeamModal, close: closeTeamModal }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState('active');
  const { developers, archivedDevelopers, teams, addDeveloper, addTeam, archiveDeveloper, restoreDeveloper, updateDeveloper } = useAppStore();

  const form = useForm({
    initialValues: {
      name: '',
      role: '',
      teamId: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Nome deve ter pelo menos 2 caracteres' : null),
      role: (value) => (value.length < 2 ? 'Cargo deve ter pelo menos 2 caracteres' : null),
    },
  });

  const teamForm = useForm({
    initialValues: {
      name: '',
      description: '',
      color: 'blue',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Nome do time deve ter pelo menos 2 caracteres' : null),
    },
  });

  const handleAddDeveloper = (values) => {
    const newDeveloper = createDeveloper(
      Date.now().toString(),
      values.name,
      values.role,
      0,
      values.teamId || null
    );
    
    addDeveloper(newDeveloper);
    notifications.show({
      title: 'Sucesso',
      message: 'Desenvolvedor adicionado com sucesso!',
      color: 'green',
    });
    
    form.reset();
    close();
  };

  const handleAddTeam = (values) => {
    const newTeam = createTeam(
      Date.now().toString(),
      values.name,
      values.description,
      values.color
    );
    
    addTeam(newTeam);
    notifications.show({
      title: 'Sucesso',
      message: 'Time criado com sucesso!',
      color: 'green',
    });
    
    teamForm.reset();
    closeTeamModal();
  };

  const handleArchiveDeveloper = (id, name) => {
    archiveDeveloper(id);
    notifications.show({
      title: 'Desenvolvedor Arquivado',
      message: `${name} foi movido para a aba de arquivados.`,
      color: 'blue',
    });
  };

  const handleRestoreDeveloper = (id, name) => {
    restoreDeveloper(id);
    notifications.show({
      title: 'Desenvolvedor Restaurado',
      message: `${name} foi restaurado para a equipe ativa.`,
      color: 'green',
    });
  };

  const getPerformanceColor = (score) => {
    if (score >= 8) return 'green';
    if (score >= 6) return 'yellow';
    if (score >= 4) return 'orange';
    return 'red';
  };

  const getPerformanceLabel = (score) => {
    if (score >= 8) return 'Excelente';
    if (score >= 6) return 'Bom';
    if (score >= 4) return 'Regular';
    return 'Precisa Melhorar';
  };

  const DeveloperCard = ({ developer, isArchived = false }) => {
    const developerTeam = teams.find(team => team.id === developer.teamId);
    
    return (
      <Grid.Col key={developer.id} span={{ base: 12, sm: 6, md: 4 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
          <Group justify="space-between" mb="md">
            <ActionIcon variant="light" size="lg" radius="xl">
              <IconUser size={20} />
            </ActionIcon>
            <Group gap="xs">
              {!isArchived && (
                <Badge
                  color={getPerformanceColor(developer.latestPerformanceScore)}
                  variant="light"
                >
                  {getPerformanceLabel(developer.latestPerformanceScore)}
                </Badge>
              )}
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray">
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  {isArchived ? (
                    <Menu.Item
                      leftSection={<IconRestore size={14} />}
                      onClick={() => handleRestoreDeveloper(developer.id, developer.name)}
                    >
                      Restaurar
                    </Menu.Item>
                  ) : (
                    <Menu.Item
                      leftSection={<IconArchive size={14} />}
                      color="orange"
                      onClick={() => handleArchiveDeveloper(developer.id, developer.name)}
                    >
                      Arquivar
                    </Menu.Item>
                  )}
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>

          <Text fw={500} size="lg" mb="xs">
            {developer.name}
          </Text>
          
          <Text size="sm" c="dimmed" mb="xs">
            {developer.role}
          </Text>

          {developerTeam && (
            <Badge color={developerTeam.color} variant="light" size="sm" mb="md">
              {developerTeam.name}
            </Badge>
          )}

          {!isArchived && (
            <Group justify="space-between" mb="md">
              <Text size="sm" fw={500}>Performance Atual:</Text>
              <Group gap="xs">
                <IconTrendingUp size={16} color="var(--mantine-color-blue-6)" />
                <Text size="sm" fw={700} c="blue">
                  {developer.latestPerformanceScore.toFixed(1)}/10
                </Text>
              </Group>
            </Group>
          )}

          {isArchived && (
            <Text size="xs" c="dimmed" mb="md">
              Arquivado em: {new Date(developer.archivedAt).toLocaleDateString('pt-BR')}
            </Text>
          )}

          {!isArchived && (
            <Group grow>
              <Button
                variant="light"
                size="sm"
                onClick={() => navigate(`/developer/${developer.id}`)}
              >
                Ver Perfil
              </Button>
              <Button
                size="sm"
                onClick={() => navigate(`/developer/${developer.id}/create-report`)}
              >
                Nova Avaliação
              </Button>
            </Group>
          )}
        </Card>
      </Grid.Col>
    );
  };

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={1} mb="xs">Dashboard da Equipe</Title>
          <Text c="dimmed">Gerencie a performance da sua equipe de desenvolvedores</Text>
        </div>
        <Group>
          <Button
            leftSection={<IconFileReport size={16} />}
            variant="outline"
            onClick={() => navigate('/consolidated-report')}
          >
            Relatório Consolidado
          </Button>
          <Button
            leftSection={<IconUsers size={16} />}
            variant="outline"
            onClick={openTeamModal}
          >
            Criar Time
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={open}
          >
            Adicionar Membro
          </Button>
        </Group>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
        <Tabs.List>
          <Tabs.Tab value="active" leftSection={<IconUser size={14} />}>
            Equipe Ativa ({developers.length})
          </Tabs.Tab>
          <Tabs.Tab value="archived" leftSection={<IconArchive size={14} />}>
            Arquivados ({archivedDevelopers.length})
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="active">
          <Grid>
            {developers.map((developer) => (
              <DeveloperCard key={developer.id} developer={developer} />
            ))}
          </Grid>

          {developers.length === 0 && (
            <Card shadow="sm" padding="xl" radius="md" withBorder mt="xl">
              <div style={{ textAlign: 'center' }}>
                <IconUser size={48} color="var(--mantine-color-gray-5)" />
                <Title order={3} mt="md" mb="xs">Nenhum desenvolvedor ativo</Title>
                <Text c="dimmed" mb="lg">
                  Comece adicionando membros à sua equipe para acompanhar a performance
                </Text>
                <Button leftSection={<IconPlus size={16} />} onClick={open}>
                  Adicionar Primeiro Membro
                </Button>
              </div>
            </Card>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="archived">
          <Grid>
            {archivedDevelopers.map((developer) => (
              <DeveloperCard key={developer.id} developer={developer} isArchived={true} />
            ))}
          </Grid>

          {archivedDevelopers.length === 0 && (
            <Card shadow="sm" padding="xl" radius="md" withBorder mt="xl">
              <div style={{ textAlign: 'center' }}>
                <IconArchive size={48} color="var(--mantine-color-gray-5)" />
                <Title order={3} mt="md" mb="xs">Nenhum desenvolvedor arquivado</Title>
                <Text c="dimmed">
                  Desenvolvedores arquivados aparecerão aqui
                </Text>
              </div>
            </Card>
          )}
        </Tabs.Panel>
      </Tabs>

      <Modal opened={opened} onClose={close} title="Adicionar Novo Membro" centered>
        <form onSubmit={form.onSubmit(handleAddDeveloper)}>
          <TextInput
            label="Nome Completo"
            placeholder="Digite o nome do desenvolvedor"
            {...form.getInputProps('name')}
            mb="md"
          />
          
          <Select
            label="Cargo"
            placeholder="Selecione o cargo"
            data={[
              'Frontend Developer',
              'Backend Developer',
              'Full Stack Developer',
              'Mobile Developer',
              'DevOps Engineer',
              'QA Engineer',
              'Tech Lead',
              'Senior Developer',
              'Junior Developer',
            ]}
            {...form.getInputProps('role')}
            mb="md"
            searchable
            clearable
          />

          <Select
            label="Time (Opcional)"
            placeholder="Selecione um time"
            data={teams.map(team => ({ value: team.id, label: team.name }))}
            {...form.getInputProps('teamId')}
            mb="xl"
            clearable
          />

          <Group justify="flex-end">
            <Button variant="outline" onClick={close}>
              Cancelar
            </Button>
            <Button type="submit">
              Adicionar
            </Button>
          </Group>
        </form>
      </Modal>

      <Modal opened={teamModalOpened} onClose={closeTeamModal} title="Criar Novo Time" centered>
        <form onSubmit={teamForm.onSubmit(handleAddTeam)}>
          <TextInput
            label="Nome do Time"
            placeholder="Digite o nome do time"
            {...teamForm.getInputProps('name')}
            mb="md"
          />
          
          <TextInput
            label="Descrição (Opcional)"
            placeholder="Descreva o propósito do time"
            {...teamForm.getInputProps('description')}
            mb="md"
          />

          <ColorInput
            label="Cor do Time"
            placeholder="Escolha uma cor"
            {...teamForm.getInputProps('color')}
            mb="xl"
            swatches={['#2e2e2e', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}
          />

          <Group justify="flex-end">
            <Button variant="outline" onClick={closeTeamModal}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Time
            </Button>
          </Group>
        </form>
      </Modal>
    </Container>
  );
};

export default Dashboard;

