'use client'

import {
  Progress,
  Container,
  Group,
  Flex,
  Text,
  Space,
  Badge,
  Modal,
  Button,
  Card,
} from '@mantine/core'
import { useState, useEffect } from 'react'
import MemberCard from './MemberCard'
import {
  IconArrowBack,
  IconArrowForward,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react'
import MemberContact from './MemberContact'
import Chapter from './Chapter'
import Frequency from './Frequency'
import client from 'lib/sanity/client'
import Term from './Term'
import Plan from './Plan'
import { notifications } from '@mantine/notifications'
import MembershipCheckout from './MembershipCheckout'
import { Elements } from '@stripe/react-stripe-js'
import initializeStripe from 'stripe/initializeStripe'

const ChapterQuery = `*[_type == "chapters"] {
  _id,
  title,
}`

const CitiesQuery = `*[_type == "cities"] {
  title,
  chapters,
  terms,
  playingFrequency,
}`

const TermsQuery = (termRef: string) => {
  return `*[_type == "terms" && _id == "${termRef}"] {
    title,
    termLength,
    "membershipFeeDetails": membershipFee[]{
      fee,
      "membershipTitle": membership->title
    }
  }`
}

const progressIntervals = [0, 14, 28, 42, 56, 70, 84, 100]

export default function Page() {
  const [progressBar, setProgressBar] = useState(0)
  const [q1, setQ1] = useState(true)
  const [q2, setQ2] = useState(false)
  const [q3, setQ3] = useState(false)
  const [q4, setQ4] = useState(false)
  const [q5, setQ5] = useState(false)
  const [q6, setQ6] = useState(false)
  const [q7, setQ7] = useState(false)

  const [chapter, setChapter] = useState<any | null>(null)
  const [cities, setCities] = useState<any[]>([])
  const [filteredCities, setFilteredCities] = useState<any[]>([])
  const [frequency, setFrequency] = useState('')
  const [plus, setPlus] = useState(false)
  const [id, setId] = useState('')
  const [cityInfoRequest, setCityInfoRequest] = useState(false)
  const [frequencyInfoRequest, setFrequencyInfoRequest] = useState(false)
  const [termInfoRequest, setTermInfoRequest] = useState(false)
  const [showActiveUserForm, setShowActiveUserForm] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [showVerifyPhoneModal, setShowVerifyPhoneModal] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [chapterData, setChapterData] = useState<any[]>([])
  const [queriedTerm, setQueriedTerm] = useState<any | null>(null)
  const [selectedTerm, setTerm] = useState('')
  const [selectedPlan, setPlan] = useState<any | null>(null)
  const [onePaymentTotal, setOnePaymentTotal] = useState(0)
  const [monthlyPaymentTotal, setMonthlyPaymentTotal] = useState(0)
  const [paymentTotal, setPaymentTotal] = useState(0)
  const [paymentIntent, setPaymentIntent] = useState<any | null>(null)
  const [stripeClient, setStripeClient] = useState<any | null>(null)

  const HandleBack = () => {
    if (q2) {
      setQ2(false)
      setProgressBar(progressIntervals[0])
      setQ1(true)
    } else if (q3) {
      setQ3(false)
      setProgressBar(progressIntervals[1])
      setChapter('')
      setQ2(true)
    } else if (q4) {
      if (chapter.playingFrequency < 3) {
        setQ3(false)
        setQ4(false)
        setProgressBar(progressIntervals[1])
        setChapter('')
        setQ2(true)
      } else {
        setQ4(false)
        setProgressBar(progressIntervals[2])
        setFrequency('')
        setQ3(true)
      }
    } else if (q5) {
      setQ5(false)
      setProgressBar(progressIntervals[3])
      setTerm('')
      setQ4(true)
    } else if (q6) {
      setQ6(false)
      setProgressBar(progressIntervals[4])
      setQ5(true)
    } else if (q7) {
      setQ7(false)
      setProgressBar(progressIntervals[5])
      setQ6(true)
    }
  }

  const validCustomer = () => {
    if (firstName === '') {
      notifications.show({
        title: 'First Name Required',
        message: 'Please enter your first name.',
        autoClose: 1500,
        withCloseButton: false,
      })
      return
    }
    if (lastName === '') {
      notifications.show({
        title: 'Last Name Required',
        message: 'Please enter your last name.',
        autoClose: 1500,
        withCloseButton: false,
      })
      return
    }

    if (phoneNumber === '') {
      notifications.show({
        title: 'Phone Number Required',
        message: 'Please enter your phone number.',
        autoClose: 1500,
        withCloseButton: false,
      })
      return
    }
    if (email === '') {
      notifications.show({
        title: 'Email Required',
        message: 'Please enter your email.',
        autoClose: 1500,
        withCloseButton: false,
      })
      return
    }
    setProgressBar(progressIntervals[1])
    setQ1(false)
    setQ2(true)
  }

  const validChapter = (chapter: any) => {
    const city = cities.map((city) => {
      const chap = city.chapters.find((c: any) => {
        if (c._ref === chapter._id) {
          return city
        }
      })
      if (chap) return city
    })
    const filtered = city.filter((city) => {
      if (city) return city
    })
    if (!filtered) return
    setFilteredCities(filtered)
    const anyOverTwo = filtered.some((city) => {
      if (city.playingFrequency > 2) return city
    })
    if (anyOverTwo) {
      setFrequency('notsure')
      setProgressBar(progressIntervals[3])
      setQ2(false)
      setQ4(true)
    } else {
      setProgressBar(progressIntervals[2])
      setQ2(false)
      setQ3(true)
    }
    setChapter(chapter)
  }

  const validFrequency = () => {
    setProgressBar(progressIntervals[3])
    setQ3(false)
    setQ4(true)
  }

  const validTerm = (term: string) => {
    setProgressBar(progressIntervals[4])
    setQ4(false)
    setQ5(true)
    setTerm(term)
  }

  const validPlan = (term: any) => {
    setPlan(term)
    setProgressBar(progressIntervals[5])
    setQ5(false)
    setQ6(true)
  }

  const HandleGoToCheckout = (choice: string) => {
    setProgressBar(progressIntervals[6])

    let total = 0
    setQ6(false)
    if (choice === 'payinfull') {
      setPaymentTotal(onePaymentTotal)
      total = onePaymentTotal
    }
    if (choice === 'paymonthly') {
      setPaymentTotal(monthlyPaymentTotal)
      total = monthlyPaymentTotal
    }

    const StripeIntent = async () => {
      await fetch('/api/stripe/stripe_intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total * 100,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setPaymentIntent(data)
          setQ7(true)
        })
    }
    StripeIntent()
  }

  useEffect(() => {
    const StripeSetter = async () => {
      const stripe = await initializeStripe()
      return stripe
    }
    StripeSetter().then((stripe) => {
      setStripeClient(stripe)
    })
    if (chapterData.length === 0) {
      const getChapters = async () => {
        const chapters = await client.fetch(ChapterQuery)
        return chapters
      }
      getChapters().then((chapters) => {
        if (!chapters) return

        setChapterData(chapters)
      })
    }
    if (cities.length === 0) {
      const getCities = async () => {
        const cities = await client.fetch(CitiesQuery)
        return cities
      }
      getCities().then((cities) => {
        if (!cities) return
        setCities(cities)
      })
    }
  }, [])

  useEffect(() => {
    if (chapter) {
      const getTerm = async () => {
        const proms = filteredCities.map((filteredCity: any) => {
          const promises = filteredCity.terms.map((term: any) => {
            if (!term) return
            const termData = client.fetch(TermsQuery(term._ref))
            return termData
          })
          return Promise.all(promises)
        })
        const term = await Promise.all(proms)
        return term
      }

      getTerm().then((term) => {
        if (!term) return
        const termData = term.map((term) => {
          return term.flat()
        })
        const termDataFlat = termData.flat()
        setQueriedTerm(termDataFlat)
      })
    }
  }, [chapter])

  useEffect(() => {
    if (!selectedPlan) return
    const fee = selectedPlan.membershipFeeDetails.find((fee: any) => {
      return (
        selectedPlan.selectedMembership.toLowerCase() ===
        fee.membershipTitle.toLowerCase()
      )
    })
    if (!fee) return
    if (selectedPlan.termLength >= 12) {
      setMonthlyPaymentTotal(
        Math.floor((fee.fee / selectedPlan.termLength) * 100) / 100
      )
    } else {
      HandleGoToCheckout('payinfull')
    }
    setOnePaymentTotal(Math.floor(fee.fee))
  }, [selectedPlan])

  return (
    <Container size={'xl'} mih={'90vh'}>
      <Space h={'100px'} />
      <Group position={'center'}>
        {progressBar > 0 && (
          <Progress
            value={progressBar}
            m={'lg'}
            w={'100%'}
            color="dark"
            variant="filled"
            size={'xl'}
          />
        )}

        {cityInfoRequest && (
          <Modal
            opened={cityInfoRequest}
            onClose={() => setCityInfoRequest(false)}
            size={'md'}
            withCloseButton={false}
            withOverlay={true}
            centered
          >
            <IconInfoCircle
              size={30}
              onClick={() => {
                setCityInfoRequest(false)
              }}
              style={{
                cursor: 'pointer',
              }}
            />
            <Text m={'xl'} fz={'md'}></Text>
          </Modal>
        )}
        {frequencyInfoRequest && (
          <Modal
            opened={frequencyInfoRequest}
            onClose={() => setFrequencyInfoRequest(false)}
            size={'md'}
            withCloseButton={false}
            withOverlay={true}
            centered
          >
            <IconInfoCircle
              size={30}
              onClick={() => {
                setFrequencyInfoRequest(false)
              }}
              style={{
                cursor: 'pointer',
              }}
            />
            <Text m={'xl'} fz={'md'}></Text>
          </Modal>
        )}
        {termInfoRequest && (
          <Modal
            opened={termInfoRequest}
            onClose={() => setTermInfoRequest(false)}
            size={'md'}
            withCloseButton={false}
            withOverlay={true}
            centered
          >
            <IconInfoCircle
              size={30}
              onClick={() => {
                setTermInfoRequest(false)
              }}
              style={{
                cursor: 'pointer',
              }}
            />
            <Text m={'xl'} fz={'md'}></Text>
          </Modal>
        )}
        {showVerifyPhoneModal && (
          <Modal
            opened={showVerifyPhoneModal}
            onClose={() => setShowVerifyPhoneModal(false)}
            size={'md'}
            withCloseButton={false}
            withOverlay={true}
            centered
          >
            <Text ta={'center'} m={'xl'} fz={'md'}>
              Please verify your phone number is correct again. This will be used for
              any future logins.
            </Text>

            <Space h={'sm'} />
            <Text ta={'center'} m={'xs'} fz={'xs'} fs={'bold'}>
              {phoneNumber}
            </Text>
            <Space h={'sm'} />
            <Flex justify={'center'} direction={'row'} align={'center'}>
              <Button
                onClick={() => {
                  setShowVerifyPhoneModal(false)
                  setPhoneVerified(true)
                }}
                color="dark"
                variant="outline"
                m={'xs'}
              >
                <IconArrowForward size={20} />
                <Text>Continue</Text>
              </Button>
              <Button
                onClick={() => {
                  setShowVerifyPhoneModal(false)
                  setShowActiveUserForm(true)
                  setProgressBar(75)
                }}
                color="dark"
                m={'xs'}
                variant="outline"
              >
                <IconX size={20} />
                <Text>Cancel</Text>
              </Button>
            </Flex>
          </Modal>
        )}
        {firstName !== '' && (
          <MemberCard first={firstName} last={lastName} plus={plus} id={id}>
            {chapter && (
              <Badge color="dark" variant="filled">
                {chapter.title}
              </Badge>
            )}
            {frequency && (
              <Badge color="dark" variant="outline">
                {frequency}
              </Badge>
            )}
            {selectedTerm && (
              <Badge color="dark" variant="light">
                {selectedTerm}
              </Badge>
            )}
          </MemberCard>
        )}
        <Flex justify={'center'} direction={'column'} align={'outline'}>
          {q1 && (
            <MemberContact
              setFirstName={setFirstName}
              setLastName={setLastName}
              setEmail={setEmail}
              setPhone={setPhoneNumber}
              firstName={firstName}
              lastName={lastName}
              phone={phoneNumber}
              email={email}
              next={validCustomer}
            />
          )}
          {q2 && (
            <Chapter
              firstName={firstName}
              next={validChapter}
              chapterData={chapterData}
            />
          )}
          {q3 && (
            <Frequency
              firstName={firstName}
              next={validFrequency}
              setSelectedFrequency={setFrequency}
              selectedFrequency={frequency}
            />
          )}
          {q4 && <Term terms={queriedTerm} next={validTerm} />}
          {q5 && (
            <Plan
              frequency={frequency}
              next={validPlan}
              selectedTerm={selectedTerm}
              terms={queriedTerm}
            />
          )}
          {q6 && selectedPlan.termLength >= 12 && (
            <Card shadow="md" radius="md" p="md" m="md">
              <Text ta={'center'}>How would you like to pay?</Text>
              <Button
                onClick={() => {
                  HandleGoToCheckout('payinfull')
                }}
                variant={'light'}
                color={'dark'}
                fullWidth
                style={{ margin: '10px 0 10px 0' }}
              >
                {`One Payment of $${onePaymentTotal.toFixed(2)}`}
              </Button>

              <Button
                onClick={() => {
                  HandleGoToCheckout('paymonthly')
                }}
                variant={'light'}
                color={'dark'}
                fullWidth
                style={{ margin: '10px 0 10px 0' }}
              >
                {`Monthly Payments of $${monthlyPaymentTotal.toFixed(2)}`}
              </Button>
            </Card>
          )}
          {q7 && paymentIntent && (
            <Elements
              stripe={stripeClient}
              options={{
                clientSecret: paymentIntent.client_secret,
              }}
            >
              <MembershipCheckout
                chapter={chapter}
                email={email}
                fee={paymentTotal}
                firstName={firstName}
                lastName={lastName}
                interval={selectedPlan.termLength >= 12 ? 'year' : 'month'}
                intervalCount={
                  selectedPlan.termLength >= 12 ? 1 : selectedPlan.termLength
                }
                membershipType={selectedPlan.selectedMembership}
                paymentIntentId={paymentIntent.id}
                phoneNumber={phoneNumber}
              />
            </Elements>
          )}
          <Button
            onClick={() => {
              HandleBack()
            }}
            color="dark"
            variant="outline"
            m={'xs'}
          >
            <IconArrowBack size={20} />
            <Text p={'xs'}>Back</Text>
          </Button>
        </Flex>
      </Group>
    </Container>
  )
}
