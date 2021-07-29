

const RevisionCard = (props) => {
  const revision = props.revision
  const index = props.index
  return(
    <>
    <div className="card my-2 mx-5"> 
      <div className="card-header">
        <div className="row display-5">
          <div className="card-text">{index === 0 ? 'Created' : 'Modified'} at {revision.timestamp}</div>
          <div className="card-text">{JSON.stringify(revision.revision)}</div>
        </div>
      </div>
    </div>
    </>
  )
}

export default RevisionCard