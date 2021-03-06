import axios from "axios"
import store from '../store';
import { useState } from "react"
import { useEffect } from "react"
import { Button, Modal } from 'react-bootstrap';
import { useHistory } from "react-router-dom";

const RevisionCard = (props) => {
  const [revision, setRevision] = useState('')
  const index = props.index
  const userId = store.getState().id
  const taskId = props.taskID
  const history = useHistory();
  const [lastEntry, setLastEntry] = useState(false)

  useEffect(() => {
    if (props.length === props.index) {
      setLastEntry(true)
    }
    if (props.revision.revision.assigned_to) {
      axios.get(`http://localhost:5000/user/${props.revision.revision.assigned_to}`).then((res) => {
        props.revision.revision.assigned_to = JSON.parse(res.data).email
        setRevision(props.revision)
      })
    } else {
      setRevision(props.revision)
    }

  }, [])

  function handleRollback() {
    const data = {'taskId': Number(taskId), 'userId': userId, 'revisionId': Number(revision.revisionId)}
    axios.post('http://localhost:5000/revisions/rollback', data).then((res) => {
      history.push('./taskboard')
    })
  }

  return(
    <>
    <div className="card my-2 mx-5"> 
      <div className="card-header">
        <div className="row display-5">
          <div className="card-text">{revision.rollbackTime !== 0 ? <span><h5>Rolled back to version at {revision.rollbackTime} with the following changes:</h5></span> : <span>{index === 0 ? <h5>Created As:</h5> : <h5>New Changes Made:</h5>}</span>} {revision.revision && Object.entries(revision.revision).length !== 0 ? Object.entries(revision.revision).map(([key,value]) => {
            return <div key={key}>{key}: {value.toString()}</div>
          }): 'No change to version directly above'} </div><br />
        </div>
      </div>
      <div className="card-footer" padding="100px">
        <div className="row display-5"> 
          {revision.rollback}
          <div className="card-text">{revision.rollbackTime !== 0 ? <span>Rolled Back</span>: <span>{index === 0 ? 'Created' : 'Modified'}</span>} by {revision.userName} ({revision.userEmail}) 
          <br />{revision.timestamp}</div><br />
          {lastEntry ? <button className="btn btn-success btn-lg">Current Version</button> :
          <button className="btn btn-success btn-lg" onClick={() => handleRollback()}>Version Rollback</button>
          }
        </div>
      </div>
    </div>
    <br />
    </>
  )
}

export default RevisionCard