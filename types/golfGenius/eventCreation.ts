export type eventBody = {
  name: string
  external_id?: string
  event_type?: string
  external_event_type?: string
  category_id?: string
  season_id?: string
  divisions?: {
    [key: string]: {
      name?: string
      tee_times: [
        {
          time: string
          starting_hole?: number
          starting_hole_label?: string
        }
      ]
    }
  }
  dates?: {
    [key: string]: {
      date: string
      name?: string
      external_id?: string
      enable_mobile_score_entry?: boolean
      attending_by_default?: boolean
      show_pairings_in_league_portal?: boolean
      playing_divisions?: string[]
    }
  }
  webhooks?: {
    [key: string]: {
      endpoint: string
      enabled: boolean
    }
  }
}
