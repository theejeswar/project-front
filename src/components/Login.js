import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../server/api";
import AuthContext from "../context/AuthProvider";

function Login() {
  const { setAuth } = useContext(AuthContext);
  const [success, setSuccess] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };

  const validateSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email address is required"),
    password: Yup.string().required("Password is required"),
  });

  const formikLogin = useFormik({
    initialValues: initialValues,
    validationSchema: validateSchema,
    onSubmit: async (values, { resetForm, setErrors }) => {
      try {
        const response = await api.post("/login", values);
        if (response.data.error) {
          setErrors({ email: response.data.error });
        } else {
          console.log(response.data);
          const accessToken = response?.data?.accessToken;
          setAuth({ values, accessToken });
          resetForm();
          setSuccess(true);
        }
      } catch (err) {
        if (!err?.response) {
          setErrors("No server response");
        } else if (err.response?.status === 400) {
          setErrors("Missing email or password");
        } else if (err.response?.status === 401) {
          setErrors("Unauthorized");
        } else {
          setErrors("Login failed");
        }
        console.error(err);
      }
    },
  });
  return (
    <div>
      {success ? (
        <section>
          <h2>You are logged in!!!</h2>
          <br />
          <p>
            <a href="#">Go to Home Page</a>
          </p>
        </section>
      ) : (
        <section>
          <form onSubmit={formikLogin.handleSubmit}>
            <h2>Login!!!</h2>
            <div>
              <label>Email: </label>
              <input
                type="email"
                id="email"
                name="email"
                disabled={false}
                autoComplete="off"
                onChange={formikLogin.handleChange}
                onBlur={formikLogin.handleBlur}
                value={formikLogin.values.email}
              />
              {formikLogin.touched.email && formikLogin.errors.email ? (
                <div>{formikLogin.errors.email}</div>
              ) : null}
            </div>
            <div>
              <label>Password: </label>
              <input
                type="password"
                id="password"
                name="password"
                disabled={false}
                autoComplete="off"
                onChange={formikLogin.handleChange}
                onBlur={formikLogin.handleBlur}
                value={formikLogin.values.password}
              />
              {formikLogin.touched.password && formikLogin.errors.password ? (
                <div>{formikLogin.errors.password}</div>
              ) : null}
            </div>
            <button type="submit">Submit</button>
          </form>
        </section>
      )}
    </div>
  );
}

export default Login;
