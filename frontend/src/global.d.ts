export {}; // Указываем, что файл является модулем

declare global {
    interface Window {
        sharedUserId: number; // Добавляем свойство к глобальному объекту window
    }
}
