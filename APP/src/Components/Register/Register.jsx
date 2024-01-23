const Register = () => {
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [PW, setPW] = useState({ "password": "", "verifyPW": "" })
    const [isPwVerified, setIsPwVerified] = useState(false);
    const [errMessage, setErrMessage] = useState("");
    const [registerStep, setRgisterStep] = useState(1);
    const { currentUser, setCurrentUser } = useContext(userContext);
    const navigate = useNavigate();
    const user = {
        "id": 0,
        "name": "",
        "username": "",
        "email": "",
        "address": {
            "street": "",
            "suite": "",
            "city": "",
            "zipcode": "",
            "geo": {
                "lat": "",
                "lng": ""
            }
        },
        "phone": "",
        "website": "",
        "company": {
            "name": "",
            "catchPhrase": "",
            "bs": ""
        }
    }

    function handlePwVerifyChange(event) {
        event.preventDefault();
        setIsPwVerified(password === event.target.value);
    }

    const handlePasswordChange = (event) => {
        event.preventDefault();
        setPassword(event.target.value)
    }

    function handleNextBtn(event) {
        event.preventDefault();
        setErrMessage("");
        fetch(`http://localhost:3000/users?username=${event.target.username.value}`)
            .then(result => result.json())
            .then(json => json.length ? setErrMessage("This username already exists") : requestMoreDetails(event))
            .catch(error => setErrMessage("ERROR try agian"))
    }

    function requestMoreDetails(event) {
        user.username = event.target.username.value;
        user.website = event.target.password.value;
        setRgisterStep(2);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setErrMessage("");
        user.id = await getNextId() ?? alert("sorry, try later");
        user.name = event.target.name.value;
        user.email = event.target.email.value;
        user.address.street = event.target.street.value;
        user.address.suite = event.target.suite.value;
        user.address.city = event.target.city.value;
        user.address.zipcode = event.target.zipcode.value;
        user.address.geo.lat = event.target.lat.value;
        user.address.geo.lng = event.target.lng.value;
        user.address.phone = event.target.phone.value;
        user.company.name = event.target.companyName.value;
        user.company.catchPhrase = event.target.catchPhrase.value;
        user.company.bs = event.target.bs.value;
        fetch("http://localhost:3000/users", {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => {
                if (response.status === 201) {
                    fetch("http://localhost:3000/config/1", {
                        method: 'PATCH',
                        body: JSON.stringify({ "userId": (Number)(user.id) + 1 }),
                        headers: {
                            "Content-type": "application/json; charset=UTF-8",
                        },
                    }).then().catch(err => console.error(err))
                    delete user["website"]
                    localStorage.setItem("currentUser", JSON.stringify(user));
                    setCurrentUser(user);
                    navigate("/home", { replace: true });
                }
                else {
                    setErrMessage("500 something get worng:( try latter.")
                }
            })
    }

    async function getNextId() {
        const id = await fetch("http://localhost:3000/config/1")
            .then(result => result.json())
            .then(json => json.userId)
            .catch(error => console.error(error));
        return id.toString();
    }

    useEffect(() => {
        setIsPwVerified(!PW.password == "" && PW.password === PW.verifyPW);
    }, [PW.password, PW.verifyPW])

    return (
        <>
            <div className="signUp-wrapper">
                <h1>Please sign up</h1>
                <form onSubmit={(event) => handleNextBtn(event)}>
                    <label htmlFor="username">Username</label>
                    <input disabled={registerStep != 1} name="username" type="text" required />
                    <label htmlFor="password">Password</label>
                    <input disabled={registerStep != 1} onChange={(e) => setPW(prev => ({ ...prev, password: e.target.value }))} name="password" type="password" />
                    <label htmlFor="verifyPassword">Verify Password</label>
                    <input disabled={registerStep != 1} onChange={(e) => setPW(prev => ({ ...prev, verifyPW: e.target.value }))} name="verifyPassword" type="password" />
                    {registerStep === 1 && <div>
                        <button disabled={!isPwVerified} type="submit">Next</button>
                    </div>}
                </form>

                {registerStep === 2 && <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <input name="name" type="text" />
                    <label htmlFor="email">Email</label>
                    <input required name="email" type="email" />
                    <label>Address</label>
                    <label htmlFor="street">street</label>
                    <input required name="street" type="text" />
                    <label htmlFor="suite">suite</label>
                    <input required name="suite" type="text" />
                    <label htmlFor="city">city</label>
                    <input required name="city" type="text" />
                    <label htmlFor="zipcode">zipcode</label>
                    <input required name="zipcode" type="text" />
                    <label>geo</label>
                    <label htmlFor="lat">lat</label>
                    <input required name="lat" type="text" />
                    <label htmlFor="lng">lng</label>
                    <input required name="lng" type="text" />
                    <label htmlFor="phone">phone</label>
                    <input required name="phone" type="text" />
                    <label>company</label>
                    <label htmlFor="companyName">company name</label>
                    <input required name="companyName" type="text" />
                    <label htmlFor="catchPhrase">catchPhrase</label>
                    <input required name="catchPhrase" type="text" />
                    <label htmlFor="bs">bs</label>
                    <input required name="bs" type="text" />
                    <div>
                        <button type="submit">submit</button>
                    </div>
                </form>}
            </div>
            <p>{errMessage}</p>
        </>
    )

}
export default Register