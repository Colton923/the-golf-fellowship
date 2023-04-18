import styles from './Chevron.module.css'

interface ChevronProps {
  collapse: boolean
  setCollapse: (collapseCity: boolean) => void
}

export default function Chevron(props: ChevronProps) {
  const { collapse, setCollapse } = { ...props }

  return (
    <div className={styles.svgWrap}>
      <div className={collapse ? styles.svgRotateOne : styles.svgRotateTwo}>
        <svg
          onClick={() => setCollapse(!collapse)}
          className={styles.svg}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>
  )
}
