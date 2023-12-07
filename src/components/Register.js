import React from 'react'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import api from '../server/api';

function Register() {
    const initialValues = {
        firstname:'',
        lastname:'',
        email:'',
        password:''
    };
    const validateSchema = Yup.object({
        firstname: Yup.string().required('Firstname is required'),
        lastname: Yup.string().required('Lastname is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().required('Password is required').min(8, 'Atleat 8 characters required').max(16, 'Not exceed 16 characters')
    })
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validateSchema,
        onSubmit: async (values, {resetForm, setErrors}) =>{
            try {
            const response = await api.post('/register', values)
            if (response.data.error){
                setErrors({email:response.data.error})
            } else {
                console.log(response.data.message);
                resetForm();
            }
            } catch (err){
                if(err.response && err.response.status === 409){
                    setErrors({email: 'Email is already registered'});
                } else {
                    console.error(err);
                }
            }
        }
    })
  return (
    <div>
        <form onSubmit={formik.handleSubmit} className="my-4"> 
            <h2 className="mb-4">Register Here!!!</h2>
            <div className="mb-3">
                <label htmlFor="firstname" className="form-label">Firstname : </label>
                <input type="text" id="firstname" name="firstname" autoComplete="off" disabled={false}
                className={`form-control ${formik.touched.firstname && formik.errors.firstname? 'is-invalid': ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstname} />
                {formik.touched.firstname && formik.errors.firstname ? (
                    <div className="invalid-feedback">{formik.errors.firstname}</div>
                ): null}
            </div>
            <div className="mb-3">
                <label htmlFor="lastname" className="form-label">Lastname : </label>
                <input type="text" id="lastname" name="lastname" autoComplete="off" disabled={false}
                className={`form-control ${formik.touched.lastname && formik.errors.lastname? 'is-invalid': ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastname} />
                {formik.touched.lastname && formik.errors.lastname ? (
                    <div className="invalid-feedback">{formik.errors.lastname}</div>
                ): null}
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email :</label>
                <input type="email" id="email" name="email" autoComplete="off" disabled={false}
                className={`form-control ${formik.touched.email && formik.errors.email? 'is-invalid': ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email} />
                {formik.touched.email && formik.errors.email ? (
                    <div className="invalid-feedback">{formik.errors.email}</div>
                ): null}
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password :</label>
                <input type="password" id="password" name="password" disabled={false}
                className={`form-control ${formik.touched.password && formik.errors.password? 'is-invalid': ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password} />
                {formik.touched.password && formik.errors.password ? (
                    <div className="invalid-feedback">{formik.errors.password}</div>
                ): null}
            </div>
            <button type="submit" disabled={!formik.isValid} className="btn btn-primary">Submit</button>
        </form>
    </div>
  )
}

export default Register