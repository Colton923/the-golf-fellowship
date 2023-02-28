import styles from '../Card.module.css'

import { useForm } from 'react-hook-form'
import CardTwoSubmit from '../../functions/CardTwoSubmit'
import type { DefaultMembership } from '../../../../types/data/DefaultMembership'
import type { FormData } from '../../../../types/data/FormData'
import Chevron from '../Chevron/Chevron'

interface CardTwoProps {
  setCheckoutData: (data: any) => void
  setShowCardTwo: (data: boolean) => void
  setShowCardOne: (data: boolean) => void
  setShowCheckout: (data: boolean) => void
  setIntervalPurchase: (data: string) => void
  setTotalPrice: (data: number) => void
  setLineItemPrice: (data: number) => void
  setStage: (data: number) => void
  setCity: (data: string) => void
  setSelectedPlan: (data: string) => void
  setSelectedTerm: (data: string) => void
  setSelectedCity: (data: string) => void
  setFocusedElementID: (data: string) => void
  setShowPlan: (data: boolean) => void
  setShowTerm: (data: boolean) => void
  setCollapseCity: (data: boolean) => void
  setCollapsePlan: (data: boolean) => void
  setCollapseTerm: (data: boolean) => void
  membershipRef: any
  city: string
  selectedCity: string
  selectedTerm: string
  selectedPlan: string
  showPlan: boolean
  showTerm: boolean
  collapsePlan: boolean
  collapseTerm: boolean
  collapseCity: boolean
  membershipOptions: DefaultMembership
  setSelectedSubTerm: (data: string) => void
  setShowStatus: (data: boolean) => void
  setShowSubTerm: (data: boolean) => void
  setCollapseSubTerm: (data: boolean) => void
  setShowQuantity: (data: boolean) => void
  showSubTerm: boolean
  selectedSubTerm: string
  showQuantity: boolean
  showStatus: boolean
  collapseStatus: boolean
  selectedStatus: string
  collapseSubTerm: boolean
  setSelectedStatus: (data: string) => void
  setShowPrice: (data: boolean) => void
  setCollapseStatus: (data: boolean) => void
  showPrice: boolean
}

