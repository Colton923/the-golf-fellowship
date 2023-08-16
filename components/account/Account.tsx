'use client'
import { useSiteContext } from '@components/context/Context'
import { Card, Flex, Text, Badge, TextInput, Space } from '@mantine/core'

const Account = () => {
  const { myUserData } = useSiteContext()

  if (!myUserData) return null
  return (
    <Card shadow="sm" padding="sm" radius="md">
      <Text>My Account Settings</Text>
      <Space h={'10px'} />
      <Flex direction="column" h={'100%'} align="center">
        <TextInput label={'First Name'} defaultValue={myUserData.firstName} />
        <TextInput label={'Last Name'} defaultValue={myUserData.lastName} />
        <TextInput label={'Email'} defaultValue={myUserData.email} />
        <TextInput label={'Phone Number'} defaultValue={myUserData.phone} />
        <TextInput label={'City'} defaultValue={myUserData.address.city} />
        <TextInput label={'State'} defaultValue={myUserData.address.state} />
        <TextInput label={'Country'} defaultValue={myUserData.address.country} />
        <TextInput label={'Zip'} defaultValue={myUserData.address.postalCode} />
        <TextInput label={'Address'} defaultValue={myUserData.address.street} />
      </Flex>
    </Card>
  )
}

export default Account
