import { configureStore } from "@reduxjs/toolkit";
import usersReducer from '../slices/usersSlice';
import { userApi } from "../api/api";


const store = configureStore({
    reducer: {
        users: usersReducer,
        [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			immutableCheck: false,
			serializableCheck: false,
		}).concat(userApi.middleware),
})

export default store;