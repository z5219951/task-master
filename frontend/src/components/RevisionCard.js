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
  console.log(props)
  const history = useHistory();

  useEffect(() => {
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
    axios.post('http://localhost:5000/tasks/rollback', data).then((res) => {
      console.log(res.data)
      history.push('./taskboard')
    })
  }

  return(
    <>
    <div className="card my-2 mx-5"> 
      <div className="card-header">
        <div className="row display-5">
          <div className="card-text">{revision.rollbackTime !== 0 ? <span><h5>Rolled Back:</h5></span> : <span>{index === 0 ? <h5>Created As:</h5> : <h5>Changes Made:</h5>}</span>} {revision.revision ? Object.entries(revision.revision).map(([key,value]) => {
            return <div>{key}: {value.toString()}</div>
          }): ''} </div><br />
        </div>
      </div>
      <div className="card-footer" padding="100px">
        <div className="row display-5"> 
          {revision.rollback}
          <div className="card-text">{revision.rollbackTime !== 0 ? <span>Rolled Back</span>: <span>{index === 0 ? 'Created' : 'Modified'}</span>} by {revision.userName} ({revision.userEmail}) 
          <br />{revision.timestamp}</div><br />
          <button className="btn btn-success btn-lg" onClick={() => handleRollback()}>Version Rollback</button>
        </div>
      </div>
    </div>
    <br />
    </>
  )
}

export default RevisionCard