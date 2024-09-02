export interface UserType {
	id: number;
    username: string;
	password: string;
	is_staff: boolean;
	email: string;
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

export interface FileType {
	id: number;
	file_name: string;
	file: string;
	user_id: number;
	upload_date: string;
	size: number;
	path: string;
	unique_id: string;
}

export interface EditFileType {
	editFile: FileType | null;
}

export interface FileType {
	id: number;
	comment: string;
	file: string;
	file_name: string;
	last_download_date: string;
	path: string;
	size: number;
	unique_id: string;
	upload_date: string;
	user: number;
}