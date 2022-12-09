export type divisionBody = {
  name: string
  position?: number
  tee_times: [
    {
      time: string
      starting_hole?: number
      starting_hole_label?: string
    }
  ]
}
