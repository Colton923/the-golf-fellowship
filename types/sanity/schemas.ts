type SanityTableRef = {
  _ref: string
  _type: string
}

export interface ChaptersTable {
  _id: string
  title: string
  cities: SanityTableRef[]
  terms: SanityTableRef[]
  playingFrequency: string
}

export interface CitiesTable {
  _id: string
  title: string
}

export interface EventFeeTable {
  _id: string
  title: string
  feePerMembership: {
    membershipTableRef: SanityTableRef
    fee: number
  }[]
}

export interface MembershipsTable {
  _id: string
  title: string
}

export interface EventsTable {
  _id: string
  title: string
  date: string
  location: SanityTableRef
  cost: SanityTableRef
  eventType: SanityTableRef
  sideGames: SanityTableRef[]
  tees: SanityTableRef[]
  description: string[]
  inclusions: string[]
  playingPartnerRequest: boolean
  image: string
}

export interface EventTypesTable {
  _id: string
  title: string
  description: string
  defaultFee: number
}

export interface LocationsTable {
  _id: string
  title: string
  default9Fee: number
  default18Fee: number
  description: string
}

export interface SideGamesTable {
  _id: string
  title: string
  fee: number
  description: string
  membersOnly: boolean
}

export interface TeesTable {
  _id: string
  title: string
  description: string
}

export interface TermsTable {
  _id: string
  title: string
  termLength: number
  membershipFee: number
}
