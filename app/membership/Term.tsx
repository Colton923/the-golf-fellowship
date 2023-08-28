import { Button, Card, Skeleton, Text } from '@mantine/core'

type Props = {
  terms: any
  next: (term: string) => void
}

const Term = (props: Props) => {
  const { next, terms } = props

  if (!terms) {
    return (
      <Card shadow="md" radius="md" p="md" m="md">
        <Text ta={'center'}>How long do you want to be a member?</Text>
        <Skeleton height={36} width={100} m={'xs'} />
        <Skeleton height={36} width={100} m={'xs'} />
        <Skeleton height={36} width={100} m={'xs'} />
      </Card>
    )
  }

  const termNames = terms.map((term: any) => {
    return term.title
  })

  const uniqueTermNames = [...new Set(termNames)]

  return (
    <Card shadow="md" radius="md" p="md" m="md">
      <Text ta={'center'}>How long do you want to be a member?</Text>
      {uniqueTermNames.map((term: any) => {
        return (
          <Button
            onClick={() => {
              next(term)
            }}
            key={term}
            variant={'light'}
            color={'dark'}
            fullWidth
            style={{ margin: '10px 0 10px 0' }}
          >
            {term}
          </Button>
        )
      })}
      <Button
        onClick={() => {
          next('notsure')
        }}
        variant={'light'}
        color={'dark'}
        fullWidth
        style={{ margin: '10px 0 10px 0' }}
      >
        Not Sure
      </Button>
    </Card>
  )
}

export default Term
