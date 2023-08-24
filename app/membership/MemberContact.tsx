import { Button, Flex, Text, TextInput, Card } from '@mantine/core'
import { IconArrowAutofitRight } from '@tabler/icons-react'

type Props = {
  setFirstName: (firstName: string) => void
  setLastName: (lastName: string) => void
  setEmail: (email: string) => void
  setPhone: (phone: string) => void
  firstName: string
  lastName: string
  email: string
  phone: string
  next: () => void
}

const firstNameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
const lastNameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/

const MemberContact = (props: Props) => {
  const {
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    firstName,
    lastName,
    phone,
    email,
    next,
  } = props
  const HandleFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.currentTarget.value)
  }

  const HandleLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.currentTarget.value)
  }
  const HandleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value)
  }
  const HandlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^0-9,-]/g, '')

    if (e.target.value.length < phone.length - 2) {
      setPhone('+1' + e.target.value)
      return
    }

    if (e.target.value.length > 12) {
      e.target.value = e.target.value.slice(0, 12)
    }
    if (e.target.value.length === 3) {
      if (e.target.value[2] !== '-') {
        e.target.value = e.target.value + '-'
      }
    }
    if (e.target.value.length === 7) {
      if (e.target.value[6] !== '-') {
        e.target.value = e.target.value + '-'
      }
    }
    setPhone(e.currentTarget.value)
  }

  return (
    <>
      <Text
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
          margin: '0 auto 0 auto',
        }}
      >{`Welcome, let's get you signed up!`}</Text>
      <Card shadow="md" radius="md" p="md" m="md">
        <Flex direction="column" align="center" justify="center">
          <TextInput
            required
            m={'xs'}
            placeholder="First Name"
            onChange={HandleFirstName}
            value={firstName}
            error={
              firstName.length > 0 && !firstNameRegex.test(firstName)
                ? 'First Name is invalid'
                : null
            }
          />
          <TextInput
            required
            m={'xs'}
            placeholder="Last Name"
            onChange={HandleLastName}
            value={lastName}
            error={
              lastName.length > 0 && !lastNameRegex.test(lastName)
                ? 'Last Name is invalid'
                : null
            }
          />
          <TextInput
            required
            m={'xs'}
            placeholder="Email"
            onChange={HandleEmail}
            value={email}
            error={
              email.length > 0 && !emailRegex.test(email) ? 'Email is invalid' : null
            }
          />
          <TextInput
            required
            m={'xs'}
            placeholder="Phone"
            onChange={HandlePhone}
            value={phone}
          />
          <Button onClick={next} variant="outline" radius="md" color="dark" m={'xs'}>
            <IconArrowAutofitRight size={24} />
            <Text p={'xs'}>Next</Text>
          </Button>
        </Flex>
      </Card>
    </>
  )
}

export default MemberContact
