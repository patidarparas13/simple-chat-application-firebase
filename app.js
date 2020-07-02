// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'Replace Your Credentials',
  authDomain: 'Replace Your Credentials',
  databaseURL: 'Replace Your Credentials',
  projectId: 'Replace Your Credentials',
  storageBucket: 'Replace Your Credentials',
  messagingSenderId: 'Replace Your Credentials',
  appId: 'Replace Your Credentials',
  measurementId: 'Replace Your Credentials',
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics

// Reference Cloud Firestore
var db = firebase.firestore()

// Get the name for the user
if (!localStorage.getItem('name')) {
  name = prompt('What is your name?')
  localStorage.setItem('name', name)
} else {
  name = localStorage.getItem('name')
}
document.querySelector('#name').innerText = name

// Change name
document.querySelector('#change-name').addEventListener('click', () => {
  name = prompt('What is your name?')
  document.querySelector('#name').innerText = name
})

// Send a new chat message
document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault()
  db.collection('messages')
    .add({
      name: name,
      message: document.querySelector('#message-input').value,
    })
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id)
      document.querySelector('#message-form').reset()
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
})

// Display chat stream
db.collection('messages').onSnapshot(function (snapshot) {
  document.querySelector('#messages').innerHTML = ''
  snapshot.forEach(function (doc) {
    var message = document.createElement('div')
    message.innerHTML = `
		<p class="name">${doc.data().name}</p>
		<p>${doc.data().message}</p>
		`
    document.querySelector('#messages').prepend(message)
  })
})

// Remove all chat messages
document.querySelector('#clear').addEventListener('click', () => {
  db.collection('messages')
    .get()
    .then(function (snapshot) {
      snapshot.forEach(function (doc) {
        db.collection('messages')
          .doc(doc.id)
          .delete()
          .then(function () {
            console.log('Document successfully deleted!')
          })
          .catch(function (error) {
            console.error('Error removing document: ', error)
          })
      })
    })
    .catch(function (error) {
      console.log('Error getting documents: ', error)
    })
})
