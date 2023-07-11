const Locations = () => {
  return (
    <>
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
    </>
  )
}
export default Locations
