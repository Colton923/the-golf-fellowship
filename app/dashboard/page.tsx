'use client'

import Image from 'next/image'
import imgBackground from '@public/static/images/tgf_dashboard_background.png'
import styles from '@styles/Dashboard.module.css'
import GolferSVG from '@components/svgs/golfer'

import { CalendarComponent } from '@components/calendar/Calendar'
import { Account } from '@components/account/Account'
import { Receipts } from '@components/data/Receipts'
import { useSiteContext } from '@components/context/Context'
import { BackgroundImage, Center, Container, Flex, Tabs } from '@mantine/core'
import Sales from '@components/sales/Sales'
import { Suspense } from 'react'

const StatsSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={'0.8rem'}
      height={'0.8rem'}
      viewBox="0 0 30 30"
    >
      <path d="M 14.984375 1.9863281 A 1.0001 1.0001 0 0 0 14 3 L 14 4 L 2 4 A 1.0001 1.0001 0 1 0 2 6 L 2 21 C 2 22.105 2.895 23 4 23 L 11.787109 23 L 10.148438 26.042969 A 1.5 1.5 0 0 0 9 27.5 A 1.5 1.5 0 0 0 10.5 29 A 1.5 1.5 0 0 0 12 27.5 A 1.5 1.5 0 0 0 11.910156 26.992188 L 14.058594 23 L 15.941406 23 L 18.089844 26.992188 A 1.5 1.5 0 0 0 18 27.5 A 1.5 1.5 0 0 0 19.5 29 A 1.5 1.5 0 0 0 21 27.5 A 1.5 1.5 0 0 0 19.851562 26.042969 L 18.212891 23 L 26 23 C 27.105 23 28 22.105 28 21 L 28 6 A 1.0001 1.0001 0 1 0 28 4 L 16 4 L 16 3 A 1.0001 1.0001 0 0 0 14.984375 1.9863281 z M 23 9 C 23.25575 9 23.511531 9.0974687 23.707031 9.2929688 C 24.098031 9.6839688 24.098031 10.316031 23.707031 10.707031 L 17.707031 16.707031 C 17.316031 17.098031 16.683969 17.098031 16.292969 16.707031 L 14 14.414062 L 10.707031 17.707031 C 10.512031 17.902031 10.256 18 10 18 C 9.744 18 9.4879688 17.902031 9.2929688 17.707031 L 7.2929688 15.707031 C 6.9019687 15.316031 6.9019688 14.683969 7.2929688 14.292969 C 7.6839688 13.901969 8.3160313 13.901969 8.7070312 14.292969 L 10 15.585938 L 13.292969 12.292969 C 13.683969 11.901969 14.316031 11.901969 14.707031 12.292969 L 17 14.585938 L 22.292969 9.2929688 C 22.488469 9.0974688 22.74425 9 23 9 z"></path>
    </svg>
  )
}

const CalendarSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={'0.8rem'}
      height={'0.8rem'}
      viewBox="0,0,256,256"
      fill="#000000"
    >
      <g
        fill="#000000"
        fillRule="nonzero"
        stroke="none"
        strokeWidth="1"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
        strokeDasharray=""
        strokeDashoffset="0"
        fontFamily="none"
        fontWeight="none"
        fontSize="none"
        textAnchor="none"
      >
        <g transform="scale(10.66667,10.66667)">
          <path d="M7,1c-0.552,0 -1,0.448 -1,1v1h-1c-1.1,0 -2,0.9 -2,2v14c0,1.1 0.9,2 2,2h14c1.1,0 2,-0.9 2,-2v-14c0,-1.1 -0.9,-2 -2,-2h-1v-1c0,-0.552 -0.448,-1 -1,-1c-0.552,0 -1,0.448 -1,1v1h-8v-1c0,-0.552 -0.448,-1 -1,-1zM5,8h14v10c0,0.552 -0.448,1 -1,1h-12c-0.552,0 -1,-0.448 -1,-1z"></path>
        </g>
      </g>
    </svg>
  )
}

const AdminSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={'0.8rem'}
      height={'0.8rem'}
      viewBox="0 0 30 30"
    >
      <path d="M 15 3.0019531 C 10.758 3.0019531 9 5.7229531 9 9.0019531 C 9 10.105953 9.5273437 11.214844 9.5273438 11.214844 C 9.3153438 11.336844 8.9666875 11.724109 9.0546875 12.412109 C 9.2186875 13.695109 9.7749062 14.021828 10.128906 14.048828 C 10.263906 15.245828 11.55 16.777 12 17 L 12 19 C 11.997808 19.006577 11.992494 19.011049 11.990234 19.017578 C 11.659537 19.05863 11.364495 19.253775 11.214844 19.556641 L 10.902344 20.185547 C 8.4342918 21.569421 3 21.226303 3 27 L 13.304688 27 L 14.5 23.083984 L 13.361328 21 L 14.972656 21 L 16.638672 21 L 15.5 23.083984 L 16.695312 27 L 20 27 L 20 26 C 20 25.448 20.448 25 21 25 L 23 25 C 23.552 25 24 25.448 24 26 L 24 27 L 27 27 C 27 21.226303 21.565708 21.569421 19.097656 20.185547 L 18.785156 19.556641 C 18.635505 19.253775 18.340463 19.05863 18.009766 19.017578 C 18.007506 19.011049 18.002192 19.006577 18 19 L 18 17 C 18.45 16.777 19.736094 15.245828 19.871094 14.048828 C 20.225094 14.021828 20.781312 13.695109 20.945312 12.412109 C 21.033313 11.723109 20.684656 11.336844 20.472656 11.214844 C 20.472656 11.214844 21 10.212953 21 9.0019531 C 21 6.5739531 20.047 4.5019531 18 4.5019531 C 18 4.5019531 17.289 3.0019531 15 3.0019531 z"></path>
    </svg>
  )
}

