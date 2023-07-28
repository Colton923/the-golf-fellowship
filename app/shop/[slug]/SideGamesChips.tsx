import type { Event } from '@api/sanity/getEvents'
import ChipHelper from './ChipHelper'

interface SideGamesChipsProps {
  event: Event
  sideGamesSelected: string[]
  setSideGamesSelected: (sideGamesSelected: string[]) => void
}

const SideGamesChips = (props: SideGamesChipsProps) => {
  const { event, sideGamesSelected, setSideGamesSelected } = props

  const handlePushSideGame = (sideGame: string) => {
    setSideGamesSelected([...sideGamesSelected, sideGame])
  }

  const handlePopSideGame = (sideGame: string) => {
    setSideGamesSelected(
      sideGamesSelected.filter((sideGameSelected) => sideGameSelected !== sideGame)
    )
  }

  const handleNewSideGame = (sideGame: string) => {
    if (sideGamesSelected.includes(sideGame)) {
      handlePopSideGame(sideGame)
    } else {
      handlePushSideGame(sideGame)
    }
  }

  return event.sideGames.map((sideGame, index) => {
    return (
      <ChipHelper
        fn={() => console.log('clicked')}
        color="cyan"
        variant="light"
        label={sideGame.title}
        handleNewSideGame={handleNewSideGame}
        key={'sideGamesChips' + index}
      />
    )
  })
}

export default SideGamesChips
