import axios from 'axios'

/* creating axios instance */
const api = axios.create({
    baseURL:import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials : true
})


/* register api */
export async function register({username , email , password}){

    try {
        const response = await api.post('/api/auth/register',{
        username, 
        email, 
        password
        });

        return response.data ; 

    } 
    catch (error) {
        console.log(error);
    }
   
}


/* login api */
export async function login({email , password}){

    try{
        const response = await api.post('/api/auth/login',{
            email,
            password
        })
        return response.data
    }
    catch(err){
        console.log(err);
    }
}


/* logout api */
export async function logout(){
    try{
        const response = await api.get('/api/auth/logout')

        return response.data
    }
    catch(err){
        console.log(err);
        
    }
}

/* user-info api */
export async function getMe(){
    try{
        const response = await api.get('/api/auth/get-me');
        return response.data
    }
    catch(err){
        console.log(err);
    }
}