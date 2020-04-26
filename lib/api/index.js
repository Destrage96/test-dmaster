import users from './users';

export default $axios => ({
    users: users($axios),
})
