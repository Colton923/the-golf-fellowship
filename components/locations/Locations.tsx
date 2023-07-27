'use client'

import { useDisclosure } from '@mantine/hooks'
import { Collapse, Center } from '@mantine/core'
const Locations = () => {
  const [opened, { toggle }] = useDisclosure(false)

  return (
    <>
      <Center
        style={
          {
            cursor: 'pointer',
          } && opened === true
            ? {
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: '1px solid white',
                borderRadius: '15px',
                margin: '3px',
              }
            : {
                backgroundColor: 'transparent',
                border: '1px solid white',
                borderRadius: '15px',
                margin: '3px',
              }
        }
      >
        <svg
          onClick={() => {
            toggle()
          }}
          x="0px"
          y="0px"
          width="40"
          height="40"
          viewBox="0 0 50 50"
          fill="white"
          style={{
            cursor: 'pointer',
          }}
        >
          <path d="M 25 2 C 17.832031 2 12 7.832031 12 15 C 12 20.078125 15.105469 26.347656 18.140625 31.492188 C 21.171875 36.636719 24.203125 40.609375 24.203125 40.609375 L 25 41.644531 L 25.796875 40.609375 C 25.796875 40.609375 28.828125 36.636719 31.859375 31.492188 C 34.894531 26.347656 38 20.078125 38 15 C 38 7.832031 32.167969 2 25 2 Z M 25 4 C 31.085938 4 36 8.914063 36 15 C 36 19.214844 33.105469 25.445313 30.140625 30.476563 C 27.570313 34.832031 25.644531 37.339844 25 38.199219 C 24.355469 37.339844 22.429688 34.832031 19.859375 30.476563 C 16.894531 25.445313 14 19.214844 14 15 C 14 8.914063 18.914063 4 25 4 Z M 25 10 C 22.25 10 20 12.25 20 15 C 20 17.75 22.25 20 25 20 C 27.75 20 30 17.75 30 15 C 30 12.25 27.75 10 25 10 Z M 25 12 C 26.667969 12 28 13.332031 28 15 C 28 16.667969 26.667969 18 25 18 C 23.332031 18 22 16.667969 22 15 C 22 13.332031 23.332031 12 25 12 Z M 7.296875 32 L 1.578125 48 L 48.421875 48 L 42.703125 32 L 35.050781 32 C 34.660156 32.6875 34.269531 33.355469 33.878906 34 L 41.296875 34 L 45.578125 46 L 4.421875 46 L 8.703125 34 L 16.121094 34 C 15.730469 33.355469 15.339844 32.6875 14.949219 32 Z"></path>
        </svg>
      </Center>

      <Collapse in={opened}>
        <iframe
          src={`https://storage.googleapis.com/maps-solutions-6fnfn9etrn/locator-plus/gweu/locator-plus.html?key=${'AIzaSyDwN22y-ZJ-kCn3dnJsPuJoSu1q0tLvqbg'}`}
          width="100%"
          height="100%"
          style={{
            border: 'none',
            borderRadius: '4px',
            minWidth: '85vw',
            minHeight: '750px',
            margin: '0',
            padding: '0',
          }}
        ></iframe>
      </Collapse>
    </>
  )
}
export default Locations
