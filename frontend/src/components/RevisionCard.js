import axios from "axios"
import { useState } from "react"
import { useEffect } from "react"


const RevisionCard = (props) => {
  const [revision, setRevision] = useState('')
  const index = props.index

  useEffect(() => {
    if (props.revision.revision.assigned_to) {
      axios.get(`http://localhost:5000/user/${props.revision.revision.assigned_to}`).then((res) => {
        props.revision.revision.assigned_to = JSON.parse(res.data).email
        setRevision(props.revision)
      })
    }

    setRevision(props.revision)
  }, [])

  useEffect(() => {
    console.log(revision)
  }, [revision])

  return(
    <>
    <div className="card my-2 mx-5"> 
      <div className="card-header">
        <div className="row display-5">
          <div className="card-text">{index === 0 ? 'Created' : 'Modified'} at {revision.timestamp}</div>
          <div className="card-text">{JSON.stringify(revision.revision)} </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default RevisionCard