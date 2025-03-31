import { useEffect, useRef, useState } from "react";

function MainMenu(props) {
    const [register, setRegister] = useState(true);
    const [users, setUsers] = useState([]);
    const [passwords, setPasswords] = useState(["", ""]);

    const usernameInput = useRef(null);
    const passwordInput = useRef(null);
    const errorText = useRef(null);
    const errorText2 = useRef(null);
    const selectedAccount = useRef(null);

    const changeRegister = () => {
        setRegister(!register);
    }
    const changePassword1 = (target) => {
        setPasswords([target.target.value, passwords[1]]);
    }
    const changePassword2 = (target) => {
        setPasswords([passwords[0], target.target.value]);
    }
    const createUser = () => {
        errorText.current.textContent = "";
        if(!usernameInput.current.value) {
            errorText.current.textContent = "please enter your username";
            return;
        }
        if(users.some((el) => el.username == usernameInput.current.value)) {
            errorText.current.textContent = "this username is already taken";
            return;
        }
        if(passwords[0] == passwords[1]) {
            // create user
            const newUsers = [...users, {
                username:usernameInput.current.value,
                password:passwords[0]
            }];
            setUsers(newUsers);
            window.electron.ipcRenderer.send("save-data", {
                fileName:"users.json",
                content:newUsers
            });
            passwordInput.current.value = "";
            setRegister(false);
        }
    }
    const loginUser = () => {
        errorText2.current.textContent = "";
        
        if(!users.some((el) => selectedAccount.current.value == el.username && passwordInput.current.value == el.password )) {
            errorText2.current.textContent = "wrong password";
            return;
        } else {
            // login user
            props.login(users.find((el) => selectedAccount.current.value == el.username && passwordInput.current.value == el.password));
        }
    }
    useEffect(() => {
        window.electron.ipcRenderer.send("load-data", {fileName: "users.json"});
        window.electron.ipcRenderer.on('loaded-data', (message) => {
            if(message.status != "error") {
                setUsers(message);
            }
        });
        return () =>{ window.electron.ipcRenderer.removeAllListeners('loaded-data')}
    }, []);
    return (
        <main className="text-white flex flex-row justify-evenly items-center h-screen">
            <section className="">
                <h1 className="text-7xl font-bold text-center">Notepad-designer app</h1>
               <section className="flex flex-col items-center justify-start">
                    <h1 className="font-bold text-4xl my-5 text-sky-600">{register ? "Create new user": "Login to new user"}</h1>
                    {
                    register ? <>
                        <input type="text" ref={usernameInput}  placeholder="username..." className="border-4 border-sky-600 bg-gray-900 px-6 py-4 rounded-xl m-2 font-bold focus:border-sky-800 outline-0 duration-300 ease-in-out"/>
                        <input type="password"  placeholder="password..." key={"password1"} className="border-4 border-sky-600 bg-gray-900 px-6 py-4 rounded-xl m-2 font-bold focus:border-sky-800 outline-0 duration-300 ease-in-out" onChange={changePassword1}/>
                        <input type="password" ref={passwordInput} key={"password2"} placeholder="retype a password..." className="border-4 border-sky-600 bg-gray-900 px-6 py-4 rounded-xl m-2 font-bold focus:border-sky-800 outline-0 duration-300 ease-in-out" onChange={changePassword2}/>
                        {passwords[0] != passwords[1] ? <p className="text-red-700 font-extrabold text-2xl">Passwords are not the same</p>: <></>}
                        <p ref={errorText} className="text-red-700 font-extrabold text-2xl"></p>
                        <button className="border-4 px-6 py-4 rounded-md border-sky-600 m-3 duration-200 ease-in-out hover:border-sky-300 cursor-pointer  font-bold" onClick={createUser}>Create a user</button>
                    </>:
                     users.length != 0 ? <>
                        <select ref={selectedAccount} onChange={() => {
                            passwordInput.current.value = "";
                        }} className="border-4 border-sky-600 bg-gray-900 px-6 py-4 rounded-xl m-2 font-bold focus:border-sky-800 outline-0 duration-300 ease-in-out w-sm">
                            {users.map((ele) => <option value={ele.username}>{ele.username}</option>)}
                        </select>
                        <input type="password" ref={passwordInput} key={"password3"} placeholder="Enter a password..." className="border-4 border-sky-600 bg-gray-900 px-6 py-4 rounded-xl m-2 font-bold focus:border-sky-800 outline-0"/>
                        <p ref={errorText2} className="text-red-700 font-extrabold text-2xl"></p>
                        <button onClick={loginUser} className="border-4 p-4 rounded-md border-sky-600 m-3 duration-200 ease-in-out hover:border-sky-300 cursor-pointer font-bold">Login to user</button>
                    </>
                    :
                    <>
                        <h1 className="text-red-700 font-extrabold text-4xl mb-6">No accounts avaiable</h1>
                    </>
                    }
               <button className="border-4 p-4 rounded-md border-sky-600 m-3 duration-200 ease-in-out hover:border-sky-300 cursor-pointer font-bold" onClick={changeRegister}>{register ? "I have account" : "Create new account"}</button>
               </section>
            </section>
            <section className="">
                <img src="/icon.png" alt="" width="500"/>
            </section>
        </main>
    )
}
export default MainMenu;