const UserSVG = () => {
  return (
    <svg
      style={{
        cursor: 'pointer',
        border: 'none',
        background: 'none',
        outline: 'none',
      }}
      width={'0.8rem'}
      height={'0.8rem'}
      viewBox="0 0 24 24"
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="f1" x="-0.1" y="-0.1" width="1.5" height="1.5">
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation=".5"
            floodColor="rgba(255,255,255,0.1)"
          />
        </filter>
      </defs>
      <circle
        stroke="#000"
        fill="none"
        className="cls-1"
        cx="12"
        cy="7.25"
        r="5.73"
        filter="url(#f1)"
      />
      <path
        stroke="#000"
        fill="none"
        className="cls-1"
        d="M1.5,23.48l.37-2.05A10.3,10.3,0,0,1,12,13h0a10.3,10.3,0,0,1,10.13,8.45l.37,2.05"
        filter="url(#f1)"
      />
    </svg>
  )
}

const ClubSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={'0.8rem'}
      height={'0.8rem'}
      viewBox="0 0 128 128"
    >
      <path d="M24,127h39.4c9.4,0,17.9-5.9,21.3-14.6L125.8,5.1c0.6-1.5-0.2-3.3-1.7-3.9c-1.6-0.6-3.3,0.2-3.9,1.7L81.3,104.3l-46-29.7 c-6.8-4.4-15.2-4.8-22.4-1.1c-7,3.6-11.4,10.3-11.9,18c0,0.4,0,0.9,0,1.3V104C1,116.7,11.3,127,24,127z M7,92.8c0-0.3,0-0.7,0-1 c0.3-5.6,3.5-10.4,8.6-13c1.8-0.9,3.7-1.5,5.6-1.7l0,0c1.5-0.2,2.7,1,2.7,2.4v4.9c0,1.4,1.1,2.5,2.5,2.5H28c1.9,0,3.3,1.7,2.9,3.6 C30.7,92,29.3,93,27.9,93h-1.2c-1.3,0-2.5,0.9-2.6,2.2c-0.1,1.5,1,2.8,2.5,2.8H38c1.9,0,3.3,1.7,2.9,3.6c-0.3,1.4-1.6,2.4-3.1,2.4 H26.5c-1.4,0-2.5,1.1-2.5,2.5v1c0,1.4,1.1,2.5,2.5,2.5h21.4c1.5,0,2.8,1,3.1,2.4c0.4,1.9-1.1,3.6-2.9,3.6H26.5 c-1.4,0-2.5,1.1-2.5,2.5c0,1.4-1.3,2.5-2.6,2.3C13.2,119.5,7,112.5,7,104V92.8z"></path>
    </svg>
  )
}

export default function Page() {
  const { isAdmin, user, router } = useSiteContext()

  return (
    <BackgroundImage src={imgBackground.src}>
      <Flex direction="column" align="center" justify="center">
        <Container size="xl" mih={'100vh'} mt={'100px'} miw={'80vw'} p={'xs'}>
          <Tabs defaultValue={'proShop'} p={'xs'} maw={'90vw'}>
            <Tabs.List position="apart" style={{ width: '100%' }}>
              <Tabs.Tab value="proShop" icon={<ClubSVG />}>
                Pro Shop
              </Tabs.Tab>
              <Tabs.Tab value="stats" icon={<StatsSVG />}>
                Statistics
              </Tabs.Tab>
              <Tabs.Tab value="account" icon={<UserSVG />}>
                My Account
              </Tabs.Tab>
              <Tabs.Tab value="calendar" icon={<CalendarSVG />}>
                Calendar
              </Tabs.Tab>
              {isAdmin && (
                <Tabs.Tab value="admin" icon={<AdminSVG />}>
                  Admin
                </Tabs.Tab>
              )}
            </Tabs.List>
            <Tabs.Panel value="proShop" id="proshopId">
              <Suspense fallback={<div>Loading...</div>}>
                <Sales />
              </Suspense>
            </Tabs.Panel>
            <Tabs.Panel value="stats">Statistics</Tabs.Panel>
            <Tabs.Panel value="account">My Account</Tabs.Panel>
            <Tabs.Panel value="calendar">
              <Center p={'sm'}>
                <CalendarComponent />
              </Center>
            </Tabs.Panel>
            {isAdmin && (
              <Tabs.Panel value="admin">
                <Center p={'sm'}>
                  <Receipts />
                </Center>
              </Tabs.Panel>
            )}
          </Tabs>
        </Container>
      </Flex>
    </BackgroundImage>
  )
}
