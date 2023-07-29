const conversations = document.getElementById("conversations")
const url = 'http://localhost:3000'; // change url when uploading to server


const getUser = async () => { // Define an asynchronous function getUser
    const token = sessionStorage.getItem('token'); // Retrieve the token from the session storage
    try {
        const response = await fetch(url + '/employer', { // Send a GET request to the server to retrieve employer users
            headers: {
                'Authorization': 'Bearer ' + token // Include the token in the request headers
            }
        });
        console.log(response); // Log the response object to the console
        const users = await response.json(); // Parse the response body as JSON and store the resulting array of users in a variable
        console.log(users); // Log the users array to the console
    } catch (error) { // Catch any errors that occur during the request or response handling
        console.log(error.message); // Log the error message to the console
    }
};

getUser(); // Call the getUser function to retrieve and display the employer users.


