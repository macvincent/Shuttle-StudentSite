let auth0 = null;

const fetchAuthConfig = () => fetch("/auth_config.json");
const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();

    auth0 = await createAuth0Client({
        domain: config.domain,
        client_id: config.clientId
    });
};

window.onload = async () => {
    await configureClient();
    updateUI();
    const isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
        return;
    }
    
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
        await auth0.handleRedirectCallback();
        updateUI();
    }else{
        login();
    }
};

const updateUI = async () => {
    const isAuthenticated = await auth0.isAuthenticated();
    if(isAuthenticated){
        $(".cuApp").css("display", "flex");
        let userDetails = await auth0.getUser();
        $("#profilePicture").attr("src", userDetails.picture);
        $("#name").text(" "+`${userDetails.given_name || userDetails.nickname || ''}`);
        window.history.replaceState({}, document.title, "/");
        initMap();
    }
};

const login = async () => {
    await auth0.loginWithRedirect({
      redirect_uri: window.location.origin
    });
};

const logout = () => {
    auth0.logout({
      returnTo: window.location.origin
    });
};