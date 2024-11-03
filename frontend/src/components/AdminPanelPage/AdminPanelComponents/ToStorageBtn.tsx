import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import state from '../../../GlobalState/state';


function ToStorageBtn({ userId: number }) {
    const { setCurrentStorageUser } = useContext(state);

    const onClickHandler = () => {
        setCurrentStorageUser(userId);
    };

    return (
        <Link
            to={{
                pathname: '/my-storage',
            }}
            onClick={onClickHandler}
            className="to-storage-btn"
        >
            to storage

        </Link>
    );
}


export default ToStorageBtn;