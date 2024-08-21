const PasswordInput: React.FC<{password: string, setPassword: (password: string) => void, confirm: boolean}> = ({ password, setPassword, confirm }) => {

    return (
        <>
            <label htmlFor={confirm ? 'password' : 'confirmPassword'}>{confirm ? 'Пароль:' : 'Подтвердите пароль:'}</label>
            <input
                type="password"
                value={password}
                className="form-control"
                id={confirm ? 'password' : 'confirmPassword'}
                placeholder='Пароль'
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
            />
        </>

    )
}

export default PasswordInput;

