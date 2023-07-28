type SalesBadgeProps = {
  color?: string
  text1?: string
  text2?: string
  text3?: string
  text4?: string
  middleTextSize?: string
  tint?: string
  middleTextFontSize?: string
  middleTextFontStretch?: string
  uniqueKey?: string
}

const SalesBadge = (props: SalesBadgeProps) => {
  const {
    color,
    text1,
    text2,
    text3,
    text4,
    middleTextSize,
    tint,
    middleTextFontSize,
    middleTextFontStretch,
    uniqueKey,
  } = props
  const defaultProps = {
    color: color || 'rgb(139, 0, 0)',
    text1: text1 || 'AUGUST 6 1:00PM',
    text2: text2 || 'AUSTIN',
    text3: text3 || 'CHAMPIONSHIP',
    text4: text4 || '',
    middleTextSize: middleTextSize || '6px',
    tint: tint || '500',
    middleTextFontSize: middleTextFontSize || '60px',
    middleTextFontStretch: middleTextFontStretch || '3',
  }

  const colorOne = defaultProps.color
  const temp = defaultProps.color.split('(')[1].split(')')[0]
  const rgba = temp.split(',')
  const tempTwo =
    Math.abs(parseInt(rgba[0]) - 22) +
    ', ' +
    Math.abs(parseInt(rgba[1]) - 23) +
    ', ' +
    Math.abs(parseInt(rgba[2]) - 30)
  const colorTwo = 'rgb(' + tempTwo + ')'
  const strokeColor =
    'rgb(' +
    Math.abs(parseInt(rgba[0]) - 45) +
    ', ' +
    Math.abs(parseInt(rgba[1]) - 45) +
    ', ' +
    Math.abs(parseInt(rgba[2]) - 45) +
    ')'

  if (defaultProps.text1.length > 18) {
    defaultProps.text1 = defaultProps.text1.slice(0, 18)
  }
  if (defaultProps.text2.length > 6) {
    defaultProps.text2 = defaultProps.text2.slice(0, 6)
  }
  if (defaultProps.text3.length > 18) {
    defaultProps.text3 = defaultProps.text3.slice(0, 18)
  }
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 300"
      style={{
        transform: 'rotate(-10deg)',
      }}
      id={`${uniqueKey}svg${defaultProps.text1}`}
    >
      <defs>
        <linearGradient id={`${uniqueKey}lgOne`}>
          <stop stopColor={`${colorOne}`} stopOpacity="1" offset="0" />
          <stop stopColor={`${colorTwo}`} stopOpacity="0.5" offset="1" />
        </linearGradient>
        {/* text filter */}
        <filter id={`${uniqueKey}fThree`} colorInterpolationFilters="sRGB">
          <feFlood
            floodOpacity=".4"
            floodColor="rgb(0,0,0)"
            result="flood"
            id={`${uniqueKey}feFlood5829`}
          />
          <feComposite
            in="flood"
            in2="SourceGraphic"
            operator="in"
            result="composite1"
            id={`${uniqueKey}feComposite5831`}
          />
          <feGaussianBlur
            stdDeviation="1"
            result="blur"
            id={`${uniqueKey}feGaussianBlur5833`}
          />
          <feOffset dx="1" dy="1" result="offset" id={`${uniqueKey}feOffset5835`} />
          <feComposite
            in="SourceGraphic"
            in2="offset"
            operator="over"
            result="composite2"
            id={`${uniqueKey}feComposite5837`}
          />
        </filter>

        <filter id={`${uniqueKey}fOne`} colorInterpolationFilters="sRGB">
          <feFlood
            floodOpacity="1"
            floodColor="rgb(0,0,0)"
            result="flood"
            id={`${uniqueKey}feFlood5829`}
          />
          <feComposite
            in="flood"
            in2="SourceGraphic"
            operator="in"
            result="composite1"
            id={`${uniqueKey}feComposite5831`}
          />
          <feGaussianBlur
            stdDeviation="1"
            result="blur"
            id={`${uniqueKey}feGaussianBlur5833`}
          />
          <feOffset dx="1" dy="1" result="offset" id={`${uniqueKey}feOffset5835`} />
          <feComposite
            in="SourceGraphic"
            in2="offset"
            operator="over"
            result="composite2"
            id={`${uniqueKey}feComposite5837`}
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.3
                    0 0 0 0 0.3
                    0 0 0 0 0.3
                    0 0 0 1 0"
            result="darken"
            id={`${uniqueKey}feColorMatrix5839`}
          />
        </filter>
        <radialGradient
          xlinkHref={`#${uniqueKey}lgOne`}
          id={`${uniqueKey}radialGradient4207`}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(0.56626527, -1.9491737,2.6535343,0.77089145,5592.9315,-3935.7797)"
          cx="-1918.6243"
          cy="-1878.2841"
          fx="-1918.6243"
          fy="-1878.2841"
          r="73.47414"
        />

        <radialGradient
          xlinkHref={`#${uniqueKey}lgOne`}
          id={`${uniqueKey}radialGradient4221`}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(0.67830627,-0.52701445,0.42848693,0.55149129,1656.5395,2090.3276)"
          cx="-669.98749"
          cy="-2476.3098"
          fx="-669.98749"
          fy="-2476.3098"
          r={defaultProps.tint}
        />
      </defs>
      <g transform="translate(0,-752.36218)">
        <g>
          <rect
            ry="30.000004"
            rx="29.999998"
            y="771.67261"
            x="19.310228"
            height="261.3797"
            width="261.3797"
            fill={`url(#${uniqueKey}radialGradient4221)`}
            fillOpacity="1"
            stroke="none"
            filter={`url(#${uniqueKey}fTwo)`}
          />
          <rect
            transform="matrix(3.173314,0,0,3.173314,1777.8554,6245.1647)"
            opacity="0.6"
            fill={`url(#${uniqueKey}radialGradient4207)`}
            fillOpacity="1"
            stroke={`${strokeColor}`}
            strokeWidth="0.63025582"
            strokeMiterlimit="4"
            strokeDasharray="none"
            filter={`url(#${uniqueKey}fOne)`}
            width="88.123566"
            height="88.123566"
            x="-557.04456"
            y="-1727.7283"
            rx="9.4538393"
            ry="9.4538393"
          />
        </g>
      </g>
      <g>
        <text
          x="50%"
          y="20%"
          textAnchor="middle"
          fill="#f9f9f9"
          fontSize="24px"
          fontWeight="bold"
          filter={`url(#${uniqueKey}fThree)`}
        >
          {defaultProps.text1}
        </text>
        <line
          x1="10%"
          y1="25%"
          x2="90%"
          y2="25%"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
        />
        <text
          x="50%"
          y="53.5%"
          textAnchor="middle"
          fill="#f9f9f9"
          fontWeight={200}
          fontSize={defaultProps.middleTextFontSize}
          filter={`url(#${uniqueKey}fThree)`}
          style={{
            transformOrigin: 'center',
            transform: `scaleY(${defaultProps.middleTextFontStretch})`,
            letterSpacing: defaultProps.middleTextSize,
          }}
        >
          {defaultProps.text2}
        </text>

        <line
          x1="10%"
          y1="75%"
          x2="90%"
          y2="75%"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
        />
        <text
          x="50%"
          y="85%"
          textAnchor="middle"
          fill="#f9f9f9"
          fontSize="24px"
          fontWeight="bold"
          filter={`url(#${uniqueKey}fThree)`}
        >
          {defaultProps.text3}
        </text>
      </g>
    </svg>
  )
}

export default SalesBadge
