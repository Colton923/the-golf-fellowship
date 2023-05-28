'use client'

import { useState } from 'react'
const ExpandCollapseCellRenderer = (props: any) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { data } = props
  const toggleExpand = () => {
    const itemCount = Object.keys(data.products[0]).length
    setIsExpanded(!isExpanded)
    if (!isExpanded) {
      props.columnApi.setColumnWidth(props.column, 135 * itemCount)
    } else {
      setTimeout(() => {
        props.columnApi.setColumnWidth(props.column, 200)
      }, 200)
    }
  }

  return (
    <div onClick={toggleExpand}>
      {isExpanded ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            cursor: 'pointer',
            minWidth: '100px',
            minHeight: '50px',
          }}
        >
          {data.products.map((product: any) => {
            const keysData = Object.keys(product)
            return keysData.map((key) => {
              return (
                <div
                  className="expanded-row"
                  key={key}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    minWidth: '100px',
                    minHeight: '50px',
                    textAlign: 'center',
                  }}
                >
                  <p
                    style={{
                      fontSize: '12px',
                      margin: '1px',
                      padding: '1px',
                    }}
                  >
                    {key}
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      margin: '1px',
                      padding: '1px',
                    }}
                  >
                    {product[key]}
                  </p>
                </div>
              )
            })
          })}
        </div>
      ) : (
        <button>Expand</button>
      )}
    </div>
  )
}

export default ExpandCollapseCellRenderer
