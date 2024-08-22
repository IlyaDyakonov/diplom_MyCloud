export interface UserType {
    username: string;
	password: string;
	is_staff: boolean;
	email: string;
	id: number;
	folder_name?: string;
	is_authenticated: boolean;
}

export interface UserProps {
	loginUser: UserType | null;
	currentUser: UserType | null;
	activeState: 'logout' | 'login' | 'auth' | 'sign-up' | 'edit' | 'update';
	view: 'list' | 'grid';
	isLoading: boolean;
	error: string;
}

export interface LoginResponse {
    user: { username: string; email: string };
    token: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

// Типы данных для запроса на регистрацию
export interface RegisterResponse {
    user: { username: string; email: string };
}

export interface RegisterUser {
    username: string;
    email: string;
    password: string;
}