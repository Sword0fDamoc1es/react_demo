import React, {useState,useEffect} from 'react';

function UserList(){
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [delay,setDelay] = useState('');
    const [lastTime, setLastTime] = useState('');

    // useEffect(() => {
    //     fetch(`https://reqres.in/api/users?delay=${delay ? `&delay=${delay}` : '3'}&_=${Date.now()}`)
    //     .then(response => response.json())
    //     .then(data => setUsers(data.data));
    // },[delay]);
    useEffect(() => {
        const fetchData = async () => {
            try{
                const url = `https://reqres.in/api/users?delay=${delay ? delay : '1'}`;
                const startTime = new Date();
                const response = await Promise.race([
                    fetch(url),
                    new Promise((resolve,reject) => setTimeout(() => reject(new Error('Timeout 3s.')),3000))
                ]);
                const endTime = new Date();
                const timeDiff = endTime.getTime()-startTime.getTime();
                setLastTime(`the last loaded time : ${endTime.toLocaleTimeString()}, using ${timeDiff}ms`);
                const data = await response.json();
                setUsers(data.data);
            } catch(error) {
                console.error(error);
            }
        };
        fetchData();
    },[delay,searchTerm]);

    const handleSearch = event => {
        setSearchTerm(event.target.value);
    }

    const handleDelay = () => {
        setDelay(5);
        setSearchTerm('');
    }

    const filteredUsers = users.filter(user => {
        return (user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.first_name.toLowerCase()+" "+user.last_name.toLowerCase()).includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    return (
        <div>
            <h1>User List:</h1>
            <div>{lastTime}</div>
            <div className='searchUser'>
                <label htmlFor='search'>Search: </label>
                <input type="text" id="search" onChange={handleSearch}></input>
            </div>
            <div>
                <button onClick={handleDelay}>Delay Simulation: 5s.</button>
            </div>
            {filteredUsers.length > 0 ? (
                <div>
                    {filteredUsers.map(user => (
                        <div key={user.id}>
                            <img src={user.avatar} alt={user.first_name}></img>
                            <h3>{user.first_name} {user.last_name}</h3>
                            <p>Email: {user.email}</p>
                        </div>
                        // <img key={user.id} src={user.avatar} alt={user.first_name}></img>
                    ))}
                </div>
            ) : (
                <p>Loading......</p>
            )}
            
        </div>
    );
}

export default UserList;