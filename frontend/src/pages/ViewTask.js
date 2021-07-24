
const ViewTask = (props) => {
  const task = props.task
  const history = useHistory()
  
  return (
    <>
    <TaskCard key={task.id} task={task} ></TaskCard>
    </>
  )
}

export default ViewTask