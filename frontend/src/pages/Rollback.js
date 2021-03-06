import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import RevisionCard from '../components/RevisionCard'

const Rollback = (props) => {
  const history = useHistory()
  const task = props.location.state.task
  const [revisions, setRevisions] = useState('')
  useEffect(() => {
    axios.get(`http://localhost:5000/revisions/${task.id}`).then((res) => {
    setRevisions(JSON.parse(res.data))
  })
  }, [])

  function backClick () {
    history.goBack()
  }

  return (
    <>
    <div className="padding">
      <div className="row">
        <h1 className="col">Version history for Task ID #{task.id}: {task.title}</h1>
        <button className="col-md-2 btn btn-secondary btn-lg" onClick={() => backClick()}>Back</button>
      </div>
      {revisions ? revisions.map((revision, index) => {
        return <div key={revision.revisionId}> 
          <RevisionCard revision={revision} taskID={task.id} length={revisions.length-1} index={index}></RevisionCard>
        </div>
      }): ''}
    </div>
    </>
  )
}

export default Rollback