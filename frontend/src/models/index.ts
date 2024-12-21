import { Dispatch } from "react";

export interface UserType {
  id: number;
  username: string;
  password: string;
  is_staff: boolean;
  email: string;
  folder_name?: string;
  is_authenticated: boolean;
  is_superuser?: boolean;
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
  user: string;
  file: string;
  upload_date: string;
  last_download_date: string;
  comment: string;
  path: string;
  size: number;
  unique_id: string;
}

export interface FileElement {
  user_id?: string;
  id: number;
  file_name: string;
  upload_date: string;
  last_download_date: string;
  comment: string;
  size: number;
  user: string;
}

export interface FileProps extends FileElement {
  currentFile: FileElement | null;
  setCurrentFile: (file: FileElement | null) => void;
  isOtherUserFile?: boolean;
}

export interface FileDescriptionProps {
  upload: string;
  download: string;
  size: number;
  comment: string;
}

export interface FileListProps {
  fileList: FileElement[];
  currentFile: FileElement | null; // Опциональный текущий файл
  setCurrentFile: (file: FileElement | null) => void; // Функция для установки текущего файла
  currentUser: string;
}

export interface FileAddProps {
  sendFile: (file: File) => void; // Исправлено: указали тип для sendFile
}

export interface FileElementLocal {
  file_name?: string;
  id?: number; // Типизируем идентификатор файла
  native_file_name: string; // Типизируем название файла
  comment?: string;
}


// export interface FileEditPanelProps {
//     currentFile: {
//         file_name: string;
//         id: number; // Типизируем идентификатор файла
//         native_file_name: string; // Типизируем название файла
//     };
//     setCurrentFile: () => void; // Функция сброса текущего файла
//     setFiles: (files: any[]) => void; // Функция обновления списка файлов
// }
export interface FileEditPanelProps {
  currentFile: FileElementLocal;
  setCurrentFile: () => void; // Функция сброса текущего файла
  setFiles: (files: Dispatch<FileElementLocal[]>) => void; // Функция обновления списка файлов
}


export interface FileGetLinkProps {
  link: string;
  setForm: () => void;
}


// export interface FileRenameProps {
//     currentFile: {
//         file_name: unknown;
//         id: number;
//         native_file_name: string;
//     };
//     setForm: () => void;
//     setFiles: (files: any[]) => void;
// }

export interface FileRenameProps {
  currentFile: FileElementLocal;
  setForm: () => void;
  setCurrentFile: (file: FileElement | null) => void;
  setFiles: (files: Dispatch<FileElementLocal[]>) => void;
}


// export interface FileDeleteProps {
//     currentFile: {
//         id: number;
//         native_file_name: string;
//     };
//     setForm: () => void;
//     setFiles: (files: any[]) => void;
//     setCurrentFile: () => void;
// }

export interface FileDeleteProps {
  currentFile: FileElementLocal;
  setForm: () => void;
  setFiles: (files: Dispatch<FileElementLocal[]>) => void;
  setCurrentFile: () => void;
}


// export interface FileCommentProps {
//     currentFile: {
//         id: number;
//         comment: string;
//         native_file_name: string;
//     };
//     setForm: () => void;
//     setFiles: (files: any[]) => void;
// }

export interface FileCommentProps {
  currentFile: FileElementLocal;
  setForm: () => void;
  setFiles: (files: Dispatch<FileElementLocal[]>) => void;

}

export interface UserTypeAdminPanel {
  id: number;
  username: string;
  email: string;
  is_staff?: boolean;
  isStaff?: boolean;
  isSuperUser?: boolean;
  numOfFiles?: number;
  size: number;
  count?: number;
  removeItem?: (id: number) => void;
}


export interface ToFolderBtnProps {
  userId: number; // Задаем явный тип для userId
}

export interface IsStaffBtnProps {
  isStaff: boolean;
  isSuperUser: boolean;
  onClickHandler: (method: "DELETE" | "PATCH") => void;
  setIsStaff: (value: boolean) => void;
  setIsSuperUser: (value: boolean) => void;
}
