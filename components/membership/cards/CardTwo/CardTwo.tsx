'use client'
import styles from './Cards.module.css'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import CardTwoSubmit from '../../functions/CardTwoSubmit'
import { CardTwoSubmitProps } from '../../../../types/props/CardTwoSubmitProps'

type RegisterForm = {
  firstNameCardOne: string
  lastNameCardOne: string
  emailCardOne: string
  phoneCardOne: string
}

interface CardTwoProps extends CardTwoSubmitProps {
  setCheckoutData: (data: any) => void
  setShowCardTwo: (data: boolean) => void
  setShowCardOne: (data: boolean) => void
  setShowCheckout: (data: boolean) => void
  setIntervalPurchase: (data: string) => void
  setTotalPrice: (data: number) => void
  setLineItemPrice: (data: number) => void
  setStage: (data: number) => void
  selectedTerm: string
  membershipRef: any
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
    setStage,a
    membershipRef,
    status,
    data,

  } = props

  const CardTwoHandler = () => {
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
      data,
      status,
    })
  }

  return (
    <form onSubmit={handleSubmit(CardTwoHandler)} className={styles.cardForm}>
      <div
        className={collapseCity ? styles.cardFormItem : styles.cardFormOneCollapsed}
      >
        <label className={styles.cardFormItemLabel}>CITY:</label>
        <label className={styles.cardFormItemLabel}>{city}</label>
      </div>
      <div
        className={collapseCity ? styles.cardFormOneCollapsed : styles.cardFormItem}
      >
        <label className={styles.cardFormItemLabel}>CITY</label>
        <div className={styles.cardFormItemGroup} id="cities">
          {cities.map((city) => (
            <div
              key={city}
              className={
                city === selectedCity
                  ? styles.cardFormOptionWrapSelect
                  : styles.cardFormOptionWrap
              }
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
                <label>{city.toUpperCase()}</label>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.svgWrap}>
        <div className={collapseCity ? styles.svgRotateOne : styles.svgRotateTwo}>
          <svg
            onClick={() => setCollapseCity(!collapseCity)}
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
      <div>
        {showPlan && (
          <>
            <div
              className={
                collapsePlan ? styles.cardFormItem : styles.cardFormOneCollapsed
              }
            >
              <label className={styles.cardFormItemLabel}>PLAN:</label>
              <label className={styles.cardFormItemLabel}>
                {selectedPlan.toUpperCase()}
              </label>
            </div>
            <div
              className={
                collapsePlan ? styles.cardFormOneCollapsed : styles.cardFormItem
              }
            >
              <label className={styles.cardFormItemLabel}>PLAN</label>
              <div className={styles.cardFormItemGroup} id="plans">
                {Object.keys(membershipOptions).map((plan) =>
                  (city !== 'San Antonio' && plan === 'performerPlus') ||
                  (city !== 'San Antonio' && plan === 'playerPlus') ? null : (
                    <div
                      key={plan}
                      className={
                        plan === selectedPlan
                          ? styles.cardFormOptionWrapSelect
                          : styles.cardFormOptionWrap
                      }
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
                        <label>{plan.toUpperCase()}</label>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className={styles.svgWrap}>
              <div
                className={collapsePlan ? styles.svgRotateOne : styles.svgRotateTwo}
              >
                <svg
                  onClick={() => setCollapsePlan(!collapsePlan)}
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
          </>
        )}
      </div>
      <div>
        {showTerm && (
          <>
            <div
              className={
                collapseTerm ? styles.cardFormItem : styles.cardFormOneCollapsed
              }
            >
              <label className={styles.cardFormItemLabel}>TERM:</label>
              <label className={styles.cardFormItemLabel}>
                {selectedTerm.toUpperCase()}
              </label>
            </div>
            <div
              className={
                collapseTerm ? styles.cardFormOneCollapsed : styles.cardFormItem
              }
            >
              <label className={styles.cardFormItemLabel}>TERM</label>
              <div className={styles.cardFormItemGroup} id="terms">
                {Object.keys(
                  /* @ts-ignore */
                  membershipOptions['performer']
                ).map((term) => (
                  <div
                    key={term}
                    className={
                      term === selectedTerm
                        ? styles.cardFormOptionWrapSelect
                        : styles.cardFormOptionWrap
                    }
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
                            ? (setShowSubTerm(true), setFocusedElementID('seasons'))
                            : (setShowSubTerm(false),
                              setShowQuantity(true),
                              setFocusedElementID('quantity'))
                          setCollapseTerm(true), setShowStatus(true)
                        }}
                      />
                      <label>{term.toUpperCase()}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.svgWrap}>
              <div
                className={collapseTerm ? styles.svgRotateOne : styles.svgRotateTwo}
              >
                <svg
                  onClick={() => setCollapseTerm(!collapseTerm)}
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
          </>
        )}
      </div>
      {showSubTerm && (
        <>
          <div
            className={
              collapseSubTerm ? styles.cardFormItem : styles.cardFormOneCollapsed
            }
          >
            <label className={styles.cardFormItemLabel}>SEASON:</label>
            <label className={styles.cardFormItemLabel}>
              {selectedSubTerm.toUpperCase()}
            </label>
          </div>
          <div
            className={
              collapseSubTerm ? styles.cardFormOneCollapsed : styles.cardFormItem
            }
            id="seasons"
          >
            <label className={styles.cardFormItemLabel}>SEASON</label>
            <div className={styles.cardFormItemGroup}>
              {Object.keys(
                /* @ts-ignore */
                membershipOptions['performer']['seasonal']
              ).map((subTerm) => (
                <div
                  key={subTerm}
                  className={
                    subTerm === selectedSubTerm
                      ? styles.cardFormOptionWrapSelect
                      : styles.cardFormOptionWrap
                  }
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
                    <label>{subTerm.toUpperCase()}</label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.svgWrap}>
            <div
              className={collapseSubTerm ? styles.svgRotateOne : styles.svgRotateTwo}
            >
              <svg
                onClick={() => setCollapseSubTerm(!collapseSubTerm)}
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
        </>
      )}
      {showQuantity && (
        <div className={styles.cardFormItem} id="quantity">
          <label className={styles.cardFormItemLabel}>QUANTITY</label>
          <div className={styles.cardFormItemGroup}>
            <div className={styles.cardFormOptionWrap} style={{ height: '30px' }}>
              <div className={styles.numberOption}>
                <input
                  className={styles.optionInputNumber}
                  type="number"
                  min="1"
                  max="10"
                  defaultValue={1}
                  {...register('quantity')}
                  onChange={(e) => {
                    setValue('quantity', parseInt(e.target.value))
                  }}
                  onInput={(e) => {
                    e.currentTarget.value = Math.max(
                      1,
                      parseInt(e.currentTarget.value)
                    )
                      .toString()
                      .slice(0, 1)
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {showStatus && (
        <>
          <div
            className={
              collapseStatus ? styles.cardFormItem : styles.cardFormOneCollapsed
            }
          >
            <label className={styles.cardFormItemLabel}>STATUS:</label>
            <label className={styles.cardFormItemLabel}>
              {selectedStatus.toUpperCase()}
            </label>
          </div>
          <div
            className={
              collapseStatus ? styles.cardFormOneCollapsed : styles.cardFormItem
            }
            id="status"
          >
            <label className={styles.cardFormItemLabel}>STATUS</label>
            <div className={styles.cardFormItemGroup}>
              {Object.keys(status).map((statusKey) => (
                <div
                  key={statusKey}
                  className={
                    statusKey === selectedStatus
                      ? styles.cardFormOptionWrapSelect
                      : styles.cardFormOptionWrap
                  }
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
                    <label>{statusKey.toUpperCase()}</label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.svgWrap}>
            <div
              className={collapseStatus ? styles.svgRotateOne : styles.svgRotateTwo}
            >
              <svg
                onClick={() => setCollapseStatus(!collapseStatus)}
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
        </>
      )}
      {showPrice && (
        <div className={styles.cardFormItemGroup}>
          <div className={styles.cardFormOptionWrap}>
            <div className={styles.option} id="checkoutButton">
              <button
                className={styles.checkoutButton}
                type="submit"
                onClick={() => {
                  setFocusedElementID('top')
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
