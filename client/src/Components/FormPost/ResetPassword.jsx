import React,{useState,useMemo,useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {getAllUsers, resetPassword} from '../../REDUX/actions/action'
export default function ResetPassword() {
    function validate (){}
 const  user = useSelector((state)=> state.users)
console.log(user)
console.log(user)
 const dispatch = useDispatch()
 const [errors,setErrors] = useState({})
const [form,setForm] = useState({
    email:'',
    password:'',
    newpassword:'',
    repeatnewpassword:'',
})
const [submit,setSubmit] = useState({
    password:'',
    email:''
})
function validate(form){ 
    let errors = {};
    if(!form.email){
        errors.email = 'Se requiere un Email'
  
    } 
     if (form.password.length < 8 ){
        errors.password = 'La contraseña debe tener 8 o mas caracteres'
    } if (form.newpassword.length < 8 ){
        errors.newpassword = 'La contraseña debe tener 8 o mas caracteres'
    }  if (form.repeatnewpassword.length < 8 ){
        errors.repeatnewpassword = 'La contraseña debe tener 8 o mas caracteres'
    }
    
    
    if (form.password === form.newpassword){
        errors.newpassword = 'La contraseña nueva debe ser diferente'
    }
    if (form.newpassword !== form.repeatnewpassword ){
        errors.repeatnewpassword = 'Las nuevas contraseñas deben coincidir'
    }

    return errors;
}

const disableSubmit = useMemo(() =>{
    if(
        form.email.length >= 3 
        &&form.password.length >= 8 
        && form.newpassword.length >= 8 
        && form.repeatnewpassword.length >= 8 
        && form.password !==
        form.newpassword
       
        && form.newpassword.length ===
        form.repeatnewpassword.length 
        && form.newpassword ===
        form.repeatnewpassword 
        ){
           return false;
        }else{
            return true;
        }
    },[form]);


useEffect(()=>{
    dispatch(getAllUsers())
},[])
        
        
        
    



      
  



function handleChange (e) {
    if(e.target.name === 'repeatnewpassword'){
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
        setSubmit({
            ...submit,
           password: e.target.value
        })
        setErrors(validate({
            ...form,
            [e.target.name]: e.target.value
        }))
    }if( e.target.name === 'email'){
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
        setSubmit({
            ...submit,
            [e.target.name]: e.target.value
        })
        setErrors(validate({
            ...form,
            [e.target.name]: e.target.value
        }))


    }else {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    
        setErrors(validate({
            ...form,
            [e.target.name]: e.target.value
        }))
    }

    setForm({
        ...form,
        [e.target.name]: e.target.value
    })
    setErrors(validate({
        ...form,
        [e.target.name]: e.target.value
    }))
  //  console.log(e.target.value)


}

function resetSubmit (e) {
  const oneUser = user.filter(e => e.email === form.email)
  console.log(oneUser.map(e => e.email ),'soy oneUser')
 const onePass = oneUser.map(e => e.password )
 
    e.preventDefault()
    console.log(form)
    console.log(submit)
  dispatch(resetPassword(submit))


       
    
   
    
 
}
return (
    <div>
        <form  onSubmit={(e)=> resetSubmit(e)}>
            <div>
                <h1>Cambiar contraseña</h1>
            </div>
            <section>
            <div>
         <h3>E-mail</h3>
         <input   type='text'  value={form.email} name='email' onChange={(e) =>handleChange(e)}/>
        
           {
             errors.email && (<p>{errors.email}</p>)

           }
           
            </div>

            <div>
<h3>Contraseña anterior</h3>
<input   type='text'  value={form.password} name='password' onChange={(e) =>handleChange(e)}/>
{
             errors.password && (<p>{errors.password}</p>)

           }
            </div>

        <div>
        <h3>Contraseña nueva</h3>
        <input   type='text'  value={form.newpassword} name='newpassword' onChange={(e) =>handleChange(e)}/>
        {
                 errors.newpassword && (<p>{errors.newpassword}</p>) 
          }
        </div>
        <div>
            <h3>Repetir contraseña anterior</h3>
            <input   type='text'  value={form.repeatnewpassword} name='repeatnewpassword' onChange={(e) =>handleChange(e)}/>
          {
                 errors.repeatnewpassword && (<p>{errors.repeatnewpassword}</p>) 
          }
        </div>



        <button  type='submit' disabled={disableSubmit} >Confirmar</button>
        </section>
        </form>
    </div>
)

}