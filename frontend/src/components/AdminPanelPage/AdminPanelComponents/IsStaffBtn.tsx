import React from 'react';
import '../AdminPanel.css';
import { IsStaffBtnProps } from '../../../models';


const IsStaffBtn: React.FC<IsStaffBtnProps> = ({ isStaff, isSuperUser, onClickHandler, setIsStaff, setIsSuperUser }) => {
    const isStaffHandler = () => {
        const newIsStaff = !isStaff;
        const newIsSuperUser = !isSuperUser;
        
        setIsStaff(newIsStaff);
        setIsSuperUser(newIsSuperUser);

        onClickHandler('PATCH');
    };


    return (
        <div
            className={`is-staff-btn-container ${isStaff ? 'on' : 'off'}`}
            role="button"
            onClick={isStaffHandler}
            onKeyDown={isStaffHandler}
            tabIndex={0}
        >
            <div className="is-staff-btn" />
        </div>
    );
}


export default IsStaffBtn;