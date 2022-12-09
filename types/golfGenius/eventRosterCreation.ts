export type eventRosterBody = {
  external_id: string
  last_name: string
  first_name?: string
  email?: string
  gender?: string
  handicap_index?: number
  handicap_network_id?: string
  rounds: [
    {
      round_id: number
      team_id?: number
      division_id?: number
    }
  ]
  custom_fields?: Record<string, string>
}
