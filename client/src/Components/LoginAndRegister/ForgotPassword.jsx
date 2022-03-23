import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, getAllUsers, getLoginForgot } from '../../REDUX/actions/action';
import { useNavigate } from 'react-router-dom';


export const ForgotPassword = () => {
    const navigate = useNavigate() 
    const [showMessage, setShowMessage] = useState(false);
    const [showExist, setShowExist] = useState(false);
    const [formData, setFormData] = useState({});
    const dispatch = useDispatch()
    const defaultValues = {          
        email: '',        
    }
    const users = useSelector((state)=>state.users)    

    useEffect(()=>{
        dispatch(getAllUsers());        
    },[dispatch])

    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    const onSubmit = (data) => {
        const oneUser = users.filter(e=> e.email === data.email)
        console.log(data,"dataforgot")
        if(oneUser.length){
            setFormData(data);
            setShowMessage(true);
            dispatch(forgotPassword(data));
            dispatch(getLoginForgot(data.email));
            setTimeout(() => {
                navigate("/mailcode")
              }, 2000);            
        }else{
           setShowExist(true)
        }

        reset();
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };
    function handleNavigate() {
        setShowMessage(false);
        navigate("/");
      }
    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;
    const dialogFooterExist = (
        <div className="flex justify-content-center">
          <Button
            label="OK"
            className="p-button-text"
            autoFocus
            onClick={() => handleNavigate()}
          />
        </div>
    )

    return (
        <div className="form-demo">
            <Dialog
        visible={showExist}
        onHide={() => setShowExist(false)}
        position="top"
        footer={dialogFooterExist}
        showHeader={false}
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "30vw" }}
      >
        <div className="flex justify-content-center flex-column pt-6 px-3">
          <i
            className="pi pi-times-circle"
            style={{ fontSize: "5rem", color: "var(--orange-500)" }}
          ></i>
          <h5>Error</h5>
          <p style={{ lineHeight: 1.5, textIndent: "1rem" }}>
            <b>El email no tiene una cuenta creada. Registrate!</b>.
          </p>
        </div>
      </Dialog>
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Registration Successful!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        Your account is registered under name <b>{formData.name}</b>, under lastname <b>{formData.name}</b>, and email <b>{formData.email}</b>.
                    </p>
                </div>
            </Dialog>

            <div className="flex justify-content-center">
                <div className="card">
                    <h5 className="text-center">Forgot Password</h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">

                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-envelope" />
                                <Controller name="email" control={control}
                                    rules={{ required: 'Email is required.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address. E.g. example@email.com' }}}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="email" className={classNames({ 'p-error': !!errors.email })}>Email*</label>
                            </span>
                            {getFormErrorMessage('email')}
                        </div>

                        <Button type="submit" label="Submit" className="mt-2" />
                    </form>
                </div>
            </div>
        </div>
    );
}