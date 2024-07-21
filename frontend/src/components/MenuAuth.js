import React from 'react';
import {useNavigate} from 'react-router-dom';
import {authSlice} from "../store/storeZustand";
import  {Logout} from "../hook/useReactQuery"

const CustomeMenuAuth = ({data}) => {
    const navigate = useNavigate();
    const authSliceToken = authSlice(state => (state.auth.token))
    const handleClick = (e) => {
        e.preventDefault();
        Logout()
        navigate("/Login")
    };

    return (
        <div>
            {
                data.path ? (
                    <a style={{color: "black", fontWeight: "bold"}} onClick={handleClick}>
                        {data.name}
                    </a>
                ) : (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <i className="dx-icon dx-icon-home" style={{marginRight: '8px', color:"black", }}></i>
                        <span style={{color: "black", fontWeight: "bold"}}>
                            {data.name}
                        </span>
                    </div>
                )
            }
        </div>
    );
};

export default CustomeMenuAuth;