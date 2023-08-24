'use client'

import { Flex, Text, Card, Chip, Group, Skeleton } from '@mantine/core'
type Props = {
  firstName: string
  next: (chapter: any) => void
  chapterData: any
}

const Chapter = (props: Props) => {
  const { firstName, next, chapterData } = props

  if (chapterData.length === 0) {
    return (
      <>
        <Text
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            margin: '0 auto 0 auto',
          }}
        >{`Thanks, ${firstName}! Now select your home chapter.`}</Text>
        <Text style={{ fontSize: '16px', textAlign: 'center' }}>
          {`This does not limit you from playing in other TGF Chapters.`}
        </Text>
        <Card shadow="md" radius="md" p="md" m="md">
          <Flex direction="column" align="center" justify="center">
            <Skeleton height={36} width={100} m={'xs'} />
            <Skeleton height={36} width={80} m={'xs'} />
            <Skeleton height={36} width={155} m={'xs'} />
            <Skeleton height={36} width={100} m={'xs'} />
          </Flex>
        </Card>
      </>
    )
  } else {
    return (
      <>
        <Text
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            margin: '0 auto 0 auto',
          }}
        >{`Thanks, ${firstName}!`}</Text>

        <Card shadow="md" radius="md" p="md" m="md">
          <Text mb={'xl'} ta={'center'}>
            Now select your home chapter.
          </Text>
          <Flex direction="column" align="center" justify="center">
            <Chip.Group>
              <Group position={'center'}>
                {chapterData.map((chapter: any) => {
                  return (
                    <Chip
                      onClick={() => {
                        next(chapter)
                      }}
                      key={chapter.title}
                      color={'dark'}
                      variant={'outline'}
                      radius={'md'}
                      value={chapter.title}
                    >
                      {chapter.title}
                    </Chip>
                  )
                })}
              </Group>
            </Chip.Group>
            <Text ta={'center'} fz={'xs'} mt={'xl'} mb={'md'}>
              This does not limit you from playing in other TGF Chapters.{' '}
            </Text>
          </Flex>
        </Card>
      </>
    )
  }
}

export default Chapter
