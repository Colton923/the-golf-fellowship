import { useState, useEffect } from 'react'
import type { eventBody } from '../../types/golfGenius/eventCreation'
import { useForm } from 'react-hook-form'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebaseClient'

export default function CreateEvents() {
  const [user, loading, error] = useAuthState(auth)
  const [event, setEvent] = useState({} as eventBody)
  const [numberOfDivisions, setNumberOfDivisions] =
    useState(0)
  const [numberOfDates, setNumberOfDates] = useState(0)
  const [numberOfWebhooks, setNumberOfWebhooks] =
    useState(0)
  const [webhookNames, setWebhookNames] = useState<
    string[]
  >([])
  const [submitted, setSubmitted] = useState(false)
  const [eventCost, setEventCost] = useState(0)
  const [eventLocation, setEventLocation] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<eventBody>()

  const onSubmit = async (formData: eventBody) => {
    const res = await fetch(
      '/api/golfGenius/createAnEvent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }
    )

    const data = await res.json()
    setEvent(data)

    console.log('data', data)
    const stripeRes = await fetch('/api/stripe/stripe_newEvent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        amount: eventCost,
        eventLocation: eventLocation,
        uid: user?.uid,
      }),
    })

    const stripeData = await stripeRes.json()

    console.log('stripeData', stripeData)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div>
        <button
          onClick={() => {
            setSubmitted(false)
          }}
        >
          Back
        </button>
        <h1>Event</h1>
        <div>
          <h1>Name</h1>
          <h2>{event.name}</h2>

          <h1>External ID</h1>
          <h2>{event.external_id}</h2>

          <h1>External Event Type</h1>
          <h2>{event.external_event_type}</h2>

          <h1>Category ID</h1>
          <h2>{event.category_id}</h2>

          <h1>Season ID</h1>
          <h2>{event.season_id}</h2>

          <h1>Number of Divisions</h1>
          <h2>{numberOfDivisions}</h2>

          <h1>Number of Dates</h1>
          <h2>{numberOfDates}</h2>

          <h1>Number of Webhooks</h1>
          <h2>{numberOfWebhooks}</h2>
        </div>
      </div>
    )
  }
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <button type="submit">Create New Event</button>
        <div>
          <h1>New Event</h1>
          <div>
            <h1>The Name of the event being created.</h1>
            <h2>Mandatory</h2>
            <input
              type="text"
              placeholder="Name"
              {...register('name', { required: true })}
            />
            <h1>Cost to Play</h1>
            <h2>
              Technically Optional, but mandatory for stripe
              otherwise $0.00
            </h2>
            <input
              type="number"
              placeholder="0.00"
              onKeyUp={(e) => {
                setEventCost(
                  parseInt(e.currentTarget.value) * 100
                )
              }}
            />
            <h1>Location of Course</h1>
            <textarea
              placeholder="Location"
              onKeyUp={(e) => {
                setEventLocation(e.currentTarget.value)
              }}
            />
            <h1>
              Event ExternalID for event roster sync. Roster
              will be automatically synced if the external
              id is present and the external event type is
              not set to `by division`.
            </h1>
            <h2>Optional</h2>
            <input
              type="text"
              placeholder="External ID"
              {...register('external_id', {
                required: false,
              })}
            />

            <h1>
              If not set, `regular` will be used as default.
            </h1>
            <h2>
              Optional (`event`/`league`/`trip`/`dcp`)
            </h2>
            <input
              type="text"
              placeholder="External Event Type"
              {...register('external_event_type', {
                required: false,
              })}
            />
            <h1>
              If not set, the default category will be used
              instead.
            </h1>
            <h2>Optional</h2>
            <input
              type="text"
              placeholder="Category ID"
              {...register('category_id', {
                required: false,
              })}
            />
            <h1>
              If not set, the default season will be used
              instead.
            </h1>
            <h2>Optional</h2>
            <input
              type="text"
              placeholder="Season ID"
              {...register('season_id', {
                required: false,
              })}
            />
            <h1>Number of Divisions for Event</h1>
            <h2>Optional</h2>
            <input
              type="number"
              placeholder="Number of Divisions"
              onChange={(e) =>
                setNumberOfDivisions(
                  parseInt(e.target.value)
                )
              }
            />
            <h1>
              Hash containing a collection of the divisions
              that are to be created for this particular
              event. Note that the integer identifying each
              division represents the position of the
              division.
            </h1>
            {[...Array(numberOfDivisions)].map((_, i) => {
              return (
                <div key={i}>
                  <h1>
                    The actual time for this tee time
                    expressed in the following format (e.g.
                    `8:10 AM`)
                  </h1>
                  <h2>Mandatory</h2>
                  <input
                    type="text"
                    placeholder="Time"
                    {...register(`divisions.${i}.time`, {
                      required: true,
                    })}
                  />
                  <h1>
                    {' '}
                    The starting hole for the current tee
                    time. If not set, the default starting
                    hole will be used (based on the played
                    tee).
                  </h1>
                  <h2>Optional</h2>
                  <input
                    type="text"
                    placeholder="Starting Hole"
                    {...register(
                      `divisions.${i}.starting_hole`,
                      {
                        required: false,
                      }
                    )}
                  />
                  <h1>
                    The label of the starting hole for the
                    current tee time (e.g. `A`). If not set,
                    the hole label will be omitted.
                  </h1>
                  <h2>Optional</h2>
                  <input
                    type="text"
                    placeholder="Starting Hole Label"
                    {...register(
                      `divisions.${i}.starting_hole_label`,
                      {
                        required: false,
                      }
                    )}
                  />
                </div>
              )
            })}
            <h1>Number of Dates for Rounds</h1>
            <h2>Optional</h2>
            <input
              type="number"
              placeholder="Number of Dates"
              onChange={(e) =>
                setNumberOfDates(parseInt(e.target.value))
              }
            />
            <h1>
              Hash containing a collection of the dates for
              Rounds to be created. If external_ids are
              passed for the rounds dates, each round will
              be linked automatically to the vendor event
              and the tee sheet will be synced
              automatically.
            </h1>
            {[...Array(numberOfDates)].map((_, i) => {
              return (
                <div key={i}>
                  <>
                    <h1>
                      The date of this particular round.
                    </h1>
                    <h2>Mandatory</h2>
                    <input
                      type="text"
                      placeholder="Date"
                      {...register(`dates.${i}.date`, {
                        required: true,
                      })}
                    />
                    <h1>
                      The Name of the round being created.
                      If not set, the round will be named
                      using the given index (e.g. `Round
                      1`).
                    </h1>
                    <h2>Optional</h2>
                    <input
                      type="text"
                      placeholder="Name"
                      {...register(`dates.${i}.name`, {
                        required: false,
                      })}
                    />
                    <h1>
                      An ID which links this round to an
                      external round. It is used to
                      automatically sync the tee sheet with
                      the vendor site.
                    </h1>
                    <h2>Optional</h2>
                    <input
                      type="text"
                      placeholder="External ID"
                      {...register(
                        `dates.${i}.external_id`,
                        {
                          required: false,
                        }
                      )}
                    />
                    <h1>
                      States whether mobile score entry
                      should be enabled for the created
                      rounds. If not set, it will default to
                      false.
                    </h1>
                    <h2>Optional</h2>
                    <input
                      type="checkbox"
                      placeholder="Enable Mobile Score Entry"
                      {...register(
                        `dates.${i}.enable_mobile_score_entry`,
                        {
                          required: false,
                        }
                      )}
                    />
                    <h1>
                      States whether members added to the
                      roster of this round will be marked as
                      `Attending` by default. If not set,
                      the setting will default to false.
                    </h1>
                    <h2>Optional</h2>
                    <input
                      type="checkbox"
                      placeholder="Attending by Default"
                      {...register(
                        `dates.${i}.attending_by_default`,
                        {
                          required: false,
                        }
                      )}
                    />
                    <h1>
                      States whether the pairings should be
                      displayed on the portal page of this
                      league for this specific round. If
                      omitted, it will default to false.
                    </h1>
                    <h2>Optional</h2>
                    <input
                      type="checkbox"
                      placeholder="Show Pairings in League Portal"
                      {...register(
                        `dates.${i}.show_pairings_in_league_portal`,
                        {
                          required: false,
                        }
                      )}
                    />
                  </>
                  {[...Array(numberOfDivisions)].map(
                    (_, j) => {
                      return (
                        <div key={j}>
                          <h1>
                            An array containing the index of
                            the divisions that are to be set
                            as playing for the following
                            rounds (e.g. `1`). If the array
                            is empty or the field is not
                            set, the playing division for
                            this round will default to All
                            Golfers.
                          </h1>
                          <h2>Optional</h2>
                          <input
                            type="number"
                            placeholder="Playing Divisions"
                            {...register(
                              `dates.${i}.playing_divisions.${j}`,
                              {
                                required: false,
                              }
                            )}
                          />
                        </div>
                      )
                    }
                  )}
                </div>
              )
            })}
            <h1>Number of Webhooks to Enable</h1>
            <h2>Optional</h2>
            <input
              type="number"
              placeholder="Number of Webhooks"
              onChange={(e) =>
                setNumberOfWebhooks(
                  parseInt(e.target.value)
                )
              }
            />
            {[...Array(numberOfWebhooks)].map((_, i) => {
              return (
                <div key={i}>
                  <h1>Webhook Name</h1>
                  <h2>Mandatory</h2>
                  <input
                    type="text"
                    placeholder="Webhook Name"
                    onChange={(e) => {
                      setWebhookNames(
                        webhookNames.map((name, j) => {
                          if (j === i) {
                            return e.target.value
                          } else {
                            return name
                          }
                        })
                      )
                    }}
                  />

                  <h1>
                    Hash containing a collection of webhooks
                    that should automatically be enabled for
                    this particular event. Settings for
                    entries that are missing from the hash
                    will remain unchanged. Note that the
                    Webhook Integration feature must be
                    enabled for the current customer (Admin
                    Center - Edit - Product Versions)
                    otherwise this hash will be ignored.
                    Each entry in the webhooks hash will
                    have as key the unique identifier for
                    the webhook that should be enabled
                    (`courses`/`pairings`/`players`/`scores`/`matches`/`match_results`/`settings`)
                    and the following hash as value:
                  </h1>
                  <h2>Mandatory</h2>
                  <input
                    type="text"
                    placeholder="Webhook Endpoint"
                    {...register(
                      `webhooks.${webhookNames[i]}.endpoint`,
                      {
                        required: true,
                      }
                    )}
                  />
                  <h1>
                    States whether updates should be sent
                    automatically for this webhook.
                  </h1>
                  <h2>Mandatory</h2>
                  <input
                    type="checkbox"
                    placeholder="Enabled"
                    {...register(
                      `webhooks.${webhookNames[i]}.enabled`,
                      {
                        required: true,
                      }
                    )}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </form>
    </div>
  )
}
