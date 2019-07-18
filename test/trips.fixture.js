function makeUsersArray() {
    return [
        {
          id: 1,
          full_name: "Christina Fuller",
          email: "demo@demo.com",
          password: "demo"
        },
        {
          id: 2,
          full_name: "Gina Monster",
          email: "bye@history.com",
          password: "byeeeee1"
        }
      ]
}
function makeTripsArray(){
    return [
        { id: 1, name: "Portland", numOfDays: 2, user_id: 1, completed: false },
        { id: 2, name: "Los Angeles", numOfDays: 3, user_id: 1, completed: false },
        { id: 3, name: "New Orleans", numOfDays: 4, user_id: 2, completed: false }
      ]
}

function makePlacesArray(){
    return [
        {
          id: 1,
          name: "Powells books",
          trip_id: 1,
          street_address: "1005 W Burnside St",
          city: "Portland",
          transportation: "Max blue line",
          notes: "Cool independent book store that Billy told me about",
          visited: false
        },
        {
          id: 2,
          name: "Washington Park",
          trip_id: 1,
          street_address: "4033 Southwest Canyon Road",
          city: "Portland",
          transportation: "car",
          notes: "Cool park that Sonya told me about",
          visited: false
        },
        {
          id: 3,
          name: "Griffith Park",
          trip_id: 2,
          street_address: "4730 Crystal Springs Dr",
          city: "Los Angeles",
          transportation: "car",
          notes: "Cool park in LA",
          visited: false
        },
        {
          id: 4,
          name: "Santa Monica Pier",
          trip_id: 2,
          street_address: "200 Santa Monica Pier",
          city: "Santa Monica",
          transportation: "car",
          notes: "Pier with fun stuff and was in a lot of movies",
          visited: false
        },
        {
          id: 5,
          name: "French Quarter",
          trip_id: 3,
          street_address: "St. Charles Avenue",
          city: "New Orleans",
          transportation: "car",
          notes: "Jenn said that it has a really cool vibe",
          visited: false
        },
        {
          id: 6,
          name: "St. Louis Cathedral",
          trip_id: 3,
          street_address: "615 Pere Antoine Aly,",
          city: "New Orleans",
          transportation: "car",
          notes: "Beautiful Cathedral ",
          visited: false
        }
      ]
}

module.exports ={
    makePlacesArray,
    makeTripsArray,
    makeUsersArray
}