const CardTwo = (props: CardTwoProps) => {
  const {
    setCheckoutData,
    setShowCardTwo,
    setShowCardOne,
    setShowCheckout,
    setIntervalPurchase,
    setTotalPrice,
    setLineItemPrice,
    setStage,
    setCity,
    setSelectedPlan,
    setSelectedTerm,
    setSelectedCity,
    setFocusedElementID,
    setShowPlan,
    setShowTerm,
    setCollapseCity,
    setCollapsePlan,
    setCollapseTerm,
    membershipRef,
    city,
    selectedCity,
    selectedTerm,
    selectedPlan,
    showPlan,
    showTerm,
    collapsePlan,
    collapseTerm,
    collapseCity,
    membershipOptions,
    setSelectedSubTerm,
    setShowStatus,
    setShowSubTerm,
    setCollapseSubTerm,
    setShowQuantity,
    showSubTerm,
    selectedSubTerm,
    showQuantity,
    showStatus,
    collapseStatus,
    selectedStatus,
    collapseSubTerm,
    setSelectedStatus,
    setShowPrice,
    setCollapseStatus,
    showPrice,
  } = { ...props }

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const cities = ['San Antonio', 'Austin', 'DFW', 'Houston', 'Hill Country']
  const status = {
    returning: {
      title: 'Returning',
      price: 0,
    },
    new: {
      title: 'New',
      price: 2500,
    },
  }

  const CardTwoHandler = (data: FormData) => {
    CardTwoSubmit({
      setCheckoutData,
      setShowCardTwo,
      setShowCardOne,
      setShowCheckout,
      setIntervalPurchase,
      setTotalPrice,
      setLineItemPrice,
      setStage,
      selectedTerm,
      membershipRef,
      status,
      data,
    })
  }

  return (
    <form onSubmit={handleSubmit(CardTwoHandler)} className={styles.cardForm}>
      <div className={styles.cardFormItem}>
        {collapseCity ? (
          <div className={styles.selectWrap}>
            <label className={styles.cardFormItemLabel}>CITY: </label>
            <label className={styles.selectOption}>
              {selectedCity.toUpperCase()}
            </label>
          </div>
        ) : (
          <>
            <label className={styles.cardFormItemLabel}>CITY:</label>

            <div className={styles.cardFormItemGroup} id="cities">
              {cities.map((city) => (
                <div
                  key={city}
                  className={styles.cardFormOptionWrap}
                  onClick={() => {
                    setCity(city)
                    setSelectedCity(city)
                  }}
                >
                  <div className={styles.option}>
                    <input
                      className={styles.optionInput}
                      type="radio"
                      {...register('city')}
                      value={city}
                      onChange={(e) => {
                        setValue('city', e.target.value)
                        setShowPlan(true)
                        setFocusedElementID('plans')
                        setCollapseCity(true)
                      }}
                      onClick={() => {
                        setShowPlan(true)
                        setFocusedElementID('plans')
                        setCollapseCity(true)
                      }}
                    />
                    <label className={styles.optionLabel}>
                      <strong>{city.toUpperCase()}</strong>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <Chevron {...{ collapse: collapseCity, setCollapse: setCollapseCity }} />
      </div>
      {showPlan && (
        <div className={styles.cardFormItem}>
          {collapsePlan ? (
            <div className={styles.selectWrap}>
              <label className={styles.cardFormItemLabel}>PLAN:</label>
              <label className={styles.selectOption}>
                {selectedPlan.toUpperCase()}
              </label>
            </div>
          ) : (
            <>
              <label className={styles.cardFormItemLabel}>PLAN: </label>
              <div className={styles.cardFormItemGroup} id="plans">
                {Object.keys(membershipOptions).map((plan) =>
                  (city !== 'San Antonio' && plan === 'performerPlus') ||
                  (city !== 'San Antonio' && plan === 'playerPlus') ? null : (
                    <div
                      key={plan}
                      className={styles.cardFormOptionWrap}
                      onClick={() => {
                        setSelectedPlan(plan)
                      }}
                    >
                      <div className={styles.option}>
                        <input
                          className={styles.optionInput}
                          type="radio"
                          {...register('plan')}
                          value={plan}
                          onChange={(e) => {
                            setValue('plan', e.target.value)
                          }}
                          onClick={() => {
                            setShowTerm(true)
                            setFocusedElementID('terms')
                            setCollapsePlan(true)
                          }}
                        />
                        <label className={styles.optionLabel}>
                          <strong>{plan.toUpperCase()}</strong>
                        </label>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
          <Chevron
            {...{
              collapse: collapsePlan,
              setCollapse: setCollapsePlan,
            }}
          />
        </div>
      )}

      <div>
        {showTerm && (
          <div className={styles.cardFormItem}>
            {collapseTerm ? (
              <div className={styles.selectWrap}>
                <label className={styles.cardFormItemLabel}>TERM:</label>
                <label className={styles.selectOption}>
                  {selectedTerm.toUpperCase()}
                </label>
              </div>
            ) : (
              <>
                <label className={styles.cardFormItemLabel}>TERM:</label>

                <div className={styles.cardFormItemGroup} id="terms">
                  {Object.keys(
                    /* @ts-ignore */
                    membershipOptions['performer']
                  ).map((term) => (
                    <div
                      key={term}
                      className={styles.cardFormOptionWrap}
                      onClick={() => {
                        setSelectedTerm(term)
                      }}
                    >
                      <div className={styles.option}>
                        <input
                          className={styles.optionInput}
                          type="radio"
                          {...register('term')}
                          value={term}
                          onChange={(e) => {
                            setValue('term', e.target.value), setShowStatus(true)
                          }}
                          onClick={() => {
                            term === 'seasonal'
                              ? (setShowSubTerm(true),
                                setFocusedElementID('seasons'))
                              : (setShowSubTerm(false),
                                setShowQuantity(true),
                                setFocusedElementID('quantity'))
                            setCollapseTerm(true), setShowStatus(true)
                          }}
                        />
                        <label className={styles.optionLabel}>
                          <strong>{term.toUpperCase()}</strong>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            <Chevron
              {...{
                collapse: collapseTerm,
                setCollapse: setCollapseTerm,
              }}
            />
          </div>
        )}
      </div>
      {showSubTerm && (
        <div className={styles.cardFormItem} id="seasons">
          {collapseSubTerm ? (
            <div className={styles.selectWrap}>
              <label className={styles.cardFormItemLabel}>SEASON: </label>
              <label className={styles.selectOption}>
                {selectedSubTerm.toUpperCase()}
              </label>
            </div>
          ) : (
            <>
              <label className={styles.cardFormItemLabel}>SEASON: </label>
              <div className={styles.cardFormItemGroup}>
                {Object.keys(
                  /* @ts-ignore */
                  membershipOptions['performer']['seasonal']
                ).map((subTerm) => (
                  <div
                    key={subTerm}
                    className={styles.cardFormOptionWrap}
                    onClick={() => {
                      setSelectedSubTerm(subTerm)
                    }}
                  >
                    <div className={styles.option}>
                      <input
                        className={styles.optionInput}
                        type="radio"
                        {...register('subTerm')}
                        value={subTerm}
                        onChange={(e) => setValue('subTerm', e.target.value)}
                        onClick={() => {
                          setShowStatus(true),
                            setFocusedElementID('quantity'),
                            setCollapseSubTerm(true),
                            setShowQuantity(true)
                        }}
                      />
                      <label className={styles.optionLabel}>
                        <strong>{subTerm.toUpperCase()}</strong>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          <Chevron
            {...{
              collapse: collapseSubTerm,
              setCollapse: setCollapseSubTerm,
            }}
          />
        </div>
      )}
      {showQuantity && (
        <div className={styles.cardFormItem} id="quantity">
          <label className={styles.cardFormItemLabel}>QUANTITY: </label>
          <div className={styles.cardFormItemGroup}>
            <div className={styles.cardFormOptionWrap} style={{ height: '30px' }}>
              <div className={styles.option}>
                <input
                  className={styles.optionInput}
                  type="tel"
                  min="1"
                  max="10"
                  defaultValue={1}
                  {...register('quantity')}
                  onChange={(e) => {
                    setValue('quantity', parseInt(e.target.value))
                  }}
                  onInput={(e) => {
                    if (
                      e.currentTarget.value === '' ||
                      e.currentTarget.value === '0' ||
                      e.currentTarget.value.length > 1 ||
                      !Number(e.currentTarget.value)
                    ) {
                      e.currentTarget.value = '1'
                    } else {
                      e.currentTarget.value = Math.max(
                        1,
                        parseInt(e.currentTarget.value)
                      )
                        .toString()
                        .slice(0, 2)
                    }
                  }}
                  style={{
                    textAlign: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    width: '50px',
                    height: '30px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {showStatus && (
        <div className={styles.cardFormItem} id="status">
          {collapseStatus ? (
            <div className={styles.selectWrap}>
              <label className={styles.cardFormItemLabel}>STATUS:</label>
              <label className={styles.selectOption}>
                {selectedStatus.toUpperCase()}
              </label>
            </div>
          ) : (
            <>
              <label className={styles.cardFormItemLabel}>STATUS: </label>
              <div className={styles.cardFormItemGroup}>
                {Object.keys(status).map((statusKey) => (
                  <div
                    key={statusKey}
                    className={styles.cardFormOptionWrap}
                    onClick={() => {
                      setSelectedStatus(statusKey)
                      setFocusedElementID('checkoutButton')
                    }}
                  >
                    <div className={styles.option}>
                      <input
                        className={styles.optionInput}
                        type="radio"
                        {...register('status')}
                        value={statusKey}
                        onChange={(e) => setValue('status', e.target.value)}
                        onClick={() => {
                          setShowPrice(true), setCollapseStatus(true)
                        }}
                      />
                      <label className={styles.optionLabel}>
                        <strong>{statusKey.toUpperCase()}</strong>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          <Chevron
            {...{
              collapse: collapseStatus,
              setCollapse: setCollapseStatus,
            }}
          />
        </div>
      )}
      {showPrice && (
        <div className={styles.cardFormItemGroup}>
          <div className={styles.cardFormOptionWrap}>
            <div className={styles.option} id="checkoutButton">
              <button
                className={styles.optionInput}
                type="submit"
                onClick={() => {
                  setFocusedElementID('top')
                }}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, .01)',
                  color: 'black',
                  border: 'none',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

export default CardTwo
