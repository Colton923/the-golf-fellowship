'use client'

import { useState } from 'react'
const ExpandCollapseCellRenderer = (props: any) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { data } = props
  const toggleExpand = () => {
    const itemCount = Object.keys(data.products[0]).length
    setIsExpanded(!isExpanded)
    if (!isExpanded) {
      props.columnApi.setColumnWidth(props.column, 150 * itemCount)
    } else {
      setTimeout(() => {
        props.columnApi.setColumnWidth(props.column, 200)
      }, 200)
    }
  }

  console.log(data.products)
  return (
    <div onClick={toggleExpand}>
      {isExpanded ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            cursor: 'pointer',
            minWidth: '100px',
            minHeight: '50px',
          }}
        >
          {data.products.map((product: any, index: number) => {
            const keysData = Object.keys(product)
            return (
              <div
                key={data.firstName + index}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  minWidth: '100px',
                  width: '100%',
                  minHeight: '50px',
                  textAlign: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {keysData.map((key) => {
                  return (
                    <div
                      className="expanded-row"
                      key={key}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        minHeight: '50px',
                        textAlign: 'center',
                        flexWrap: 'wrap',
                        borderBottom: '1px solid black',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '12px',
                          margin: '0 5px 0 2px',
                          padding: '1px',
                        }}
                      >
                        {key}:
                      </p>
                      <p
                        style={{
                          fontSize: '12px',
                          margin: '0 5px 0 5px',
                          padding: '1px',
                        }}
                      >
                        {product[key]}
                      </p>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      ) : (
        <button>Expand</button>
      )}
    </div>
  )
}

export default ExpandCollapseCellRenderer
