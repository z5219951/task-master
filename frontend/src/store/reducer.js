
// id is the current user id. if id is '', it means that no one registers
// email store the email that user want to set new password
const defaultState = {
    id:'',
    email:'',
    loggedIn: false,
    userProfile:''
};

// make sure your action.type  is unique

export default (state = defaultState, action) =>{
    if(action.type === 'login_id') {
        const newState = JSON.parse(JSON.stringify(state));
        newState.id = action.value;
        return newState;
    }
    if(action.type === 'reset_email') {
        const newState = JSON.parse(JSON.stringify(state));
        newState.email = action.value;
        return newState;
    }
    if (action.type === 'loggedIn') {
        const newState = JSON.parse(JSON.stringify(state));
        newState.loggedIn = action.value;
        return newState;
    }
    if (action.type === 'user_profile') {
        const newState = JSON.parse(JSON.stringify(state));
        newState.loggedIn = action.value;
        return newState;
    }
    return state;
}