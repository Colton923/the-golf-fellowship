'use client'

import {
  Container,
  Text,
  Button,
  TextInput,
  Badge,
  Checkbox,
  Select,
  Notification,
  Paper,
  Image,
  Group,
  Card,
  ColorSwatch,
  BackgroundImage,
  Divider,
  Center,
  Box,
  Accordion,
  Title,
  Blockquote,
  Drawer,
  Textarea,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

const DarkTest = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const colors = [
    '#7e7e7e',
    '#e1e1e1',
    '#cfcfcf',
    '#b1b1b1',
    '#9e9e9e',
    '#626262',
    '#515151',
    '#3b3b3b',
    '#212121',
    '#000000',
  ]
  const swatches = colors.map((color) => (
    <ColorSwatch
      key={color}
      color={color}
      style={{ marginRight: '1rem', marginBottom: '1rem' }}
    />
  ))

  return (
    <Container
      size="lg"
      style={{
        backgroundColor: '#212121',
        color: '#7e7e7e',
        minHeight: '100vh',
        padding: '2rem',
        marginTop: '75px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <Title order={1} style={{ marginBottom: '2rem' }}>
        <Text size="xl" style={{ marginBottom: '2rem' }}>
          Dark Theme
        </Text>
      </Title>
      <Blockquote cite="- colton">
        <Text size="lg" style={{ marginBottom: '2rem', color: '#fff' }}>
          I really like having time to build the frontend
        </Text>
      </Blockquote>
      <Group position="center" style={{ marginBottom: '2rem' }}>
        {swatches}
      </Group>
      <Divider style={{ marginBottom: '2rem' }} />
      <Center>
        <Button
          variant="outline"
          color="white"
          style={{ marginRight: '1rem' }}
          onClick={open}
        >
          This is so cool
        </Button>
      </Center>
      <Drawer opened={opened} onClose={close} padding="md">
        <Text size="lg" style={{ marginBottom: '2rem' }}>
          This is a drawer
        </Text>
        <Checkbox label="This is a checkbox" style={{ marginBottom: '2rem' }} />
        <Textarea
          label="This is a textarea"
          placeholder="This is a placeholder"
          style={{ marginBottom: '2rem' }}
        />

        <Button variant="outline" color="white" onClick={close}>
          Close
        </Button>
      </Drawer>

      <TextInput
        label="Name"
        placeholder="Enter your name"
        style={{ marginBottom: '1rem' }}
      />

      <Button variant="outline" color="white" style={{ marginRight: '1rem' }}>
        Submit Example
      </Button>

      <Select
        data={[
          { value: 'golf', label: 'Golf' },
          { value: 'all', label: 'All' },
          { value: 'day', label: 'Day' },
        ]}
        placeholder="Select Example"
        style={{ marginBottom: '1rem' }}
      />

      <Notification
        title="Important Notice"
        color="red"
        style={{ marginBottom: '1rem' }}
      >
        Please read the instructions carefully.
      </Notification>

      <Paper shadow="lg">
        <Text size="lg">This is some kind of text.</Text>
      </Paper>
      <Container
        size="sm"
        style={{
          backgroundColor: '#212121',
          color: '#7e7e7e',
          padding: '2rem',
          display: 'flex',
          width: '100%',
        }}
      >
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section>
            <Image
              src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
              height={160}
              alt="Norway"
            />
          </Card.Section>

          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>Norway Fjord Adventures</Text>
            <Badge color="pink" variant="light">
              On Sale
            </Badge>
          </Group>

          <Text size="sm" color="dimmed">
            With Fjord Tours you can explore more of the magical fjord landscapes
            with tours and activities on and around the fjords of Norway
          </Text>

          <Button variant="light" color="blue" fullWidth mt="md" radius="md">
            Book classic tour now
          </Button>
        </Card>
      </Container>
      <Divider style={{ marginBottom: '2rem' }} />
      <Container
        size="sm"
        style={{
          backgroundColor: '#212121',
          color: '#7e7e7e',
          padding: '2rem',
          display: 'flex',
          width: '100%',
        }}
      >
        <Box maw={300} mx="auto">
          <BackgroundImage
            src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80"
            radius="sm"
          >
            <Center p="md">
              <Text color="#fff">
                What a fancy background. What a fancy background. What a fancy
                background. What a fancy background. What a fancy background. What a
                fancy background. What a fancy background. What a fancy background.
                What a fancy background. What a fancy background. What a fancy
                background. What a fancy background. What a fancy background. What a
                fancy background. What a fancy background. What a fancy background.
                What a fancy background. What a fancy background. What a fancy
                background. What a fancy background. What a fancy background. What a
                fancy background. What a fancy background. What a fancy background.
              </Text>
            </Center>
          </BackgroundImage>
        </Box>
      </Container>
      <Divider style={{ marginBottom: '2rem' }} />
      <Group
        position="left"
        style={{ marginBottom: '2rem', width: '100%', maxWidth: '800px' }}
      >
        <Accordion defaultValue="customization">
          <Accordion.Item value="customization">
            <Accordion.Control>
              {' '}
              <Text color="#fff">Cool Dropdown</Text>
            </Accordion.Control>
            <Accordion.Panel>
              {' '}
              <Text color="#fff">c o o l d r o p d o w n</Text>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="flexibility">
            <Accordion.Control>
              {' '}
              <Text color="#fff">cant wait to rebuild the ui</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Text color="#fff">it will be nice to implement these features</Text>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="focus-ring">
            <Accordion.Control>
              {' '}
              <Text color="#fff">Perfect UI stuff</Text>
            </Accordion.Control>
            <Accordion.Panel>
              {' '}
              <Text color="#fff">Not sure about the dark theme</Text>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Group>
    </Container>
  )
}

export default DarkTest
