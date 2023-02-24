import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  stage: number
}

const ProgressBar = (props: ProgressBarProps) => {
  const { stage } = { ...props }

  return (
    <div className={styles.processWrap}>
      <div className={styles.processFlow}>
        <div className={styles.processItemOne}>
          {stage >= 0 ? (
            <div className={styles.borderCircle}>
              <div>
                <h2 className={styles.processNumber}>1</h2>
              </div>
              <h1 className={styles.processTitle}>Join</h1>
            </div>
          ) : (
            <div className={styles.borderCircle} style={{ opacity: 0.2 }}>
              <div>
                <h2 className={styles.processNumber}>1</h2>
              </div>
              <h1 className={styles.processTitle}>Join</h1>
            </div>
          )}
        </div>
        <div className={styles.lineBetweenDiv12}></div>
        <div className={styles.processItemTwo}>
          {stage > 0 ? (
            <div className={styles.borderCircle}>
              <div>
                <h2 className={styles.processNumber}>2</h2>
              </div>
              <h1 className={styles.processTitle}>Checkout</h1>
            </div>
          ) : (
            <div className={styles.borderCircle} style={{ opacity: 0.2 }}>
              <div>
                <h2 className={styles.processNumber}>2</h2>
              </div>
              <h1 className={styles.processTitle}>Checkout</h1>
            </div>
          )}
        </div>
        <div className={styles.lineBetweenDiv23}></div>
        <div className={styles.processItemThree}>
          {stage > 1 ? (
            <div className={styles.borderCircle}>
              <div>
                <h2 className={styles.processNumber}>3</h2>
              </div>
              <h1 className={styles.processTitle}>Pay</h1>
            </div>
          ) : (
            <div className={styles.borderCircle} style={{ opacity: 0.2 }}>
              <div>
                <h2 className={styles.processNumber}>3</h2>
              </div>
              <h1 className={styles.processTitle}>Pay</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default ProgressBar
