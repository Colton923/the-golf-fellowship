import { Card, Chip, Grid, Text } from '@mantine/core'

type Props = {
  next: (term: any) => void
  frequency: string
  selectedTerm: string
  terms: any
}

type termType = {
  title: string
  termLength: number
  membershipFeeDetails: {
    fee: number
    membershipTitle: string
  }[]
}

const Plan = (props: Props) => {
  const { next, frequency, selectedTerm, terms } = props
  const isFrequent = !(frequency === 'notsure')
  const isTerm = !(selectedTerm === 'notsure')
  const uniqueMembershipTitles = Array.from(
    new Set(
      terms.flatMap((term: termType) =>
        term.membershipFeeDetails.map((detail) => detail.membershipTitle)
      )
    )
  )
  return (
    <Card shadow="md" radius="md" p="md" m="md">
      <Text ta={'center'}>
        Here are the options
        {frequency !== 'notsure' &&
          selectedTerm !== 'notsure' &&
          ` and our recommended membership.`}
      </Text>
      <Text ta={'center'}>Select the Membership Plan that works best for you</Text>
      <table style={{ width: '100%', textAlign: 'center' }}>
        <thead>
          <tr>
            <th></th>
            {uniqueMembershipTitles.map((membershipTitle: any) => (
              <th key={membershipTitle}>{membershipTitle}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {terms.map((term: termType) => (
            <tr key={term.title}>
              <td>{term.title}</td>
              {uniqueMembershipTitles.map((membershipTitle: any) => {
                const detail = term.membershipFeeDetails.find(
                  (d) => d.membershipTitle === membershipTitle
                )
                const isHighlighted =
                  frequency === membershipTitle && term.title === selectedTerm
                return (
                  <td
                    key={membershipTitle}
                    style={{
                      backgroundColor: isHighlighted ? '#f0f0f0' : 'transparent',
                    }}
                  >
                    {detail ? (
                      <Chip
                        style={{
                          backgroundColor: isHighlighted ? '#ddd' : 'transparent',
                        }}
                        onClick={() => {
                          next({
                            title: term.title,
                            termLength: term.termLength,
                            membershipFeeDetails: term.membershipFeeDetails,
                            selectedMembership: detail.membershipTitle,
                          })
                        }}
                      >
                        ${detail.fee}
                      </Chip>
                    ) : (
                      '-'
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

export default Plan
