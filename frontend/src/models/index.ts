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

export interface EditFileType {
	editFile: FileType | null;
}

export interface FileType {
	id: number;
	file_name: string;
	user: number;
	file: string;
	upload_date: string;
	last_download_date: string;
	comment: string;
	path: string;
	size: number;
	unique_id: string;
}

export interface FileElement {
	id: number;
	file_name: string;
	upload_date: string;
	last_download_date: string;
	comment: string;
	size: number;
	user: string;
}

export interface FileProps extends FileElement {
    currentFile: FileElement;
    setCurrentFile: (file: FileElement) => void;
}

export interface FileDescriptionProps {
	upload: string;
	download: string; 
	size: number; 
	comment: string;
}

export interface FileListProps {
    fileList: FileElement[];
    currentFile: FileElement; // Опциональный текущий файл
    setCurrentFile: (file: FileElement) => void; // Функция для установки текущего файла
}

export interface FileAddProps {
    sendFile: (file: File) => void; // Исправлено: указали тип для sendFile
}

export interface FileEditPanelProps {
    currentFile: {
      id: number; // Типизируем идентификатор файла
      native_file_name: string; // Типизируем название файла
    };
    setCurrentFile: () => void; // Функция сброса текущего файла
    setFiles: (files: any[]) => void; // Функция обновления списка файлов
}

export interface FileGetLinkProps {
    link: string;
    setForm: () => void;
}

export interface FileRenameProps {
    currentFile: {
        id: number;
        native_file_name: string;
    };
    setForm: () => void;
    setFiles: (files: any[]) => void;
}

export interface FileDeleteProps {
    currentFile: {
        id: number;
        native_file_name: string;
    };
    setForm: () => void;
    setFiles: (files: any[]) => void;
    setCurrentFile: () => void;
}

export interface FileCommentProps {
    currentFile: {
        id: number;
        comment: string;
        native_file_name: string;
    };
    setForm: () => void;
    setFiles: (files: any[]) => void;
}

export interface UserTypeAdminPanel {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_staff: boolean;
    isStaff?: boolean;
    removeItem?: (id: number);
}